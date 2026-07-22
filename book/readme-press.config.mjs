export default {
  source: '../README.md',
  outputDir: 'dist',
  theme: 'lapis-rtl',
  metadata: {
    title: 'LLM به زبان آدمیزاد',
    subtitle: 'راهنمای فارسیِ مدل‌های زبانی بزرگ',
    author: 'علی نجفی',
    edition: 'ویرایش اول · ۲۳ تیر ۱۴۰۵ · 14 July 2026',
    localDate: '۲۳ تیر ۱۴۰۵',
    latinDate: '14 July 2026',
    language: 'fa',
    direction: 'rtl',
    numerals: 'persian',
    license: 'CC BY-SA 4.0',
    subject: 'راهنمای فارسی مدل‌های زبانی بزرگ',
    creator: 'README Press',
  },
  repository: {
    url: 'https://github.com/3lf/llm-for-humans',
    branch: 'main',
  },
  cover: {
    titlePrefix: 'LLM',
    title: 'به زبان آدمیزاد',
    tagline: 'هر چیزی که برای فهم مدل‌های زبانی لازمه، ساده و روشن',
    series: 'مجموعه آموزش‌های به زبان آدمیزاد',
    repositoryNote: 'برای دریافت آخرین نسخه، به <strong>GitHub</strong> سر بزن.',
  },
  labels: {
    latestLink: 'نسخه جدید و ستاره‌دادن',
  },
  toc: {
    maxDepth: 2,
    chapterOnly: [
      'چطور پرامپت‌های بهتری بنویسیم؟',
      'پارامترهای مهم در کار با LLMها',
      'تکنیک‌های پرامپت‌نویسی',
      'مشکلات معروف LLMها',
      'چطور دقت و امنیت LLM رو بالاتر ببریم؟',
    ],
  },
  structure: {
    introHeading: 'مقدمه',
    githubTocHeading: 'فهرست مطالب',
    parts: [
      { title: 'مبانی', startHeading: 'مدل‌های زبانی بزرگ (LLM) چی هستن اصلاً؟' },
      { title: 'پرامپت‌نویسی', startHeading: 'پرامپت‌نویسی: یعنی چی؟' },
      { title: 'پارامترها و API', startHeading: 'پارامترهای مهم در کار با LLMها' },
      { title: 'تکنیک‌های پیشرفته', startHeading: 'تکنیک‌های پرامپت‌نویسی' },
      { title: 'ابزارها و عامل‌ها', startHeading: 'ابزارها و خروجی ساختاریافته' },
      { title: 'مشکلات، امنیت و ارزیابی', startHeading: 'مشکلات معروف LLMها' },
      { title: 'معماری، فاین‌تیون و RAG', startHeading: 'معماری و شخصی‌سازی' },
      { title: 'راهنمای عملی', startHeading: 'ابزارهای ساخت و بهبود پرامپت' },
      { title: 'مرجع', startHeading: 'پروژه عملی: ساخت دستیار پرسش‌وپاسخ فارسی' },
    ],
  },
  images: {
    normalJpegQuality: 94,
    classRules: [
      { endsWith: 'vis-15-agent-loop.png', className: 'diagram--agent-loop' },
      { endsWith: 'vis-30-model-selection-path.png', className: 'diagram--model-selection-path' },
    ],
  },
  contentRules: {
    calloutClassRules: [
      { contains: 'Agent نتیجه ابزار رو می‌بینه', className: 'callout--agent-loop-caption' },
      { contains: 'بهترین مدل، مدلیه که روی سناریوهای واقعی تو', className: 'callout--model-selection-closing' },
    ],
    paragraphClassRules: [
      {
        startsWith: 'با استفاده از این تکنیک‌ها، می‌تونی مثل یه حرفه‌ای',
        className: 'chapter-closing chapter-closing--prompting',
      },
    ],
    chapterClassRules: [
      { titleStartsWith: 'چیت‌شیت سریع', className: 'chapter-cheat-sheet' },
    ],
    treeAriaLabel: 'ساختار تیم ایجنت‌ها',
  },
  outputs: {
    normal: 'llm-for-humans-book.pdf',
    high: 'llm-for-humans-book-high-quality.pdf',
  },
  qa: {
    script: 'qa.mjs',
    minPages: 250,
    maxPages: 280,
    minimumDestinations: 100,
    requireSourceCommit: true,
    fontFamilies: ['Estedad', 'Vazirmatn', 'JetBrainsMono'],
    extractablePhrases: [
      'از کجا شروع کنم؟',
      'مدل تو قدم اول جمله رو',
      'پلن رایگان سخاوتمندانه',
    ],
    expectedLinks: [
      'https://github.com/3lf/llm-for-humans',
      'https://github.com/3lf/llm-for-humans/blob/main/CONTRIBUTING.md',
      'https://github.com/3lf/llm-for-humans/blob/main/LICENSE',
    ],
  },
  release: {
    copy: {
      intro: 'این نسخه از کتاب «LLM به زبان آدمیزاد» از یک محتوای واحد در دو کیفیت آماده شده است.',
      filesTitle: 'فایل‌های این انتشار',
      file: 'فایل',
      purpose: 'کاربرد',
      pages: 'صفحه',
      size: 'حجم',
      normalPurpose: 'نسخه عادی برای مطالعه، دانلود و اشتراک‌گذاری',
      highPurpose: 'نسخه باکیفیت با تصاویر PNG بدون افت برای چاپ و آرشیو',
      parity: 'متن، صفحه‌بندی، لینک‌ها و ساختار هر دو نسخه یکسان است؛ تفاوت فقط در شیوه ذخیره تصاویر کتاب است.',
      validationTitle: 'اعتبارسنجی',
      validation: [
        'هر دو PDF با QA کامل README Press و `qpdf --check` بررسی شده‌اند.',
        'تصاویر نسخه باکیفیت پس از استخراج با فایل‌های PNG منبع تطبیق داده شده‌اند.',
        'فایل `SHA256SUMS.txt` برای بررسی صحت دانلودها ضمیمه شده است.',
      ],
      sourceCommit: 'کامیت منبع',
      version: 'نسخه',
    },
  },
};
