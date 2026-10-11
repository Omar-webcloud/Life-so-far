export type Lang = 'en' | 'bn'

export const en = {
  appName: 'Life So Far',
  langSwitch: 'Language',
  heroTitle: 'Your life. Your chapters. Your story.',
  heroText:
    'From your first school day to the moments that changed everything, turn your journey into something truly memorable to share.',
  ctaCreate: 'Create Your Life Story',
  ctaExample: 'See an Example',
  withPhoto: 'With a photo',
  withoutPhoto: 'Without a photo',
  photoOptionalNote: 'Adding a photo is always optional. Both styles look beautiful when shared.',
  howTitle: 'Three simple steps',
  how1: 'Add your chapters',
  how1d: 'School, your first job, a memorable trip: pick from suggestions or write your own.',
  how2: 'Make it personal',
  how2d: 'Add a favorite photo or keep it text-only. The card adapts naturally.',
  how3: 'Save and share',
  how3d: 'Download as PNG or JPG, or share it directly with friends and family.',
  privacyShort: '100% private. Everything stays in your browser and nothing is sent to a server.',
  privacyTitle: 'Private by design',
  privacyBody:
    'Your milestones and photo stay right in this browser. They are never uploaded to a database or synced across devices.',
  closing: 'Every life has chapters worth remembering. What does yours look like so far?',
  exampleTitle: 'Card Example',
  back: 'Back',
  editorTitle: 'Build your timeline',
  editTab: 'Edit',
  previewTab: 'Preview',
  showPreview: 'Preview card',
  showEditor: 'Back to editing',
  photoTitle: 'Profile picture',
  photoOptional: 'Optional',
  photoHint: 'JPG, PNG or WebP up to 5 MB. Processed entirely on your device.',
  addPhoto: 'Add Profile Picture',
  replacePhoto: 'Change photo',
  removePhoto: 'Remove',
  skipPhoto: 'No photo needed: your card will use a clean, typography-focused layout.',
  photoZoom: 'Zoom',
  photoHoriz: 'Move horizontally',
  photoVert: 'Move vertically',
  photoErrType: 'Please choose a JPG, PNG, or WebP image.',
  photoErrSize: 'Please choose an image under 5 MB.',
  photoErrCorrupt: 'Could not read that image. Please try a different photo.',
  photoNotSaved:
    'This photo is too large for browser memory, so keep a copy handy if you refresh.',
  layoutWithPhoto: 'Card style: with photo',
  layoutNoPhoto: 'Card style: without photo',
  milestonesTitle: 'Milestones',
  suggestions: 'Quick suggestions',
  addCustomPlaceholder: 'Write your own milestone…',
  add: 'Add',
  emptyMilestones: 'No chapters yet. Click a suggestion above or write your own to begin.',
  moreDetails: 'More details',
  lessDetails: 'Hide details',
  titleLabel: 'Title',
  categoryLabel: 'Category',
  whenLabel: 'Year or age',
  whenPlaceholder: 'e.g. 2016 or Age 6',
  emojiLabel: 'Emoji',
  descLabel: 'Short note (optional)',
  includeLabel: 'Show on card',
  moveUp: 'Move up',
  moveDown: 'Move down',
  delete: 'Delete',
  tooMany: 'The card displays up to 15 chapters. Extra milestones will be hidden.',
  fewHint: 'Adding at least three chapters gives your card the best balance.',
  cat_education: 'Education',
  cat_career: 'Career',
  cat_travel: 'Travel',
  cat_achievement: 'Achievement',
  cat_personal: 'Personal',
  cardSettings: 'Card details',
  cardTitleLabel: 'Card title',
  nicknameLabel: 'Name or nickname (optional)',
  nicknamePlaceholder: 'Your name',
  ageLabel: 'Age (optional)',
  agePlaceholder: 'e.g. 23',
  showAge: 'Show age in headline',
  showDates: 'Show years and ages',
  showDescriptions: 'Show milestone notes',
  privacyControls: 'Privacy controls',
  download: 'Download',
  downloadPng: 'Download PNG',
  downloadJpg: 'Download JPG',
  share: 'Share your card',
  shareNative: 'Share card',
  shareFacebook: 'Share on Facebook',
  shareWhatsapp: 'Share on WhatsApp',
  copyLink: 'Copy link',
  linkCopied: 'Link copied to clipboard!',
  copyFailed: 'Could not copy automatically. Please copy the link manually.',
  generating: 'Preparing your image…',
  exportFailed: 'Could not create the image. Please try again.',
  saveScreenTitle: 'Save your card',
  saveScreenBody:
    'If automatic download does not begin, press and hold the image below to save it.',
  inAppNote:
    'It looks like you are inside an in-app browser. Open this page in Safari or Chrome for easy saving.',
  openInBrowser: 'Open in regular browser',
  close: 'Close',
  saveScreen: 'Open save screen',
  shareFallback: 'Direct sharing is not supported here. Download the card and share the image directly.',
  shareText: 'My Life So Far: Look at the chapters of my journey. Create your own story card:',
  invite: 'What does your life look like so far? Pick your favorite moments and create your own story card.',
  storageUnavailable:
    'Browser storage is turned off. Your card will not be saved if you refresh or close this tab.',
  storageFull: 'Storage is full: recent changes could not be saved locally.',
  deleteSaved: 'Clear my saved data',
  resetTitle: 'Start fresh?',
  resetBody:
    'This will clear all your milestones, notes, and photo from this device. This cannot be undone.',
  resetConfirm: 'Yes, clear everything',
  cancel: 'Cancel',
  defaultCardTitle: 'My Life So Far',
  tagline: 'A life filled with moments worth remembering.',
  chaptersOnly: 'Chapters',
  eyebrow: 'A personal journey',
  yourChapters: 'Chapters',
  previewNote: 'Your downloaded image will look just like this preview.',
  sampleNickname: 'Abul Hayat',
} as const

export type Dict = Record<keyof typeof en, string>

export const bn: Dict = {
  appName: 'আমার জীবন এতদূর',
  langSwitch: 'ভাষা',
  heroTitle: 'আপনার জীবন। আপনার অধ্যায়। আপনার গল্প।',
  heroText:
    'স্কুলের প্রথম দিন থেকে শুরু করে জীবনের মোড় ঘোরানো মুহূর্তগুলো, সবকিছু নিয়ে তৈরি করুন সুন্দর একটি স্মারক কার্ড।',
  ctaCreate: 'আপনার জীবন কার্ড তৈরি করুন',
  ctaExample: 'একটি নমুনা দেখুন',
  withPhoto: 'ছবি সহ',
  withoutPhoto: 'ছবি ছাড়া',
  photoOptionalNote: 'ছবি দেওয়া পুরোপুরি ঐচ্ছিক। ছবি ছাড়াও কার্ডটি দেখতে দারুণ লাগে।',
  howTitle: 'সহজ তিনটি ধাপ',
  how1: 'অধ্যায়গুলো যোগ করুন',
  how1d: 'স্কুল, প্রথম চাকরি কিংবা কোনো ভ্রমণের স্মৃতি: তালিকা থেকে বেছে নিন অথবা নিজের মতো করে লিখুন।',
  how2: 'নিজের পছন্দমতো সাজান',
  how2d: 'চাইলে পছন্দের ছবি যোগ করুন, অথবা শুধু লেখা রাখুন। কার্ডটি নিজে থেকেই সুন্দরভাবে মানিয়ে নেবে।',
  how3: 'সংরক্ষণ ও শেয়ার করুন',
  how3d: 'PNG বা JPG আকারে সংরক্ষণ করুন, অথবা বন্ধুদের সাথে সরাসরি শেয়ার করুন।',
  privacyShort: 'সম্পূর্ণ নিরাপদ। সব তথ্য শুধুই আপনার ডিভাইসে থাকে, কোনো সার্ভারে পাঠানো হয় না।',
  privacyTitle: 'সম্পূর্ণ ব্যক্তিগত ও সুরক্ষিত',
  privacyBody:
    'আপনার স্মৃতি আর ছবি কেবল এই ব্রাউজারেই সংরক্ষিত থাকে। কোনো সার্ভার বা ডাটাবেসে এগুলো জমা হয় না।',
  closing: 'প্রতিটি মানুষের জীবনের গল্পই সুন্দর ও মনে রাখার মতো। এ পর্যন্ত কেমন কাটল আপনার জীবন?',
  exampleTitle: 'কার্ডের নমুনা',
  back: 'ফিরে যান',
  editorTitle: 'আপনার টাইমলাইন তৈরি করুন',
  editTab: 'তৈরি করুন',
  previewTab: 'প্রিভিউ',
  showPreview: 'কার্ড প্রিভিউ দেখুন',
  showEditor: 'সম্পাদনায় ফিরুন',
  photoTitle: 'প্রোফাইল ছবি',
  photoOptional: 'ঐচ্ছিক',
  photoHint: 'JPG, PNG বা WebP, সর্বোচ্চ ৫ MB। ছবি আপনার ডিভাইসেই প্রক্রিয়াকৃত হয়।',
  addPhoto: 'ছবি যোগ করুন',
  replacePhoto: 'ছবি পরিবর্তন',
  removePhoto: 'ছবি সরান',
  skipPhoto: 'ছবি না দিলেও সমস্যা নেই: চমৎকার ফন্ট ও ডিজাইন দিয়ে কার্ডটি তৈরি হবে।',
  photoZoom: 'জুম',
  photoHoriz: 'ডানে বা বামে সরান',
  photoVert: 'উপরে বা নিচে সরান',
  photoErrType: 'অনুগ্রহ করে JPG, PNG অথবা WebP ফরম্যাটের ছবি বেছে নিন।',
  photoErrSize: 'ছবিটি ৫ MB-এর চেয়ে বড়। অনুগ্রহ করে ছোট আকারের ছবি দিন।',
  photoErrCorrupt: 'ছবিটি খোলা যায়নি। অনুগ্রহ করে অন্য কোনো ছবি বেছে নিন।',
  photoNotSaved:
    'ছবিটি ব্রাউজারের ধারণক্ষমতার চেয়ে বড় হওয়ায় পেজ রিফ্রেশ করলে আবার আপলোড করতে হতে পারে।',
  layoutWithPhoto: 'কার্ডের ধরণ: ছবি সহ',
  layoutNoPhoto: 'কার্ডের ধরণ: ছবি ছাড়া',
  milestonesTitle: 'জীবনের মাইলফলক',
  suggestions: 'ঝটপট যোগ করুন',
  addCustomPlaceholder: 'নিজের কোনো স্মৃতির কথা লিখুন…',
  add: 'যোগ করুন',
  emptyMilestones: 'এখনো কোনো স্মৃতি যোগ করা হয়নি। উপরের পরামর্শগুলো দেখুন অথবা নিজে লিখে শুরু করুন।',
  moreDetails: 'বিস্তারিত যোগ করুন',
  lessDetails: 'বিস্তারিত লুকান',
  titleLabel: 'শিরোনাম',
  categoryLabel: 'বিভাগ',
  whenLabel: 'সাল বা বয়স',
  whenPlaceholder: 'যেমন ২০১৬ বা ৬ বছর',
  emojiLabel: 'ইমোজি',
  descLabel: 'ছোট বিবরণ (ঐচ্ছিক)',
  includeLabel: 'কার্ডে দেখান',
  moveUp: 'উপরে নিন',
  moveDown: 'নিচে নিন',
  delete: 'মুছুন',
  tooMany: 'কার্ডে একসাথে সর্বোচ্চ ১৫টি অধ্যায় সুন্দরভাবে দেখানো যায়। বাকিগুলো গোপন থাকবে।',
  fewHint: 'কমপক্ষে তিনটি স্মৃতি যোগ করলে কার্ডটি দেখতে সবচেয়ে সুন্দর লাগে।',
  cat_education: 'শিক্ষা',
  cat_career: 'ক্যারিয়ার ও কাজ',
  cat_travel: 'ভ্রমণ',
  cat_achievement: 'অর্জন',
  cat_personal: 'ব্যক্তিগত',
  cardSettings: 'কার্ডের তথ্য',
  cardTitleLabel: 'কার্ডের শিরোনাম',
  nicknameLabel: 'নাম বা ডাকনাম (ঐচ্ছিক)',
  nicknamePlaceholder: 'তোমার নাম',
  ageLabel: 'বয়স (ঐচ্ছিক)',
  agePlaceholder: 'যেমন ২৩',
  showAge: 'শিরোনামে বয়স দেখান',
  showDates: 'সাল ও বয়স দেখান',
  showDescriptions: 'ছোট বিবরণগুলো দেখান',
  privacyControls: 'গোপনীয়তা নিয়ন্ত্রণ',
  download: 'ডাউনলোড',
  downloadPng: 'PNG ডাউনলোড',
  downloadJpg: 'JPG ডাউনলোড',
  share: 'কার্ডটি শেয়ার করুন',
  shareNative: 'সরাসরি শেয়ার',
  shareFacebook: 'ফেসবুকে শেয়ার করুন',
  shareWhatsapp: 'হোয়াটসঅ্যাপে শেয়ার করুন',
  copyLink: 'লিংক কপি করুন',
  linkCopied: 'লিংক কপি হয়েছে!',
  copyFailed: 'স্বয়ংক্রিয় কপি করা যায়নি। অনুগ্রহ করে লিংকটি নিজে কপি করুন।',
  generating: 'ছবি প্রস্তুত হচ্ছে…',
  exportFailed: 'ছবি তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
  saveScreenTitle: 'কার্ডটি সংরক্ষণ করুন',
  saveScreenBody:
    'স্বয়ংক্রিয় ডাউনলোড শুরু না হলে নিচের ছবিতে চেপে ধরে “ছবি সংরক্ষণ করুন” বেছে নিন।',
  inAppNote:
    'আপনি কোনো অ্যাপের নিজস্ব ব্রাউজারে আছেন। সহজে সেভ করতে পেজটি Chrome বা Safari-তে খুলুন।',
  openInBrowser: 'মূল ব্রাউজারে খুলুন',
  close: 'বন্ধ করুন',
  saveScreen: 'সংরক্ষণ স্ক্রিন খুলুন',
  shareFallback: 'এখানে সরাসরি ফাইল শেয়ার কাজ করছে না। ছবিটি ডাউনলোড করে শেয়ার করুন।',
  shareText: 'আমার জীবনের গল্প: দেখুন এ পর্যন্ত জীবনের অধ্যায়গুলো। আপনিও নিজের কার্ড তৈরি করুন:',
  invite: 'এ পর্যন্ত কেমন কাটল আপনার জীবন? সুন্দর মুহূর্তগুলো বেছে নিয়ে নিজের টাইমলাইন কার্ড তৈরি করুন।',
  storageUnavailable:
    'ব্রাউজার মেমোরি নিষ্ক্রিয় থাকায় ট্যাব বন্ধ করলে তথ্য সংরক্ষিত থাকবে না।',
  storageFull: 'মেমোরি পূর্ণ: সাম্প্রতিক কিছু পরিবর্তন ব্রাউজারে রাখা যায়নি।',
  deleteSaved: 'সংরক্ষিত তথ্য মুছুন',
  resetTitle: 'নতুন করে শুরু করবেন?',
  resetBody:
    'এতে এই ডিভাইসে রাখা আপনার সব অধ্যায়, তথ্য ও ছবি মুছে যাবে। এটি আর ফিরিয়ে আনা যাবে না।',
  resetConfirm: 'হ্যাঁ, মুছে ফেলুন',
  cancel: 'না, থাক',
  defaultCardTitle: 'আমার জীবন এতদূর',
  tagline: 'মনে রাখার মতো সুন্দর মুহূর্তে সাজানো জীবন।',
  chaptersOnly: 'অধ্যায়',
  eyebrow: 'ব্যক্তিগত অর্জন',
  yourChapters: 'অধ্যায়',
  previewNote: 'ডাউনলোড করা ছবিটি দেখতে ঠিক এই প্রিভিউর মতোই হবে।',
  sampleNickname: 'Abul Hayat',
}

export const dictionaries: Record<Lang, Dict> = { en: en as unknown as Dict, bn }

export type Category = 'education' | 'career' | 'travel' | 'achievement' | 'personal'
export const categories: Category[] = ['education', 'career', 'travel', 'achievement', 'personal']

export type Suggestion = { key: string; category: Category; emoji: string; en: string; bn: string }

export const suggestions: Suggestion[] = [
  { key: 'startSchool', category: 'education', emoji: '🎒', en: 'Started school', bn: 'স্কুলে ভর্তি হলাম' },
  { key: 'finishSchool', category: 'education', emoji: '🎓', en: 'Finished school', bn: 'স্কুল শেষ করলাম' },
  { key: 'startCollege', category: 'education', emoji: '📚', en: 'Started college', bn: 'কলেজে ভর্তি হলাম' },
  { key: 'university', category: 'education', emoji: '🏛️', en: 'Entered university', bn: 'বিশ্ববিদ্যালয়ে ভর্তি হলাম' },
  { key: 'firstJob', category: 'career', emoji: '💼', en: 'First job', bn: 'প্রথম চাকরি' },
  { key: 'soloTrip', category: 'travel', emoji: '🧭', en: 'First solo trip', bn: 'প্রথম একা ভ্রমণ' },
  { key: 'achievement', category: 'achievement', emoji: '🏆', en: 'First major achievement', bn: 'প্রথম বড় অর্জন' },
  { key: 'lifeChanging', category: 'personal', emoji: '✨', en: 'A life-changing moment', bn: 'জীবন বদলে দেওয়া মুহূর্ত' },
]

export const sampleMilestones: { en: [string, string]; bn: [string, string]; when: string; emoji: string }[] = [
  { en: ['Started school', 'Crayons, a new bag, and a big smile.'], bn: ['স্কুলে ভর্তি হলাম', 'রঙ পেন্সিল, নতুন ব্যাগ আর একমুখ হাসি।'], when: '2006', emoji: '🎒' },
  { en: ['Finished school', 'Goodbyes that felt like fresh beginnings.'], bn: ['স্কুল জীবনের ইতি', 'বিদায়ের সেই ক্ষণ, যা ছিল নতুন শুরুর ইঙ্গিত।'], when: '2016', emoji: '🎓' },
  { en: ['Entered university', 'A new campus and lifelong friends.'], bn: ['বিশ্ববিদ্যালয়ে পদার্পণ', 'নতুন শহর আর একঝাঁক প্রিয় বন্ধু।'], when: '2018', emoji: '🏛️' },
  { en: ['First solo trip', 'Discovered the quiet joy of independence.'], bn: ['প্রথম একা ভ্রমণ', 'একলা চলার আনন্দ আর আত্মবিশ্বাস খুঁজে পাওয়া।'], when: '2021', emoji: '🧭' },
  { en: ['First job', 'Taking the first big step into the real world.'], bn: ['প্রথম চাকরি', 'কর্মজীবনের প্রথম রোমাঞ্চকর পদক্ষেপ।'], when: '2023', emoji: '💼' },
  { en: ['Chapters yet to be written', 'The very best is still ahead.'], bn: ['অনাগত দিনগুলো', 'সবচেয়ে সুন্দর অধ্যায়গুলো হয়তো এখনো অপেক্ষায়।'], when: '', emoji: '✨' },
]

export function formatNumber(n: number | string, lang: Lang) {
  const num = typeof n === 'string' ? Number(n) : n
  if (Number.isNaN(num)) return String(n)
  return new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US', { useGrouping: false }).format(num)
}

export function chaptersText(n: number, lang: Lang) {
  const num = formatNumber(n, lang)
  if (lang === 'bn') return `${num}টি অধ্যায়`
  return n === 1 ? `${num} Chapter` : `${num} Chapters`
}

export function yearsText(age: number, lang: Lang) {
  const num = formatNumber(age, lang)
  if (lang === 'bn') return `${num} বছর`
  return age === 1 ? `${num} Year` : `${num} Years`
}

export function headlineText(n: number, age: string, showAge: boolean, lang: Lang) {
  const ageNum = Number(age)
  const useAge = showAge && age.trim() !== '' && Number.isFinite(ageNum) && ageNum > 0 && ageNum < 130
  const sep = lang === 'bn' ? '। ' : '. '
  const end = lang === 'bn' ? '।' : '.'
  return (useAge ? yearsText(ageNum, lang) + sep : '') + chaptersText(n, lang) + end
}
