export type BreakdownDetail = 'simpler' | 'normal' | 'detailed';

interface PresetRule {
  keywords: string[];
  simpler: string[];
  normal: string[];
  detailed: string[];
}

const PRESETS: PresetRule[] = [
  {
    keywords: ['clean', 'room', 'tidy', 'mess', 'organize'],
    simpler: [
      'Pick up obvious trash into a bag',
      'Move dirty laundry to hamper',
      'Clear one single surface (desk or bed)'
    ],
    normal: [
      'Grab a trash bag and toss wrappers/tissues',
      'Gather clothes from floor into hamper',
      'Take dishes and cups to the kitchen',
      'Clear one primary surface',
      'Make the bed or straighten pillows'
    ],
    detailed: [
      'Stand up and look at the floor for 5 seconds',
      'Get one empty trash bag or bin',
      'Pick up 3 pieces of trash right next to you',
      'Put dirty clothes together in a pile',
      'Carry the pile into the laundry basket',
      'Pick up dishes and bring them to the sink',
      'Clear only the front half of your desk',
      'Decide: stop here or do 2 more items'
    ]
  },
  {
    keywords: ['write', 'essay', 'report', 'paper', 'article', 'document'],
    simpler: [
      'Open document and write the working title',
      'Jot down 3 bullet points of what you want to say',
      'Expand the first bullet point into 2 sentences'
    ],
    normal: [
      'Open the document and title it',
      'Brainstorm 3-4 rough bullet points without filtering',
      'Pick the easiest bullet point to write first',
      'Draft 1-2 paragraphs without editing yourself',
      'Read through once gently and take a break'
    ],
    detailed: [
      'Sit comfortably and open your word processor',
      'Create a blank file and save it with a simple title',
      'Type one sentence: "The main point of this is..."',
      'List 3 random facts or ideas in any order',
      'Reorder them logically (intro, body, wrap-up)',
      'Turn point #1 into three rough sentences',
      'Step back and admire having words on the page'
    ]
  },
  {
    keywords: ['code', 'program', 'project', 'bug', 'feature', 'dev'],
    simpler: [
      'Open code editor and open the file',
      'Locate the single line or function to change',
      'Write the smallest code change or log statement'
    ],
    normal: [
      'Open the repository in your editor',
      'Review the previous commit or file where you left off',
      'Write a tiny test, comment, or console log',
      'Implement the minimal happy-path logic',
      'Run the dev server to see it work'
    ],
    detailed: [
      'Sit in your chair and take one slow breath',
      'Open your code editor and terminal',
      'Run `git status` or glance at modified files',
      'Pick one tiny file or function to examine',
      'Write a single pseudo-code comment: `// goal: ...`',
      'Write 2 lines of code to satisfy that comment',
      'Run the test or view in browser to verify'
    ]
  },
  {
    keywords: ['email', 'reply', 'message', 'inbox', 'text', 'call'],
    simpler: [
      'Open the email/message thread',
      'Draft a 1-sentence draft in a separate notepad',
      'Paste and hit send'
    ],
    normal: [
      'Open the message and read just the last paragraph',
      'Decide on the core answer (Yes/No/Information)',
      'Type a friendly 2-sentence response',
      'Quick glance for spelling',
      'Press send and close the tab'
    ],
    detailed: [
      'Open your inbox without looking at other emails',
      'Open only the specific message you need to address',
      'Identify: What do they actually need from me right now?',
      'Draft in your mind: "Hi [Name], thanks for this..."',
      'Type 1 or 2 clear sentences answering their question',
      'Add a warm sign-off (Best / Thanks)',
      'Click Send immediately before overthinking'
    ]
  },
  {
    keywords: ['study', 'homework', 'exam', 'read', 'learn'],
    simpler: [
      'Open book or lecture notes to the current page',
      'Read just the first heading and summary',
      'Write 1 takeaway note'
    ],
    normal: [
      'Clear your workspace of unrelated items',
      'Open the textbook or study slide deck',
      'Skim the headings and bold terms for 3 minutes',
      'Read 1 section carefully and highlight or write 1 note',
      'Pause and close the book'
    ],
    detailed: [
      'Sit down with a glass of water nearby',
      'Open notebook to a fresh blank page',
      'Write the topic at the top in big letters',
      'Open study material to the exact page',
      'Read just 1 paragraph or slide',
      'Write in your own words what that paragraph meant',
      'Mark this step done'
    ]
  },
  {
    keywords: ['shower', 'bath', 'wash', 'groom', 'brush'],
    simpler: [
      'Turn on water to a comfortable warm temperature',
      'Step in for a 2-minute rinse',
      'Dry off with towel'
    ],
    normal: [
      'Lay out clean clothes and towel',
      'Turn on warm water and let it warm up',
      'Step in and wash hair or body',
      'Step out and wrap in towel',
      'Put on comfortable clothing'
    ],
    detailed: [
      'Walk into the bathroom',
      'Grab a dry towel and hang it within arm’s reach',
      'Turn faucet handle to warm',
      'Test water temperature with hand',
      'Step in under the warm water and feel shoulders relax',
      'Wash with soap quickly',
      'Step out onto bath mat and dry off',
      'Slip into fresh clothes'
    ]
  },
  {
    keywords: ['eat', 'food', 'cook', 'meal', 'dinner', 'lunch', 'breakfast'],
    simpler: [
      'Walk to kitchen',
      'Grab one easy food item (fruit, bread, leftovers)',
      'Sit down and eat'
    ],
    normal: [
      'Check fridge or pantry for the easiest acceptable food',
      'Put food onto a plate or heat it in microwave',
      'Pour a glass of water',
      'Sit down away from work to eat',
      'Put empty plate in sink'
    ],
    detailed: [
      'Stand up and take a deep breath',
      'Walk into the kitchen',
      'Open fridge door and look for ready-to-eat food',
      'Put 1 portion onto a clean plate',
      'Heat for 60 seconds if needed',
      'Sit at the table and eat the first 3 bites slowly',
      'Finish at your own pace'
    ]
  }
];

export function generateBreakdown(taskTitle: string, detail: BreakdownDetail = 'normal'): string[] {
  const lower = taskTitle.toLowerCase();
  
  for (const preset of PRESETS) {
    if (preset.keywords.some(k => lower.includes(k))) {
      return [...preset[detail]];
    }
  }

  // Universal atomic fallback
  if (detail === 'simpler') {
    return [
      `Get ready: sit down and prepare for "${taskTitle}"`,
      `Do the absolute smallest version of it`,
      `Decide if you want to stop or continue`
    ];
  }

  if (detail === 'detailed') {
    return [
      `Sit down comfortably and take one gentle breath`,
      `Clear any physical obstacle directly in front of you`,
      `Identify the single tool or item needed for "${taskTitle}"`,
      `Open or touch that tool`,
      `Do just 60 seconds of effortless action`,
      `Acknowledge that you started`,
      `Choose to continue or take a proud rest`
    ];
  }

  return [
    `Set up your immediate space for "${taskTitle}"`,
    `Open or prepare the first material you need`,
    `Focus on doing just 2 minutes of effortless effort`,
    `Complete the initial small piece`,
    `Check in with yourself: continue or celebrate the minimum`
  ];
}
