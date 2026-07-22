import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { findUnsafeGitHubBlockStarts } from './source-qa.mjs';

function readOutputHtml(config, manifest, quality) {
  const output = manifest.outputs?.[quality];
  return output ? readFileSync(resolve(config.outputDir, output.html), 'utf8') : null;
}

export default async function runProjectQa({ config, manifest, check }) {
  const source = readFileSync(config.sourcePath, 'utf8');
  const normalHtml = readOutputHtml(config, manifest, 'normal');
  const highHtml = readOutputHtml(config, manifest, 'high');
  const html = normalHtml ?? highHtml ?? '';
  const css = readFileSync(config.theme.stylesheet, 'utf8');
  const repositoryQr = readFileSync(resolve(config.outputDir, manifest.repositoryQr.asset), 'utf8');

  check(manifest.parts.length === 9, 'project has nine configured parts', String(manifest.parts.length));
  check(manifest.chapters.length === 30, 'project has the expected chapter inventory', String(manifest.chapters.length));
  check(manifest.headings === 355, 'project has the expected heading inventory', String(manifest.headings));
  const introduction = manifest.chapters.find((chapter) => chapter.isIntroduction);
  const firstNumberedChapter = manifest.chapters.find((chapter) => !chapter.isIntroduction);
  check(
    introduction?.partNumber === null && introduction?.displayNumber === null,
    'introduction is standalone and unnumbered',
  );
  check(
    firstNumberedChapter?.partNumber === 1 && firstNumberedChapter?.displayNumber === 1,
    'part one starts with chapter one',
  );
  const subheadingCount = manifest.chapters.reduce(
    (sum, chapter) => sum + (chapter.subheadings?.length ?? 0),
    0,
  );
  const tocHeadings = manifest.chapters.flatMap((chapter) => chapter.tocHeadings ?? []);
  check(subheadingCount === 290, 'full H2 and H3 outline is preserved', String(subheadingCount));
  check(tocHeadings.length === 65, 'curated print table of contents is stable', String(tocHeadings.length));
  check(tocHeadings.every((heading) => heading.depth === 2), 'print table of contents contains no H3 entries');

  for (const output of Object.values(manifest.outputs ?? {})) {
    check(output.pageCount === 265, `${output.quality} release pagination is stable`, String(output.pageCount));
    check(
      output.repositoryFooter?.stampedPages === output.pageCount - 1
        && output.repositoryFooter?.artifact === true
        && output.repositoryFooter?.text === 'github.com/3lf/llm-for-humans',
      `${output.quality} repository footer covers every body page as an artifact`,
      `${output.repositoryFooter?.stampedPages ?? 0} pages`,
    );
    check(
      output.repositoryFooter?.y >= 15 && output.repositoryFooter?.y <= 20,
      `${output.quality} repository footer stays in the safe bottom band`,
      `${output.repositoryFooter?.y ?? 0}pt`,
    );
  }
  if (manifest.outputs?.normal && manifest.outputs?.high) {
    check(
      manifest.outputs.high.bytes > manifest.outputs.normal.bytes,
      'high-quality PDF preserves the larger lossless image set',
      `${manifest.outputs.high.bytes} > ${manifest.outputs.normal.bytes}`,
    );
  }

  const imageDirectory = resolve(config.projectRoot, '../images');
  const sourceFigures = readdirSync(imageDirectory)
    .filter((name) => /^vis-\d{2}-.+\.png$/.test(name))
    .sort();
  const expectedFigures = Array.from({ length: 50 }, (_, index) => (
    `vis-${String(index + 1).padStart(2, '0')}-`
  ));
  check(sourceFigures.length === 50, 'source contains exactly 50 book figures', String(sourceFigures.length));
  check(
    expectedFigures.every((prefix, index) => sourceFigures[index]?.startsWith(prefix)),
    'book figures form a complete 01 through 50 sequence',
  );
  const referencedFigures = [...source.matchAll(/\(images\/(vis-\d{2}-[^)]+\.png)\)/g)]
    .map((match) => match[1]);
  check(referencedFigures.length === 50, 'README references exactly 50 book figures', String(referencedFigures.length));
  check(new Set(referencedFigures).size === 50, 'README figure references are unique');
  check(
    referencedFigures.every((name) => sourceFigures.includes(name)),
    'every README figure reference resolves to a source PNG',
  );
  check(manifest.optimizedFigures?.length === 50, 'normal figure catalog is complete', String(manifest.optimizedFigures?.length ?? 0));
  check(manifest.highQualityFigures?.length === 50, 'lossless figure catalog is complete', String(manifest.highQualityFigures?.length ?? 0));
  if (normalHtml) check(!/images\/vis-[^"']+\.png/.test(normalHtml), 'normal HTML uses optimized JPEG figures');
  if (highHtml) check(!/images\/vis-[^"']+\.jpg/.test(highHtml), 'high-quality HTML uses source PNG figures');

  check((html.match(/class="promptblock/g) ?? []).length === 1, 'one LTR prompt block is detected');
  check(html.includes('class="promptblock promptblock--long"'), 'long prompt can fragment cleanly');
  check((html.match(/class="example example--long"/g) ?? []).length >= 10, 'long Persian examples can fragment cleanly');
  for (const phrase of ['Embedding', 'Next Token Prediction', 'Multi-Turn Conversation']) {
    check(html.includes(`>(${phrase})</bdi>`), `Latin parentheses are isolated: ${phrase}`);
  }
  check(html.includes('>Microsoft Agent Framework</bdi>'), 'linked Latin product name is isolated');
  for (const token of ['1M', '400K', '200K', '256K', '262K', '10M', 'Persian-Phi']) {
    check(html.includes(`>${token}</bdi>`), `complete mixed token is isolated: ${token}`);
  }
  check(!/\d+<bdi[^>]*>[MK]<\/bdi>/.test(html), 'no context value has a suffix-only isolate');
  check(
    html.includes('href="https://github.com/3lf/llm-for-humans/blob/main/CONTRIBUTING.md"'),
    'CONTRIBUTING link is canonical',
  );
  check(
    html.includes('href="https://github.com/3lf/llm-for-humans/blob/main/LICENSE"'),
    'license link is canonical',
  );
  check(!html.includes('href="CONTRIBUTING.md"') && !html.includes('href="LICENSE"'), 'no build-relative document links remain');
  check(html.includes('diagram--agent-loop'), 'agent-loop pagination hook is present');
  check(html.includes('diagram--model-selection-path'), 'model-selection pagination hook is present');
  check(html.includes('chapter-closing--prompting'), 'prompting chapter-closing hook is present');
  const headingTableGroups = (html.match(/class="heading-table-group"/g) ?? []).length;
  check(headingTableGroups >= 10, 'short tables stay grouped with headings', String(headingTableGroups));
  check(
    /\.heading-table-group\s*\{[^}]*break-inside:\s*avoid/s.test(css),
    'heading and table groups are atomic in paged media',
  );
  for (const [level, id] of [
    ['h3', 'کِی-از-agent-استفاده-کنم-و-کِی-نکنم-'],
    ['h2', '۷-مقایسه-نهایی-فاین‌تیون-یا-rag-️'],
  ]) {
    check(
      new RegExp(`<div class="heading-table-group">\\s*<${level} id="${id}"`).test(html),
      `regression heading stays with its table: ${id}`,
    );
  }
  check(
    /<strong>تکنیک‌های مهم<\/strong>:\s*<\/p>\s*<ol>\s*<li><strong>راه‌حل مرحله‌ای<\/strong>/.test(html),
    'prompting techniques use one semantic ordered list',
  );
  check(
    (html.match(/class="book-tree"/g) ?? []).length === (source.includes('├──') ? 1 : 0),
    'semantic book trees match source trees',
  );
  check(!html.includes('├──') && !html.includes('└──'), 'raw tree branches are replaced in book HTML');
  const figureSizes = [...html.matchAll(/<figure class="([^"]*\bdiagram\b[^"]*)"><img [^>]*?width="(\d+)" height="(\d+)"/g)];
  const tallMismatch = figureSizes.filter(
    (match) => Number(match[3]) / Number(match[2]) > 1.4 !== match[1].split(/\s+/).includes('diagram--tall'),
  );
  check(figureSizes.length === 50 && tallMismatch.length === 0, 'tall figures follow the ratio rule', `${figureSizes.length} figures`);
  const expectedCallouts = {
    note: 70,
    tip: 35,
    warn: 15,
    date: 1,
    new: 1,
    star: 1,
  };
  const calloutCount = (html.match(/class="callout\s/g) ?? []).length;
  check(calloutCount === 123, 'all source callouts keep their book styling', String(calloutCount));
  for (const [kind, expected] of Object.entries(expectedCallouts)) {
    const actual = (html.match(new RegExp(`callout-${kind}`, 'g')) ?? []).length;
    check(actual === expected, `${kind} callout inventory is stable`, `${actual}/${expected}`);
  }
  check((html.match(/callout--agent-loop-caption/g) ?? []).length === 1, 'agent loop caption keeps its pagination class');
  check((html.match(/callout--model-selection-closing/g) ?? []).length === 1, 'model selection closing keeps its pagination class');
  check(!html.includes('repo-footer-link'), 'no fragile running footer link remains');
  check(!/<br>\s*<br>\s*<\/div>\s*<\/section>/.test(html), 'chapter separators cannot spill onto an empty page');

  check(
    manifest.repositoryQr?.url === 'https://github.com/3lf/llm-for-humans'
      && manifest.repositoryQr?.errorCorrectionLevel === 'Q',
    'repository QR manifest is canonical and resilient',
  );
  check(repositoryQr.includes('<svg') && repositoryQr.includes('viewBox=') && repositoryQr.length > 1_000, 'repository QR SVG is valid', `${repositoryQr.length} bytes`);
  check(
    html.includes('class="colophon-qr"')
      && html.includes('src="assets/repository-qr.svg"')
      && html.includes('نسخه جدید و ستاره‌دادن'),
    'colophon contains the repository QR call to action',
  );
  check(html.includes('این فایل ممکنه بعد از انتشار به‌روزرسانی شده باشه'), 'colophon contains the update notice');

  check(!source.includes('**منبع:** [ریپوی RAGAS]'), 'isolated RAGAS source line is absent');
  check(!/^\*\*منبع(?: رسمی)?:\*\*/mu.test(source), 'no orphan source-only paragraph remains');
  check(source.includes('توی GitHub به پروژه ستاره بده'), 'README names GitHub in the star request');
  check(source.includes('«میکنه» (بدون فاصله: غلط)'), 'no-ZWNJ example is visibly distinct');
  check(!/(^|[^\u0600-\u06FF])کوتای?($|[^\u0600-\u06FF])/mu.test(source), 'quota is written in natural Persian');
  const unsafeGitHubBlockStarts = findUnsafeGitHubBlockStarts(source);
  check(
    unsafeGitHubBlockStarts.ltr.length === 0,
    'GitHub prose blocks never take their direction from Latin text',
    `lines: ${unsafeGitHubBlockStarts.ltr.join(', ') || 'none'}`,
  );

  const cheatSheetStart = source.indexOf('# چیت‌شیت سریع 📋');
  const cheatSheetEnd = source.indexOf('# اشتباهات رایج (این کارها رو نکن!) ❌', cheatSheetStart);
  const cheatSheet = cheatSheetStart >= 0 && cheatSheetEnd > cheatSheetStart
    ? source.slice(cheatSheetStart, cheatSheetEnd)
    : '';
  check(Boolean(cheatSheet), 'cheat sheet section is present and bounded');
  for (const phrase of [
    'اول مشکلت رو پیدا کن',
    'پرامپت و کنترل خروجی',
    'دانش، ابزار و انتخاب معماری',
    'کیفیت، امنیت و هزینه',
    'مجموعه‌داده مرجع و تست رگرسیون',
    'قواعد و محدودیت‌های ایمنی',
    'مرحله تأیید کاربر',
    'اجرای دوباره بدون اثر اضافه',
    'تلاش دوباره و مسیر جایگزین',
    'مسیریابی، کش و پردازش دسته‌ای',
  ]) {
    check(cheatSheet.includes(phrase), `cheat sheet covers: ${phrase}`);
  }
  check((cheatSheet.match(/^\|---\|/gmu) ?? []).length === 4, 'cheat sheet has four focused tables');
  check(!cheatSheet.includes('| سطح |'), 'cheat sheet uses actionable cautions instead of vague levels');
  check(html.includes('class="chapter chapter-cheat-sheet"'), 'cheat sheet receives its scoped layout');

  const approvedTranslationPhrases = [
    ['TR-001', 'پیش‌بینی توکن بعدی'],
    ['TR-002', 'روش انتخاب توکن بعدی (Decoding Strategy)'],
    ['TR-003', 'پنجره کانتکست (Context Window)'],
    ['TR-004', 'پوشه کاری جدا با `Git Worktree`'],
    ['TR-005', 'رابطی که مدل همان لحظه می‌سازد'],
    ['TR-006', 'مدل‌های بلادرنگ'],
    ['TR-007', 'پیدا کردن اطلاعات مرتبط قبل از ساخت پاسخ'],
    ['TR-008', 'روشی برای ساخت توکن از تکه‌های پرتکرار متن'],
    ['TR-009', 'پرامپت‌نویسی با چند مثال'],
    ['TR-010', 'شروع‌کردن پاسخ از طرف کاربر'],
    ['TR-011', 'سوگیری مدل به نفع پاسخ خودش یا مدل‌های هم‌خانواده'],
    ['TR-012', 'قالب فایل مدل برای اجرای محلی'],
    ['TR-013', 'چیت‌شیت سریع'],
    ['TR-014', 'مرحله تأیید کاربر'],
    ['TR-015', 'پرسش‌وپاسخ درباره تصویر'],
    ['TR-016', 'سوگیری در پاسخ‌ها'],
    ['TR-017', 'ایجنت هوش مصنوعی'],
    ['TR-018', 'آداپتر کوچکی برای فاین‌تیون کم‌هزینه'],
    ['TR-019', 'قواعد و محدودیت‌های ایمنی'],
    ['TR-020', 'اجرای دوباره بدون ایجاد اثر اضافه'],
    ['TR-021', 'تاریخچه گفت‌وگو'],
    ['TR-022', 'روش Late Chunking: ساخت امبدینگ با بافت کامل سند، بعد جداکردن تکه‌ها'],
    ['TR-023', 'RAG با ایجنت'],
    ['TR-024', 'دقت نتایج بازیابی'],
    ['TR-025', 'پوشش اطلاعات لازم در نتایج بازیابی'],
    ['TR-026', 'محاسبات بیشتر هنگام تولید پاسخ'],
    ['TR-027', 'تنظیم مدل برای پیروی از دستورها'],
    ['TR-028', 'رشته‌های توقف'],
    ['TR-029', 'راستی‌آزمایی با منابع بیرونی'],
    ['TR-030', 'زنجیره راستی‌آزمایی'],
    ['TR-031', 'بازبینی و نقد پاسخ توسط خود مدل'],
    ['TR-032', 'حافظه هم می‌تونه راه ورود حمله باشه'],
    ['TR-033', 'راهبرد انتخاب مدل و ارائه‌دهنده'],
    ['TR-034', 'محتوای بنجل و انبوه تولیدشده با هوش مصنوعی'],
    ['TR-035', 'حالت‌های خاص و مرزی'],
    ['TR-036', 'دعوت به اقدام'],
    ['TR-037', 'مجموعه‌داده مرجع'],
    ['TR-038', 'روش Self-Consistency'],
    ['TR-039', 'گفت‌وگوی چندنوبتی'],
    ['TR-040', 'مدل چندمتخصصه با یک مسیریاب'],
    ['TR-041', 'تولید خودبازگشتی (Autoregressive Generation)'],
    ['TR-042', 'نمایش تدریجی پاسخ'],
    ['TR-043', 'برنامه‌ریزی و اجرا (Plan-and-Execute)'],
    ['TR-044', 'مناظره بین چند ایجنت'],
    ['TR-045', 'سوگیری ناشی از ترتیب نمایش پاسخ‌ها'],
    ['TR-046', 'شباهت بین امبدینگ‌ها'],
    ['TR-047', 'افزودن بافت سند به هر تکه پیش از بازیابی'],
    ['TR-048', 'میزان ارتباط پاسخ با سوال'],
    ['TR-049', 'مرتب‌کردن دوباره نتایج بر اساس میزان ارتباط'],
    ['TR-050', 'افت کیفیت مدل در کانتکست‌های بسیار طولانی'],
    ['TR-051', 'مدل خودش میزان فکرکردن رو تنظیم می‌کنه'],
    ['TR-052', 'فاین‌تیون LoRA روی مدل کوانتیزه برای مصرف حافظه کمتر'],
    ['TR-053', 'بهینه‌سازی مستقیم ترجیحات'],
    ['TR-054', 'معیاری برای سنجش شباهت معنایی متن‌ها'],
    ['TR-055', 'کاهش دقت نمایش عددهای مدل برای کم‌کردن حافظه و هزینه اجرا'],
    ['TR-056', 'ورودی‌هایی که عمداً برای گول‌زدن مدل ساخته شده‌اند'],
    ['TR-057', 'منحنی Loss'],
    ['TR-065', 'سهمیه محدود رایگان'],
  ];
  for (const [id, phrase] of approvedTranslationPhrases) {
    check(source.includes(phrase), `${id} approved translation is present`);
  }

  const rejectedTranslationPatterns = [
    /احتمال کلمه بعدی/u,
    /استراتژی رمزگشایی/u,
    /پنجره محتوایی/u,
    /درخت کار جدا/u,
    /رابط(?:‌| )های تولیدشونده|رابط تولیدشونده/u,
    /مدل(?:‌| )های هم(?:‌|-)?زمان/u,
    /تولید تقویت(?:‌|-)?شده با بازیابی/u,
    /کدگذاری جفت بایتی/u,
    /نمونه(?:‌|-)?دهی|چند(?:‌|-)?مثالی/u,
    /شروع(?:‌|-)?کننده خروجی/u,
    /سوگیری به نفع هم(?:‌|-)?خانواده‌ها/u,
    /فرمت مدل فشرده|برگ تقلب|دروازه تایید|پاسخ بصری/u,
    /تعصب در پاسخ‌ها|تعصبات/u,
    /عامل(?:‌| )های هوشمند|عامل هوشمند/u,
    /آداپتر کم(?:‌|-)?رتبه/u,
    /محافظ‌ها \/ ریل‌های محافظ|تکرار بی(?:‌|-)?خطر|حافظه جلسه/u,
    /تکه(?:‌|-)?بندی متأخر|RAG عاملی|دقت کانتکست|پوشش کانتکست/u,
    /محاسبه در زمان پاسخ|آموزش دستوری|توالی(?:‌| )های توقف/u,
    /فکت(?:‌|-)?چک (?:بیرونی|خارجی)|زنجیره تایید|بازتاب و نقد خود/u,
    /حافظه هم سطح حمله(?:‌| )ست|استراتژی ارائه(?:‌|-)?دهنده/u,
    /محتوای هرز AI|حالات لبه(?:‌|-)?ای|فراخوان عمل/u,
    /Golden Dataset|جواب طلایی|نمونه(?:‌| )های طلایی/u,
    /خود(?:‌|-)?سازگاری|مکالمه چندمرحله(?:‌|-)?ای|ترکیب متخصص(?:‌| )ها/u,
    /پاسخ(?:‌|-)?دهی جریانی|طرح(?:‌|-)?ریزی و اجرا|مناظره چند(?:‌|-)?عاملی/u,
    /سوگیری جایگاه|شباهت امبدینگی|بازیابی زمینه(?:‌|-)?ای|ارتباط جواب/u,
    /پوسیدگی کانتکست|تفکر تطبیقی|لورای کوانتیزه(?:‌|-)?شده/u,
    /بهینه(?:‌|-)?سازی مستقیم ترجیح(?!ات)|امتیاز معنایی/u,
    /کوانتیزاسیون \/ فشرده(?:‌|-)?سازی|کوانتیزه \(فشرده\)|منحنی خطا/u,
  ];
  for (const pattern of rejectedTranslationPatterns) {
    check(!pattern.test(source), `rejected translation is absent: ${pattern.source}`);
  }
  for (const stale of [
    'مدل اول جمله رو به توکن‌ها',
    'کدوم رو استفاده کنه (یا اصلاً استفاده نکنه)',
    'سرنخ برای بررسی» ببین',
    'منجر به **تصمیمات غلط**',
    'تیر رایگان',
  ]) {
    check(!source.includes(stale), `repaired source phrase is absent: ${stale}`);
  }
  check(!source.includes('ه‌ی'), 'bare ezafe house style contains no ه‌ی forms');
  check(!source.includes('سؤال'), 'house spelling uses سوال without hamza');

  const coverPng = readFileSync(resolve(config.outputDir, 'cover.png'));
  check(coverPng.subarray(0, 8).toString('hex') === '89504e470d0a1a0a', 'cover is a PNG');
  const coverWidth = coverPng.readUInt32BE(16);
  const coverHeight = coverPng.readUInt32BE(20);
  check(
    Math.abs(coverWidth - 2008) <= 1 && Math.abs(coverHeight - 2835) <= 1,
    'cover is rendered at 300 DPI for the 17 by 24 cm page',
    `${coverWidth}x${coverHeight}`,
  );
  check(statSync(config.sourcePath).size > 300_000, 'canonical README has a plausible complete-book size');
}
