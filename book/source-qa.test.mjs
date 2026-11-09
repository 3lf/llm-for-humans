import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import {
  findUnsafeGitHubBlockStarts,
  githubHeadingSlug,
  GITHUB_README_RENDER_LIMIT_BYTES,
  validateGitHubReadmeVisibility,
  validateInternalAnchors,
  visibleHeadingText,
} from './source-qa.mjs';

const rtlCases = [
  {
    name: 'checks prose immediately after a closing fence',
    source: '```js\nEnglish in code\n```\nEnglish prose',
    expected: [4],
  },
  {
    name: 'ignores inner triple backticks inside a quadruple fence',
    source: '````\nEnglish\n```\nEnglish again\n````\nEnglish prose',
    expected: [6],
  },
  {
    name: 'accepts a longer matching fence closer',
    source: '```\nEnglish\n`````  \nEnglish prose',
    expected: [4],
  },
  {
    name: 'rejects a backtick fence opener whose info string contains a backtick',
    source: '```bad`info\nEnglish continuation',
    expected: [1],
  },
  {
    name: 'supports tilde fences',
    source: '~~~text\nEnglish\n~~~\nمتن فارسی',
    expected: [],
  },
  {
    name: 'allows backticks in a tilde fence info string',
    source: '~~~ bad`info\nEnglish\n~~~\nمتن فارسی',
    expected: [],
  },
  {
    name: 'requires a quoted fence closer at the opener depth',
    source: '> ~~~~\n> English\n~~~~\n> English again\n> ~~~~\nEnglish prose',
    expected: [6],
  },
  {
    name: 'supports CRLF input',
    source: '```\r\nEnglish\r\n```\r\nEnglish prose',
    expected: [4],
  },
  {
    name: 'treats tab-indented fence markers as indented code and checks following prose',
    source: '\t```js\n\tEnglish\n\t```\nEnglish prose',
    expected: [4],
  },
  {
    name: 'treats four-space-indented blocks as code and checks following prose',
    source: '    English code\n    more code\nEnglish prose',
    expected: [3],
  },
  {
    name: 'checks bullets and ASCII-numbered lists',
    source: '- English\n1. English',
    expected: [1, 2],
  },
  {
    name: 'checks Persian-numbered lists',
    source: '۱۲. English',
    expected: [1],
  },
  {
    name: 'checks headings',
    source: '## English heading',
    expected: [1],
  },
  {
    name: 'looks through emphasis markers',
    source: '**English prose**',
    expected: [1],
  },
  {
    name: 'looks through neutral leading characters',
    source: '✅ English prose',
    expected: [1],
  },
  {
    name: 'keeps structural exemptions',
    source: '<div lang="en">\n\n![English](image.png)\n\n| English |\n\n---\n\n[ref]: https://example.com',
    expected: [],
  },
];

for (const fixture of rtlCases) {
  test(fixture.name, () => {
    assert.deepEqual(findUnsafeGitHubBlockStarts(fixture.source), { ltr: fixture.expected });
  });
}

test('turns rendered inline Markdown into heading text', () => {
  assert.equal(
    visibleHeadingText('**Hello** `World` [Label](https://example.com) &amp; _more_'),
    'Hello World Label & more',
  );
});

test('matches GitHub Unicode slug behavior for joiners, selectors, and emoji fixtures', () => {
  const fixtures = [
    ['الف\u200cب', 'الف\u200cب'],
    ['الف\u200dب', 'الف\u200dب'],
    ['A\ufe0f', 'a\ufe0f'],
    ['❤️‍🩹', '\ufe0f\u200d'],
    ['🕵️‍♂️', '\ufe0f\u200d\ufe0f'],
    ['👶👨‍🎓🕵️', '\u200d\ufe0f'],
    ['🅰️/🅱️', '🅰️🅱️'],
  ];
  for (const [heading, expected] of fixtures) {
    assert.equal(githubHeadingSlug(heading), expected, heading);
  }
});

test('retains labels instead of URLs and strips inline formatting from headings', () => {
  const result = validateInternalAnchors([
    '# **Hello** `World` [Label](https://example.com)',
    '[jump](#hello-world-label)',
  ].join('\n'));
  assert.equal(result.headings[0].slug, 'hello-world-label');
  assert.deepEqual(result.mismatches, []);
});

test('suffixes duplicate headings and avoids collisions with existing suffixed headings', () => {
  const result = validateInternalAnchors([
    '# Alpha',
    '# Alpha',
    '# Alpha-1',
    '# Alpha',
    '[first](#alpha)',
    '[second](#alpha-1)',
    '[collision](#alpha-1-1)',
    '[third](#alpha-2)',
  ].join('\n'));
  assert.deepEqual(result.headings.map(({ slug }) => slug), [
    'alpha',
    'alpha-1',
    'alpha-1-1',
    'alpha-2',
  ]);
  assert.deepEqual(result.mismatches, []);
});

test('ignores headings and links inside fences', () => {
  const result = validateInternalAnchors([
    '# Visible',
    '```md',
    '# Hidden',
    '[bad](#missing)',
    '```',
    '[good](#visible)',
  ].join('\n'));
  assert.equal(result.headings.length, 1);
  assert.equal(result.links.length, 1);
  assert.deepEqual(result.mismatches, []);
});

test('accepts explicit compatibility anchors without changing heading slug suffixes', () => {
  const result = validateInternalAnchors([
    '<a id="old-title"></a>',
    '<a name="alpha"></a>',
    '# Alpha',
    '# New title',
    '[old](#old-title)',
    '[current](#new-title)',
  ].join('\n'));
  assert.deepEqual(result.headings.map(({ slug }) => slug), ['alpha', 'new-title']);
  assert.deepEqual(result.mismatches, []);
});

test('compatibility anchors inside fenced examples do not create real targets', () => {
  const result = validateInternalAnchors('```html\n<a id="old-title"></a>\n```\n[old](#old-title)');
  assert.equal(result.mismatches.length, 1);
});

test('an inline-code or commented anchor does not create a real target', () => {
  const result = validateInternalAnchors('`<a id="old-title"></a>`\n<!-- <a id="old-title"></a> -->\n[old](#old-title)');
  assert.equal(result.mismatches.length, 1);
});

test('multiline HTML comments hide anchors, headings and links while retaining source line numbers', () => {
  const result = validateInternalAnchors([
    '<!--',
    '<a id="hidden-old"></a>',
    '# Hidden',
    '[hidden](#also-missing)',
    '-->',
    '# Visible',
    '[old](#hidden-old)',
  ].join('\n'));
  assert.deepEqual(result.headings.map(({ text }) => text), ['Visible']);
  assert.equal(result.links.length, 1);
  assert.deepEqual(result.mismatches, [{ line: 7, fragment: '#hidden-old', nearestHeading: 'Visible' }]);
});

test('comment delimiters in code examples do not hide later real content', () => {
  for (const code of ['```html\n<!--\n```', '`<!--`', '    <!--']) {
    const result = validateInternalAnchors(`${code}\n\n# Visible\n[jump](#visible)`);
    assert.deepEqual(result.headings.map(({ text }) => text), ['Visible']);
    assert.deepEqual(result.mismatches, []);
  }
});

test('fence markers inside comments do not hide later real content', () => {
  const result = validateInternalAnchors('<!--\n```html\n-->\n# Visible\n[jump](#visible)');
  assert.deepEqual(result.headings.map(({ text }) => text), ['Visible']);
  assert.deepEqual(result.mismatches, []);
});

const fullReadmeNotice = '<!-- github-full-readme -->\n'
  + '> متن کامل در [شاخه main](https://raw.githubusercontent.com/3lf/llm-for-humans/main/README.md)\n';

test('small READMEs need no truncation notice', () => {
  assert.equal(validateGitHubReadmeVisibility('# بخش\nمتن').exceedsRenderLimit, false);
});

test('large READMEs need an early visible notice linking to complete source', () => {
  const source = `${fullReadmeNotice}# فهرست مطالب\n${'م'.repeat(GITHUB_README_RENDER_LIMIT_BYTES / 2)}`;
  const result = validateGitHubReadmeVisibility(source);
  assert.equal(result.byteLength, Buffer.byteLength(source));
  assert.equal(result.exceedsRenderLimit, true);
  assert.equal(result.noticeLine, 1);
  assert.match(result.fullTextUrl, /raw\.githubusercontent\.com/u);
  assert.throws(() => validateGitHubReadmeVisibility(source.replace(fullReadmeNotice, '')), /visible full-text notice/u);
  assert.throws(() => validateGitHubReadmeVisibility(source.replace('raw.githubusercontent.com', 'example.com')), /visible full-text notice/u);
});

test('a notice below the TOC or beyond the byte cutoff does not fix truncation', () => {
  const padding = 'م'.repeat(GITHUB_README_RENDER_LIMIT_BYTES / 2);
  assert.throws(() => validateGitHubReadmeVisibility(`# فهرست مطالب\n${fullReadmeNotice}${padding}`), /visible full-text notice/u);
  assert.throws(() => validateGitHubReadmeVisibility(`${padding}\n${fullReadmeNotice}`), /visible full-text notice/u);
  assert.throws(() => validateGitHubReadmeVisibility(`\`\`\`md\n${fullReadmeNotice}\`\`\`\n${padding}`), /visible full-text notice/u);
});

test('current README retains a visible and complete-source fallback', () => {
  const source = readFileSync(join(import.meta.dirname, '..', 'README.md'), 'utf8');
  const result = validateGitHubReadmeVisibility(source);
  assert.ok(result.fullTextUrl);
});

test('ignores headings and links inside indented code blocks', () => {
  const result = validateInternalAnchors([
    '    # Hidden',
    '    [bad](#missing)',
    '# Visible',
    '[good](#visible)',
  ].join('\n'));
  assert.equal(result.headings.length, 1);
  assert.equal(result.links.length, 1);
  assert.deepEqual(result.mismatches, []);
});

test('reports every mismatch with its source line, fragment, and nearest heading', () => {
  const result = validateInternalAnchors([
    '# بخش اول',
    '[خراب](#missing-one)',
    '# بخش دوم',
    '[خراب](#missing-two)',
  ].join('\n'));
  assert.deepEqual(result.mismatches, [
    { line: 2, fragment: '#missing-one', nearestHeading: 'بخش اول' },
    { line: 4, fragment: '#missing-two', nearestHeading: 'بخش دوم' },
  ]);
});

test('CLI prints actionable anchor failures and exits nonzero', () => {
  const directory = mkdtempSync(join(tmpdir(), 'source-qa-'));
  const sourcePath = join(directory, 'README.md');
  try {
    writeFileSync(sourcePath, '# بخش\n[خراب](#missing)\n', 'utf8');
    const result = spawnSync(process.execPath, [join(import.meta.dirname, 'source-qa.mjs'), sourcePath], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Internal anchor mismatches:/u);
    assert.match(result.stderr, /line 2: fragment "#missing"/u);
    assert.match(result.stderr, /nearest heading: "بخش"/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('current README keeps the rendered heading and internal-link baseline', () => {
  const source = readFileSync(join(import.meta.dirname, '..', 'README.md'), 'utf8');
  const result = validateInternalAnchors(source);
  assert.equal(result.headings.length, 363);
  assert.equal(result.links.length, 201);
  assert.deepEqual(result.mismatches, []);
});

test('a deliberately altered current README fragment fails validation', () => {
  const source = readFileSync(join(import.meta.dirname, '..', 'README.md'), 'utf8');
  const altered = source.replace('](#مقدمه-)', '](#deliberately-missing)');
  assert.notEqual(altered, source);
  const alteredLine = altered.split(/\r?\n/u)
    .findIndex((line) => line.includes('](#deliberately-missing)')) + 1;
  assert.ok(alteredLine > 0);
  const result = validateInternalAnchors(altered);
  assert.deepEqual(result.mismatches, [
    { line: alteredLine, fragment: '#deliberately-missing', nearestHeading: 'فهرست مطالب ✨' },
  ]);
});
