import { resolveBookMetadata } from './release-metadata.mjs';

const bookMetadata = resolveBookMetadata();

export default {
  source: '../README.md',
  outputDir: 'dist',
  theme: 'lapis-rtl',
  metadata: {
    title: 'LLM به زبان آدمیزاد',
    subtitle: 'راهنمای فارسیِ مدل‌های زبانی بزرگ',
    author: 'علی نجفی',
    edition: bookMetadata.edition,
    localDate: bookMetadata.localDate,
    latinDate: bookMetadata.latinDate,
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
  footer: {
    text: 'https://github.com/3lf/llm-for-humans',
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
  security: {
    rawHtml: 'trusted',
    network: 'deny',
    diagnostics: 'strict',
    strictConfig: true,
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
      {
        label: 'Agent loop diagram pagination',
        endsWith: 'vis-15-agent-loop.png',
        className: 'diagram--agent-loop',
      },
      {
        label: 'Model selection diagram pagination',
        endsWith: 'vis-30-model-selection-path.png',
        className: 'diagram--model-selection-path',
      },
    ],
  },
  contentRules: {
    calloutClassRules: [
      {
        label: 'Agent loop caption pagination',
        contains: 'ایجنت (Agent) نتیجه ابزار رو می‌بینه و تا وقتی اطلاعات کافی نشده، چرخه فکر، عمل و مشاهده رو ادامه می‌ده.',
        className: 'callout--agent-loop-caption',
      },
      {
        label: 'Model selection closing pagination',
        contains: 'بهترین مدل، مدلیه که روی سناریوهای واقعی تو بهترین تعادل کیفیت، سرعت، هزینه و قابلیت رو بده.',
        className: 'callout--model-selection-closing',
      },
    ],
    paragraphClassRules: [
      {
        label: 'Prompting chapter closing pagination',
        startsWith: 'با استفاده از این تکنیک‌ها، می‌تونی از یه کاربر معمولی LLM به یه کاربر حرفه‌ای تبدیل بشی و جواب‌های خیلی دقیق‌تر، مفیدتر و خلاقانه‌تری از این مدل‌ها بگیری!',
        className: 'chapter-closing chapter-closing--prompting',
      },
    ],
    chapterClassRules: [
      {
        label: 'Cheat sheet chapter layout',
        titleStartsWith: 'چیت‌شیت سریع',
        className: 'chapter-cheat-sheet',
      },
    ],
    treeAriaLabel: 'ساختار تیم ایجنت‌ها',
  },
  outputs: {
    normal: 'llm-for-humans-book.pdf',
    print: 'llm-for-humans-book-print.pdf',
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
    releaseMetadata: bookMetadata,
  },
  release: {
    copy: {
      intro: 'LLM for Humans, in three verified PDF editions.',
      filesTitle: 'Downloads',
      file: 'File',
      purpose: 'Edition',
      pages: 'Pages',
      size: 'Size',
      normalPurpose: 'Standard',
      printPurpose: 'Print friendly',
      highPurpose: 'Full-color high quality',
      parity: 'Same content and layout; only image encoding and the print palette differ.',
      validationTitle: 'Verification',
      validation: ['Full PDF, white-background, rendering, and image QA passed.'],
      sourceCommit: 'Source',
      version: 'Version',
    },
  },
};
