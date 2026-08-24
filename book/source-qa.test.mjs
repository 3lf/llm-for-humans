import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import {
  findUnsafeGitHubBlockStarts,
  githubHeadingSlug,
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
    name: 'supports tilde fences',
    source: '~~~text\nEnglish\n~~~\nمتن فارسی',
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
  assert.equal(result.headings.length, 356);
  assert.equal(result.links.length, 178);
  assert.deepEqual(result.mismatches, []);
});

test('a deliberately altered current README fragment fails validation', () => {
  const source = readFileSync(join(import.meta.dirname, '..', 'README.md'), 'utf8');
  const altered = source.replace('](#مقدمه-)', '](#deliberately-missing)');
  assert.notEqual(altered, source);
  const result = validateInternalAnchors(altered);
  assert.deepEqual(result.mismatches, [
    { line: 82, fragment: '#deliberately-missing', nearestHeading: 'فهرست مطالب ✨' },
  ]);
});
