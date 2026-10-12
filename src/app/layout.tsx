import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { ModalRoot } from '@/components/modals/ModalRoot';
import { AndroidBackHandler } from '@/components/layout/AndroidBackHandler';

export const metadata: Metadata = {
  title: 'Next — Next. Not everything.',
  description: 'A calm, intuitive personal executive-function tool designed around task initiation, overwhelm reduction, routines, and returning after falling off.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Next',
  },
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow pinch-zoom for accessibility — do not set maximumScale: 1
  // Capacitor handles native zoom prevention at the WebView level
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F5F0' },
    { media: '(prefers-color-scheme: dark)', color: '#12131C' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the inline theme script mutates className before
    // React hydrates, causing an intentional server/client mismatch on the html element.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          CRITICAL — Theme initializer: runs synchronously before the browser paints
          any pixels, so the correct dark/light class is already on <html> when CSS is
          applied. This eliminates the dark↔light flicker visible on cold launch and
          every app resume on Android WebView.

          Logic (mirrors store.tsx updateSettings):
            1. Read next_settings_v1 from localStorage.
            2. If theme === 'light'  → remove 'dark'.
            3. If theme === 'system' → follow prefers-color-scheme.
            4. Anything else (incl. 'dark' or missing) → add 'dark' (default).

          This must be a plain synchronous <script> in the <head> — Next.js Script
          strategies (beforeInteractive, afterInteractive) all defer to after React
          hydration, which is too late and causes the visible flash.
        */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('next_settings_v1');var t=s?JSON.parse(s).theme:'dark';if(t==='light'){document.documentElement.classList.remove('dark');}else if(t==='system'){if(!window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="bg-canvas dark:bg-canvas-dark text-ink-primary dark:text-linen font-sans selection:bg-amber-500/20 selection:text-amber-300">
        <AppProvider>
          {/* Subtle warm ambient atmospheric glow in dark mode — never intercepts pointer events */}
          <div className="pointer-events-none select-none" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(229,149,63,0.07),rgba(116,105,182,0.04),transparent_70%)] blur-3xl opacity-90 dark:block hidden" />
          </div>

          {/* Keep the app shell inside the visible viewport; only main content scrolls. */}
          <div className="flex h-dvh min-h-0 overflow-hidden">
            {/* Responsive Navigation: Sidebar on desktop, Bottom nav on mobile */}
            <Navbar />

            {/* Main Content Area
                - md:pl-64 offsets the desktop sidebar
                - On mobile: full width with horizontal padding
                - pb-nav ensures content doesn't hide behind the bottom nav on mobile
                - md:pb-0 removes that on desktop where sidebar is used instead
            */}
            <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth-touch md:pl-64 px-4 sm:px-5 lg:px-8 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(1.25rem+env(safe-area-inset-top,0px))] pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-10">
              {children}
            </main>
          </div>

          {/* Unified Modal Root */}
          <ModalRoot />
          <AndroidBackHandler />
        </AppProvider>

        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

              window.addEventListener('load', function() {
                if (isLocalhost) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    return Promise.all(registrations.map(function(reg) {
                      return reg.unregister();
                    }));
                  }).catch(function(err) {
                    console.warn('[SW] Local dev cleanup failed:', err);
                  });
                  return;
                }

                navigator.serviceWorker.register('/sw.js')
                  .then(function(reg) {
                    console.log('[SW] Registered, scope:', reg.scope);
                  })
                  .catch(function(err) {
                    console.warn('[SW] Registration failed:', err);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
