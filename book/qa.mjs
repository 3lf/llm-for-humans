import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { countHtmlCallouts, sourceMatchDetail } from './qa-helpers.mjs';
import { findUnsafeGitHubBlockStarts } from './source-qa.mjs';
import {
  additionalMixedDirectionTokens,
  configuredSourceSelectors,
  extractModelContextTokens,
} from './source-contracts.mjs';
import { approvedTranslationPhrases, rejectedTranslationPatterns } from './translation-contracts.mjs';

const contentInventory = JSON.parse(
  readFileSync(new URL('./content-inventory.json', import.meta.url), 'utf8'),
);

function readOutputHtml(config, manifest, quality) {
  const output = manifest.outputs?.[quality];
  return output ? readFileSync(resolve(config.outputDir, output.html), 'utf8') : null;
}

export default async function runProjectQa({ config, manifest, check }) {
  const source = readFileSync(config.sourcePath, 'utf8');
  const normalHtml = readOutputHtml(config, manifest, 'normal');
  const printHtml = readOutputHtml(config, manifest, 'print');
  const highHtml = readOutputHtml(config, manifest, 'high');
  const html = normalHtml ?? printHtml ?? highHtml ?? '';
  const css = readFileSync(config.theme.stylesheet, 'utf8');
  const repositoryQr = readFileSync(resolve(config.outputDir, manifest.repositoryQr.asset), 'utf8');
  const releaseMetadata = config.qa.releaseMetadata;

  check(manifest.parts.length === contentInventory.parts, 'project has the configured part inventory', String(manifest.parts.length));
  check(manifest.chapters.length === contentInventory.chapters, 'project has the expected chapter inventory', String(manifest.chapters.length));
  check(manifest.headings === contentInventory.headings, 'project has the expected heading inventory', String(manifest.headings));
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
  check(subheadingCount === contentInventory.subheadings, 'full H2 and H3 outline is preserved', String(subheadingCount));
  check(tocHeadings.length === contentInventory.tocEntries, 'curated print table of contents is stable', String(tocHeadings.length));
  check(tocHeadings.every((heading) => heading.depth === 2), 'print table of contents contains no H3 entries');

  for (const output of Object.values(manifest.outputs ?? {})) {
    check(
      output.pageCount === contentInventory.pages[output.quality],
      `${output.quality} release pagination is stable`,
      String(output.pageCount),
    );
    check(
      output.repositoryFooter?.stampedPages === output.pageCount - 1
        && output.repositoryFooter?.artifact === true
        && output.repositoryFooter?.text === config.repository.url,
      `${output.quality} repository footer uses the absolute URL on every body page`,
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
  if (manifest.outputs?.print && manifest.outputs?.high) {
    check(
      manifest.outputs.print.imageMode === 'source-png-lossless-print-palette',
      'print PDF uses lossless figures and the print palette',
      manifest.outputs.print.imageMode,
    );
    check(
      manifest.outputs.print.sha256 !== manifest.outputs.high.sha256,
      'print and full-color high-quality PDFs are distinct artifacts',
    );
  }
  check(manifest.metadata?.edition === config.metadata.edition, 'manifest records the configured edition');
  check(manifest.metadata?.localDate === config.metadata.localDate, 'manifest records the configured Persian date');
  check(manifest.metadata?.latinDate === config.metadata.latinDate, 'manifest records the configured Latin cover line');
  if (releaseMetadata?.isRelease) {
    const plainHtml = html.replace(/<[^>]+>/g, '');
    check(manifest.releaseVersion === releaseMetadata.releaseVersion, 'manifest release version matches pipeline metadata');
    check(plainHtml.includes(releaseMetadata.persianDate), 'colophon uses the pipeline Persian release date');
    check(plainHtml.includes(releaseMetadata.gregorianDate), 'colophon uses the pipeline Gregorian release date');
    check(plainHtml.includes(releaseMetadata.releaseVersion), 'colophon shows the pipeline release version');
  }

  const imageDirectory = resolve(config.projectRoot, '../images');
  const sourceFigures = readdirSync(imageDirectory)
    .filter((name) => /^vis-\d{2}-.+\.png$/.test(name))
    .sort();
  const expectedFigures = Array.from({ length: contentInventory.figures }, (_, index) => (
    `vis-${String(index + 1).padStart(2, '0')}-`
  ));
  check(sourceFigures.length === contentInventory.figures, 'source contains the exact book figure inventory', String(sourceFigures.length));
  check(
    expectedFigures.every((prefix, index) => sourceFigures[index]?.startsWith(prefix)),
    `book figures form a complete ${expectedFigures[0].slice(4, 6)} through ${expectedFigures.at(-1).slice(4, 6)} sequence`,
  );
  const referencedFigures = [...source.matchAll(/\(images\/(vis-\d{2}-[^)]+\.png)\)/g)]
    .map((match) => match[1]);
  check(referencedFigures.length === contentInventory.figures, 'README references the exact book figure inventory', String(referencedFigures.length));
  check(new Set(referencedFigures).size === contentInventory.figures, 'README figure references are unique');
  check(
    referencedFigures.every((name) => sourceFigures.includes(name)),
    'every README figure reference resolves to a source PNG',
  );
  check(manifest.optimizedFigures?.length === contentInventory.figures, 'normal figure catalog is complete', String(manifest.optimizedFigures?.length ?? 0));
  check(manifest.highQualityFigures?.length === contentInventory.figures, 'lossless figure catalog is complete', String(manifest.highQualityFigures?.length ?? 0));
  if (normalHtml) check(!/images\/vis-[^"']+\.png/.test(normalHtml), 'normal HTML uses optimized JPEG figures');
  if (printHtml) {
    check(!/images\/vis-[^"']+\.jpg/.test(printHtml), 'print HTML uses source PNG figures');
    check(
      printHtml.includes('data-readme-press-variant="print"'),
      'print HTML activates the ink-efficient theme variant',
    );
  }
  if (highHtml) check(!/images\/vis-[^"']+\.jpg/.test(highHtml), 'high-quality HTML uses source PNG figures');

  check((html.match(/class="promptblock/g) ?? []).length === 1, 'one LTR prompt block is detected');
  check(html.includes('class="promptblock promptblock--long"'), 'long prompt can fragment cleanly');
  check((html.match(/class="example example--long"/g) ?? []).length >= 10, 'long Persian examples can fragment cleanly');
  for (const phrase of ['Embedding', 'Next Token Prediction', 'Multi-Turn Conversation']) {
    check(html.includes(`>(${phrase})</bdi>`), `Latin parentheses are isolated: ${phrase}`);
  }
  check(html.includes('>Microsoft Agent Framework</bdi>'), 'linked Latin product name is isolated');
  // These semantic rendering invariants intentionally remain inline; unlike
  // content-inventory.json counts, they describe behavior rather than snapshots.
  for (const token of [...extractModelContextTokens(source), ...additionalMixedDirectionTokens]) {
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
  for (const { className, label } of configuredSourceSelectors(config)) {
    check(html.includes(className), `${label} class is present`);
  }
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
  check(
    figureSizes.length === contentInventory.figures && tallMismatch.length === 0,
    'tall figures follow the ratio rule',
    `${figureSizes.length} figures`,
  );
  const callouts = countHtmlCallouts(html);
  check(callouts.total === contentInventory.callouts.total, 'all source callouts keep their book styling', String(callouts.total));
  for (const [kind, expected] of Object.entries(contentInventory.callouts.byKind)) {
    const actual = callouts.byKind[kind] ?? 0;
    check(actual === expected, `${kind} callout inventory is stable`, `${actual}/${expected}`);
  }
  for (const { className, label } of config.contentRules.calloutClassRules) {
    check((html.match(new RegExp(className, 'g')) ?? []).length === 1, `${label} class is unique`);
  }
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

  for (const { id, phrase } of approvedTranslationPhrases) {
    const detail = sourceMatchDetail(source, phrase);
    check(Boolean(detail), `${id} approved translation is present`, detail ?? `expected phrase: ${phrase}`);
  }

  for (const { label, pattern } of rejectedTranslationPatterns) {
    const detail = sourceMatchDetail(source, pattern);
    check(!detail, `rejected translation is absent: ${label}`, detail ?? undefined);
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
