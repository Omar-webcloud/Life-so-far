export type Lang = 'en' | 'bn'

export const en = {
  appName: 'Life So Far',
  langSwitch: 'Language',
  heroTitle: 'Your life. Your chapters. Your story.',
  heroText:
    'From your first day at school to the moments that changed everything, turn your journey into something worth sharing.',
  ctaCreate: 'Create My Life Story',
  ctaExample: 'See an Example',
  withPhoto: 'With a photo',
  withoutPhoto: 'Without a photo',
  photoOptionalNote: 'A profile picture is always optional. Both layouts are made to be shared.',
  howTitle: 'Three quiet steps',
  how1: 'Add your chapters',
  how1d: 'School, first job, a solo trip — start from a suggestion or write your own.',
  how2: 'Make it yours',
  how2d: 'Add a photo if you like, or keep it private. The card adapts on its own.',
  how3: 'Save and share',
  how3d: 'Download a PNG or JPG, or share it straight from your phone.',
  privacyShort: 'Everything stays in your browser. Nothing is uploaded to a server.',
  privacyTitle: 'Private by design',
  privacyBody:
    'Your milestones and picture stay in this browser. They are never uploaded to a database, and they do not sync to other devices.',
  closing: 'Make people feel something before asking them to do anything.',
  exampleTitle: 'An example',
  back: 'Back',
  editorTitle: 'Build your timeline',
  editTab: 'Edit',
  previewTab: 'Preview',
  showPreview: 'Preview card',
  showEditor: 'Back to editing',
  photoTitle: 'Profile picture',
  photoOptional: 'Optional',
  photoHint: 'JPG, PNG or WebP up to 5 MB. Processed on your device only.',
  addPhoto: 'Add Profile Picture',
  replacePhoto: 'Replace',
  removePhoto: 'Remove',
  skipPhoto: 'No picture needed — your card will use a dedicated no-picture layout.',
  photoZoom: 'Zoom',
  photoHoriz: 'Horizontal position',
  photoVert: 'Vertical position',
  photoErrType: 'Unsupported file. Please choose a JPG, PNG or WebP image.',
  photoErrSize: 'That image is larger than 5 MB. Please choose a smaller one.',
  photoErrCorrupt: 'We could not read that image. Please try another file.',
  photoNotSaved:
    'This picture is too large to keep in your browser, so you may need to upload it again later.',
  layoutWithPhoto: 'Card layout: with picture',
  layoutNoPhoto: 'Card layout: without picture',
  milestonesTitle: 'Milestones',
  suggestions: 'Quick add',
  addCustomPlaceholder: 'Write your own milestone…',
  add: 'Add',
  emptyMilestones: 'No chapters yet. Tap a suggestion above to begin.',
  moreDetails: 'More details',
  lessDetails: 'Hide details',
  titleLabel: 'Title',
  categoryLabel: 'Category',
  whenLabel: 'Year or age',
  whenPlaceholder: 'e.g. 2016 or Age 6',
  emojiLabel: 'Emoji',
  descLabel: 'Short description',
  includeLabel: 'Show on card',
  moveUp: 'Move up',
  moveDown: 'Move down',
  delete: 'Delete',
  tooMany: 'The card shows up to 15 chapters. Extra selected ones are left out.',
  fewHint: 'Three or more chapters make the most balanced card.',
  cat_education: 'Education',
  cat_career: 'Career',
  cat_travel: 'Travel',
  cat_achievement: 'Achievement',
  cat_personal: 'Personal',
  cardSettings: 'Card details',
  cardTitleLabel: 'Card title',
  nicknameLabel: 'Nickname (optional)',
  nicknamePlaceholder: 'Or leave empty',
  ageLabel: 'Age (optional)',
  agePlaceholder: 'e.g. 23',
  showAge: 'Show age in headline',
  showDates: 'Show years and ages',
  showDescriptions: 'Show descriptions',
  privacyControls: 'Privacy controls',
  download: 'Download',
  downloadPng: 'Download PNG',
  downloadJpg: 'Download JPG',
  share: 'Share',
  shareNative: 'Share card',
  shareFacebook: 'Facebook',
  shareWhatsapp: 'WhatsApp',
  copyLink: 'Copy link',
  linkCopied: 'Link copied',
  copyFailed: 'Could not copy. Please copy the address manually.',
  generating: 'Creating your image…',
  exportFailed: 'We could not create the image. Please try again.',
  saveScreenTitle: 'Save your card',
  saveScreenBody:
    'Your browser may not allow automatic downloads. Press and hold the image below, then choose “Save image” or “Download image”.',
  inAppNote:
    'You seem to be in an in-app browser. If saving does not work, open this page in your main browser.',
  openInBrowser: 'Open in browser',
  close: 'Close',
  saveScreen: 'Open save screen',
  shareFallback: 'Sharing files is not supported here. Download the image and share it manually.',
  shareText: 'My Life So Far — see how many chapters I have written. Make yours:',
  invite: 'What does your life look like so far? Create your own chapters and share your story.',
  storageUnavailable:
    'Browser storage is unavailable, so your progress will not be saved after you leave.',
  storageFull: 'Storage is full — some changes could not be saved.',
  deleteSaved: 'Delete my saved data',
  resetTitle: 'Delete everything?',
  resetBody:
    'This removes your milestones, details and picture from this browser. This cannot be undone.',
  resetConfirm: 'Yes, delete',
  cancel: 'Cancel',
  defaultCardTitle: 'My Life So Far',
  tagline: 'A life full of moments worth remembering.',
  chaptersOnly: 'Chapters',
  eyebrow: 'A personal timeline',
  yourChapters: 'Chapters',
  previewNote: 'The exported image matches this preview.',
  sampleNickname: 'Anika',
} as const

export type Dict = Record<keyof typeof en, string>

export const bn: Dict = {
  appName: 'আমার জীবন এতদূর',
  langSwitch: 'ভাষা',
  heroTitle: 'আপনার জীবন। আপনার অধ্যায়। আপনার গল্প।',
  heroText:
    'স্কুলের প্রথম দিন থেকে জীবন বদলে দেওয়া মুহূর্ত পর্যন্ত — আপনার পথচলাকে বানান শেয়ার করার মতো কিছু।',
  ctaCreate: 'আমার জীবনের গল্প তৈরি করুন',
  ctaExample: 'একটি উদাহরণ দেখুন',
  withPhoto: 'ছবি সহ',
  withoutPhoto: 'ছবি ছাড়া',
  photoOptionalNote: 'প্রোফাইল ছবি সবসময়ই ঐচ্ছিক। দুটি ডিজাইনই শেয়ার করার জন্য তৈরি।',
  howTitle: 'তিনটি সহজ ধাপ',
  how1: 'অধ্যায়গুলো যোগ করুন',
  how1d: 'স্কুল, প্রথম চাকরি, একা ভ্রমণ — পরামর্শ থেকে শুরু করুন বা নিজে লিখুন।',
  how2: 'নিজের মতো সাজান',
  how2d: 'চাইলে ছবি দিন, না চাইলে গোপন রাখুন। কার্ড নিজেই মানিয়ে নেবে।',
  how3: 'সংরক্ষণ ও শেয়ার',
  how3d: 'PNG বা JPG ডাউনলোড করুন, অথবা সরাসরি ফোন থেকে শেয়ার করুন।',
  privacyShort: 'সবকিছু আপনার ব্রাউজারেই থাকে। কিছুই সার্ভারে আপলোড হয় না।',
  privacyTitle: 'ডিজাইনেই গোপনীয়তা',
  privacyBody:
    'আপনার মাইলফলক ও ছবি এই ব্রাউজারেই থাকে। এগুলো কখনো ডাটাবেসে আপলোড হয় না এবং অন্য ডিভাইসে সিঙ্ক হয় না।',
  closing: 'কিছু করতে বলার আগে মানুষকে কিছু অনুভব করান।',
  exampleTitle: 'একটি উদাহরণ',
  back: 'ফিরে যান',
  editorTitle: 'আপনার টাইমলাইন বানান',
  editTab: 'সম্পাদনা',
  previewTab: 'প্রিভিউ',
  showPreview: 'কার্ড প্রিভিউ',
  showEditor: 'সম্পাদনায় ফিরুন',
  photoTitle: 'প্রোফাইল ছবি',
  photoOptional: 'ঐচ্ছিক',
  photoHint: 'JPG, PNG বা WebP, সর্বোচ্চ ৫ MB। শুধু আপনার ডিভাইসেই প্রসেস হয়।',
  addPhoto: 'প্রোফাইল ছবি যোগ করুন',
  replacePhoto: 'পরিবর্তন',
  removePhoto: 'সরান',
  skipPhoto: 'ছবি লাগবে না — আপনার কার্ডে ছবি ছাড়া আলাদা ডিজাইন ব্যবহার হবে।',
  photoZoom: 'জুম',
  photoHoriz: 'অনুভূমিক অবস্থান',
  photoVert: 'উল্লম্ব অবস্থান',
  photoErrType: 'ফাইলটি সমর্থিত নয়। অনুগ্রহ করে JPG, PNG বা WebP ছবি বেছে নিন।',
  photoErrSize: 'ছবিটি ৫ MB-এর চেয়ে বড়। অনুগ্রহ করে ছোট ছবি বেছে নিন।',
  photoErrCorrupt: 'ছবিটি পড়া যায়নি। অনুগ্রহ করে অন্য ফাইল চেষ্টা করুন।',
  photoNotSaved:
    'ছবিটি ব্রাউজারে রাখার জন্য অনেক বড়, তাই পরে আবার আপলোড করতে হতে পারে।',
  layoutWithPhoto: 'কার্ড ডিজাইন: ছবি সহ',
  layoutNoPhoto: 'কার্ড ডিজাইন: ছবি ছাড়া',
  milestonesTitle: 'মাইলফলক',
  suggestions: 'দ্রুত যোগ করুন',
  addCustomPlaceholder: 'নিজের মাইলফলক লিখুন…',
  add: 'যোগ করুন',
  emptyMilestones: 'এখনো কোনো অধ্যায় নেই। শুরু করতে উপরের একটি পরামর্শে ট্যাপ করুন।',
  moreDetails: 'আরও বিবরণ',
  lessDetails: 'বিবরণ লুকান',
  titleLabel: 'শিরোনাম',
  categoryLabel: 'বিভাগ',
  whenLabel: 'সাল বা বয়স',
  whenPlaceholder: 'যেমন ২০১৬ বা ৬ বছর',
  emojiLabel: 'ইমোজি',
  descLabel: 'সংক্ষিপ্ত বিবরণ',
  includeLabel: 'কার্ডে দেখান',
  moveUp: 'উপরে নিন',
  moveDown: 'নিচে নিন',
  delete: 'মুছুন',
  tooMany: 'কার্ডে সর্বোচ্চ ১৫টি অধ্যায় দেখানো হয়। বাকিগুলো বাদ যাবে।',
  fewHint: 'তিন বা তার বেশি অধ্যায় থাকলে কার্ড সবচেয়ে সুন্দর দেখায়।',
  cat_education: 'শিক্ষা',
  cat_career: 'ক্যারিয়ার',
  cat_travel: 'ভ্রমণ',
  cat_achievement: 'অর্জন',
  cat_personal: 'ব্যক্তিগত',
  cardSettings: 'কার্ডের তথ্য',
  cardTitleLabel: 'কার্ডের শিরোনাম',
  nicknameLabel: 'ডাকনাম (ঐচ্ছিক)',
  nicknamePlaceholder: 'অথবা ফাঁকা রাখুন',
  ageLabel: 'বয়স (ঐচ্ছিক)',
  agePlaceholder: 'যেমন ২৩',
  showAge: 'শিরোনামে বয়স দেখান',
  showDates: 'সাল ও বয়স দেখান',
  showDescriptions: 'বিবরণ দেখান',
  privacyControls: 'গোপনীয়তা নিয়ন্ত্রণ',
  download: 'ডাউনলোড',
  downloadPng: 'PNG ডাউনলোড',
  downloadJpg: 'JPG ডাউনলোড',
  share: 'শেয়ার',
  shareNative: 'কার্ড শেয়ার করুন',
  shareFacebook: 'ফেসবুক',
  shareWhatsapp: 'হোয়াটসঅ্যাপ',
  copyLink: 'লিংক কপি',
  linkCopied: 'লিংক কপি হয়েছে',
  copyFailed: 'কপি করা যায়নি। অনুগ্রহ করে ঠিকানাটি নিজে কপি করুন।',
  generating: 'আপনার ছবি তৈরি হচ্ছে…',
  exportFailed: 'ছবি তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
  saveScreenTitle: 'আপনার কার্ড সংরক্ষণ করুন',
  saveScreenBody:
    'আপনার ব্রাউজার স্বয়ংক্রিয় ডাউনলোড নাও দিতে পারে। নিচের ছবিতে চেপে ধরে রাখুন, তারপর “ছবি সংরক্ষণ করুন” বেছে নিন।',
  inAppNote:
    'আপনি সম্ভবত অ্যাপের ভেতরের ব্রাউজারে আছেন। সংরক্ষণ কাজ না করলে মূল ব্রাউজারে পেজটি খুলুন।',
  openInBrowser: 'ব্রাউজারে খুলুন',
  close: 'বন্ধ করুন',
  saveScreen: 'সংরক্ষণ স্ক্রিন খুলুন',
  shareFallback: 'এখানে ফাইল শেয়ার সমর্থিত নয়। ছবিটি ডাউনলোড করে নিজে শেয়ার করুন।',
  shareText: 'আমার জীবন এতদূর — দেখুন কতগুলো অধ্যায় লিখেছি। আপনারটা বানান:',
  invite: 'আপনার জীবন এতদূর কেমন দেখায়? নিজের অধ্যায়গুলো বানান আর গল্প শেয়ার করুন।',
  storageUnavailable:
    'ব্রাউজার স্টোরেজ পাওয়া যাচ্ছে না, তাই বের হয়ে গেলে আপনার কাজ সংরক্ষিত থাকবে না।',
  storageFull: 'স্টোরেজ পূর্ণ — কিছু পরিবর্তন সংরক্ষণ করা যায়নি।',
  deleteSaved: 'আমার সংরক্ষিত তথ্য মুছুন',
  resetTitle: 'সবকিছু মুছে ফেলবেন?',
  resetBody:
    'এতে এই ব্রাউজার থেকে আপনার মাইলফলক, তথ্য ও ছবি মুছে যাবে। এটি ফেরানো যাবে না।',
  resetConfirm: 'হ্যাঁ, মুছুন',
  cancel: 'বাতিল',
  defaultCardTitle: 'আমার জীবন এতদূর',
  tagline: 'মনে রাখার মতো মুহূর্তে ভরা একটি জীবন।',
  chaptersOnly: 'অধ্যায়',
  eyebrow: 'ব্যক্তিগত টাইমলাইন',
  yourChapters: 'অধ্যায়',
  previewNote: 'ডাউনলোড করা ছবি এই প্রিভিউর মতোই হবে।',
  sampleNickname: 'অনিকা',
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
  { en: ['Started school', 'Crayons, a new bag and a big smile.'], bn: ['স্কুলে ভর্তি হলাম', 'রঙ পেন্সিল, নতুন ব্যাগ আর বড় একটি হাসি।'], when: '2006', emoji: '🎒' },
  { en: ['Finished school', 'Goodbyes that felt like beginnings.'], bn: ['স্কুল শেষ করলাম', 'বিদায় যা শুরুর মতো লেগেছিল।'], when: '2016', emoji: '🎓' },
  { en: ['Entered university', 'A new city, new friends.'], bn: ['বিশ্ববিদ্যালয়ে ভর্তি হলাম', 'নতুন শহর, নতুন বন্ধু।'], when: '2018', emoji: '🏛️' },
  { en: ['First solo trip', 'Learned to love the quiet.'], bn: ['প্রথম একা ভ্রমণ', 'নীরবতাকে ভালোবাসতে শিখলাম।'], when: '2021', emoji: '🧭' },
  { en: ['First job', 'Where it all began to feel real.'], bn: ['প্রথম চাকরি', 'যেখানে সবকিছু সত্যি মনে হতে শুরু করল।'], when: '2023', emoji: '💼' },
  { en: ['Chapters still unwritten', 'The best part, maybe.'], bn: ['অলিখিত অধ্যায়গুলো', 'হয়তো সবচেয়ে সুন্দর অংশ।'], when: '', emoji: '✨' },
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
