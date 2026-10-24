import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const CDP_PORT = 9222;

const PROJECT_ROOT = 'c:\\Users\\Ruth.A\\Desktop\\New folder\\Next';
const ARTIFACTS_DIR = 'C:\\Users\\Ruth.A\\.gemini\\antigravity-ide\\brain\\96b68374-1650-4c5b-bdff-d1a55c4d6542\\screenshots';
const LOCAL_SCREENSHOTS_DIR = path.join(PROJECT_ROOT, '.visual-inspections', 'screenshots');

for (const dir of [ARTIFACTS_DIR, LOCAL_SCREENSHOTS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.eventHandlers = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) {
            reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          } else {
            resolve(msg.result);
          }
        } else if (msg.method) {
          const handlers = this.eventHandlers.get(msg.method) || [];
          for (const handler of handlers) {
            handler(msg.params);
          }
        }
      };
    });
  }

  on(method, handler) {
    if (!this.eventHandlers.has(method)) {
      this.eventHandlers.set(method, []);
    }
    this.eventHandlers.get(method).push(handler);
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runVisualInspection() {
  console.log('=== CODEX VISUAL UI INSPECTION & VERIFICATION ===');
  console.log(`Target: ${BASE_URL}`);

  const tempUserDataDir = path.join(os.tmpdir(), `codex_chrome_inspect_${Date.now()}`);
  fs.mkdirSync(tempUserDataDir, { recursive: true });

  console.log(`Starting isolated Chrome process (user-data-dir: ${tempUserDataDir})...`);
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${tempUserDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--no-sandbox',
    'about:blank'
  ], { stdio: 'ignore' });

  // Wait for CDP endpoint to become ready
  let version = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (res.ok) {
        version = await res.json();
        break;
      }
    } catch {}
    await sleep(300);
  }

  if (!version) {
    throw new Error('Chrome CDP endpoint did not start in time.');
  }

  console.log(`Connected to Chrome: ${version.Browser}`);

  // Create a new target page
  const newPageRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(BASE_URL)}`, { method: 'PUT' });
  const newPageData = await newPageRes.json();
  const cdp = new CDPClient(newPageData.webSocketDebuggerUrl);
  await cdp.connect();

  const consoleErrors = [];
  const consoleLogs = [];

  cdp.on('Console.messageAdded', (params) => {
    if (params.message.level === 'error') {
      consoleErrors.push(params.message.text);
    } else {
      consoleLogs.push(`[${params.message.level}] ${params.message.text}`);
    }
  });

  cdp.on('Runtime.exceptionThrown', (params) => {
    consoleErrors.push(`Exception: ${params.exceptionDetails?.text || ''} ${params.exceptionDetails?.exception?.description || ''}`);
  });

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Console.enable');

  // Save screenshot helper
  async function takeScreenshot(filename) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(data, 'base64');
    for (const d of [ARTIFACTS_DIR, LOCAL_SCREENSHOTS_DIR]) {
      fs.writeFileSync(path.join(d, filename), buffer);
    }
    console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    return buffer.length;
  }

  async function waitForReady(timeoutMs = 8000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const res = await cdp.send('Runtime.evaluate', {
          expression: `
            Boolean(document.readyState === 'complete' && document.body && document.body.innerText.trim().length > 10)
          `,
          returnByValue: true
        });
        if (res?.result?.value) return true;
      } catch {}
      await sleep(250);
    }
  }

  // Navigate and wait helper
  async function navigateTo(urlPath) {
    const fullUrl = `${BASE_URL}${urlPath}`;
    console.log(`\nNavigating to: ${fullUrl}...`);
    await cdp.send('Page.navigate', { url: fullUrl });
    await waitForReady();
    await sleep(500);
  }

  const results = {
    step1_open: false,
    step2_today_screenshot: false,
    step3_content_and_controls: null,
    step4_navigation: {},
    step5_viewports: {},
    step6_console_errors: [],
    step7_interaction: null,
    step8_routine_creation_ui: null,
  };

  try {
    // Ensure onboarding is completed in our isolated test session to render full TodayPage
    await navigateTo('/');
    await cdp.send('Runtime.evaluate', {
      expression: `
        try {
          const s = localStorage.getItem('next_settings_v1');
          const parsed = s ? JSON.parse(s) : {};
          parsed.hasCompletedOnboarding = true;
          localStorage.setItem('next_settings_v1', JSON.stringify(parsed));
          location.reload();
        } catch(e) {}
      `
    });
    await waitForReady();
    await sleep(500);

    // 1. Open http://localhost:3000
    const pageTitleResult = await cdp.send('Runtime.evaluate', { expression: 'document.title', returnByValue: true });
    results.step1_open = true;
    console.log(`Step 1 Success: Today Page Title = "${pageTitleResult.result.value}"`);

    // 2. Capture screenshot of rendered Today page
    await takeScreenshot('01_today_page.png');
    results.step2_today_screenshot = true;

    // 3. Read page content and identify visible controls
    const domSummary = await cdp.send('Runtime.evaluate', {
      expression: `
        ({
          heading: document.querySelector('h1')?.innerText || '',
          buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean),
          links: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') })).filter(a => a.text),
          visibleCards: Array.from(document.querySelectorAll('section, article, div[class*="rounded"]')).length
        })
      `,
      returnByValue: true
    });
    results.step3_content_and_controls = domSummary.result.value;
    console.log('Step 3 Success: Visible Controls found:');
    console.log(`  Heading: "${results.step3_content_and_controls.heading}"`);
    console.log(`  Visible Buttons (${results.step3_content_and_controls.buttons.length}):`, results.step3_content_and_controls.buttons.slice(0, 6));
    console.log(`  Visible Links (${results.step3_content_and_controls.links.length}):`, results.step3_content_and_controls.links.map(l => `${l.text} (${l.href})`).slice(0, 6));

    // 4. Navigate to /plan, /focus-session, /routines, /check-in, /history, and /settings
    const routes = [
      { path: '/plan', name: '02_plan_page.png' },
      { path: '/focus-session', name: '03_focus_session_page.png' },
      { path: '/routines', name: '04_routines_page.png' },
      { path: '/check-in', name: '05_checkin_page.png' },
      { path: '/history', name: '06_history_page.png' },
      { path: '/settings', name: '07_settings_page.png' }
    ];

    for (const route of routes) {
      await navigateTo(route.path);
      const h1Text = await cdp.send('Runtime.evaluate', { expression: 'document.querySelector("h1")?.innerText || ""', returnByValue: true });
      const size = await takeScreenshot(route.name);
      results.step4_navigation[route.path] = {
        h1: h1Text.result.value,
        screenshotBytes: size,
        status: 'OK'
      };
      console.log(`  ${route.path} -> H1: "${h1Text.result.value}"`);
    }

    // 5. Test Routine Creation and Steps UI in browser
    console.log('\nTesting Routine Creation & Steps UI in browser...');
    await navigateTo('/routines');
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const allBtns = Array.from(document.querySelectorAll('button'));
          const newRoutineBtn = allBtns.find(b => b.innerText.includes('New routine') || b.innerText.includes('Create a routine'));
          if (newRoutineBtn) newRoutineBtn.click();
        })()
      `
    });
    await sleep(800);
    await takeScreenshot('12_new_routine_modal.png');

    const routineModalCheck = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const titleInput = document.querySelector('#routine-title');
          const stepInput = document.querySelector('input[placeholder*="Add step name"]');
          const emptyState = document.querySelector('[data-purpose="steps-empty-state"]');
          const addStepBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Add step'));
          return {
            hasTitleInput: !!titleInput,
            hasStepInput: !!stepInput,
            hasEmptyState: !!emptyState,
            hasAddStepBtn: !!addStepBtn,
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Routine Modal UI Verification:', routineModalCheck.result.value);

    // Test adding step 1 and step 2
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const setReactValue = (el, val) => {
            const proto = window.HTMLInputElement.prototype;
            const set = Object.getOwnPropertyDescriptor(proto, 'value').set;
            set.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
          };

          const titleInput = document.querySelector('#routine-title');
          if (titleInput) setReactValue(titleInput, 'Morning Flow');

          const stepInput = document.querySelector('input[placeholder*="Add step name"]');
          if (stepInput) {
            setReactValue(stepInput, 'Drink 1 full glass of water');
            const addStepBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Add step'));
            if (addStepBtn) addStepBtn.click();
          }
        })()
      `
    });
    await sleep(700);

    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const setReactValue = (el, val) => {
            const proto = window.HTMLInputElement.prototype;
            const set = Object.getOwnPropertyDescriptor(proto, 'value').set;
            set.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
          };

          const stepInput = document.querySelector('input[placeholder*="Add step name"]');
          if (stepInput) {
            setReactValue(stepInput, 'Gentle morning stretch');
            const addStepBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Add step'));
            if (addStepBtn) addStepBtn.click();
          }
        })()
      `
    });
    await sleep(700);
    await takeScreenshot('13_routine_with_steps_added.png');

    const stepAddedCheck = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const stepInputs = Array.from(document.querySelectorAll('input[aria-label*="title"]'));
          return {
            stepCount: stepInputs.length,
            stepTitles: stepInputs.map(i => i.value),
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Steps Added Verification:', stepAddedCheck.result.value);
    results.step8_routine_creation_ui = {
      modal: routineModalCheck.result.value,
      steps: stepAddedCheck.result.value
    };

    // Close the modal
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = document.querySelector('button[aria-label="Close dialog"]');
          if (closeBtn) closeBtn.click();
        })()
      `
    });
    await sleep(500);

    // 6. Viewport inspection: Mobile & Desktop
    console.log('\nTesting Mobile and Desktop Viewports...');
    await navigateTo('/');

    // Mobile Viewport (iPhone 14 / mobile: 390x844)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(500);
    const mobileSize = await takeScreenshot('08_today_mobile.png');
    results.step5_viewports.mobile = { viewport: '390x844', screenshotBytes: mobileSize };

    // Desktop Viewport (1440x900)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(500);
    const desktopSize = await takeScreenshot('09_today_desktop.png');
    results.step5_viewports.desktop = { viewport: '1440x900', screenshotBytes: desktopSize };

    // 7. Console errors summary
    results.step6_console_errors = consoleErrors;
    console.log(`\nConsole Errors Collected: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

    // 8. Interact with a safe, reversible UI control
    console.log('\nTesting safe, reversible interaction on Settings page...');
    await navigateTo('/settings');
    await takeScreenshot('10_interaction_before.png');

    const beforeState = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const accent = document.documentElement.getAttribute('data-accent') || 'amber';
          const isDark = document.documentElement.classList.contains('dark');
          return { currentAccent: accent, isDark };
        })()
      `,
      returnByValue: true
    });

    const clickResult = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const target = buttons.find(b => b.innerText.includes('Dark') || b.innerText.includes('Light') || b.innerText.includes('System'));
          if (target) {
            target.click();
            return { clickedText: target.innerText.trim(), success: true };
          }
          return { success: false, buttons: buttons.map(b => b.innerText.trim()).filter(Boolean) };
        })()
      `,
      returnByValue: true
    });

    await sleep(600);
    await takeScreenshot('11_interaction_after.png');

    const afterState = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            accent: document.documentElement.getAttribute('data-accent'),
            isDark: document.documentElement.classList.contains('dark')
          };
        })()
      `,
      returnByValue: true
    });

    results.step7_interaction = {
      before: beforeState.result.value,
      action: clickResult.result.value,
      after: afterState.result.value
    };
    console.log('After interaction state:', results.step7_interaction);

  } finally {
    cdp.close();
    chromeProcess.kill('SIGKILL');
    try {
      fs.rmSync(tempUserDataDir, { recursive: true, force: true });
    } catch {}
  }

  const reportPath = path.join(PROJECT_ROOT, '.visual-inspections', 'inspection-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== INSPECTION COMPLETED SUCCESSFULLY ===`);
  console.log(`Report saved to: ${reportPath}`);
  return results;
}

runVisualInspection().catch((err) => {
  console.error('Visual inspection failed:', err);
  process.exit(1);
});
