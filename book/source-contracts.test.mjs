import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import config from './readme-press.config.mjs';
import { visibleHeadingText } from './source-qa.mjs';
import {
  additionalMixedDirectionTokens,
  configuredSourceSelectors,
  extractModelContextTokens,
} from './source-contracts.mjs';

const source = readFileSync(join(import.meta.dirname, '..', 'README.md'), 'utf8');

function occurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

test('derives mixed-direction context tokens from the README model table', () => {
  assert.deepEqual(extractModelContextTokens(source), ['1M', '262K', '10M']);
  assert.deepEqual(additionalMixedDirectionTokens, ['Persian-Phi']);
  for (const token of additionalMixedDirectionTokens) {
    assert.equal(occurrences(source, token), 1, token);
  }
});

test('rejects one malformed model row even when other rows have valid tokens', () => {
  for (const context of ['', 'یک میلیون', '1M?', '1M extra', '1M / 2M']) {
    const altered = source.replace('| بسته | 1M |', `| بسته | ${context} |`);
    assert.notEqual(altered, source);
    assert.throws(() => extractModelContextTokens(altered), /Model row without a valid context token/u);
  }
});

test('derives a newly introduced context value for mixed-direction rendering QA', () => {
  const altered = source.replace('| بسته | 1M |', '| بسته | 400K |');
  assert.deepEqual(extractModelContextTokens(altered), ['400K', '1M', '262K', '10M']);
});

test('every configured source selector has a label and occurs exactly once', () => {
  const rules = configuredSourceSelectors(config);
  const visibleSource = source.replace(/\*\*|__|~~/gu, '');
  const h1Source = source.split(/\r?\n/gu).filter((line) => /^# /u.test(line)).join('\n');
  assert.ok(rules.length > 0);
  assert.equal(new Set(rules.map(({ label }) => label)).size, rules.length);
  for (const rule of rules) {
    assert.equal(typeof rule.label, 'string');
    assert.ok(rule.label.length > 0);
    const corpus = rule.sourceForm === 'visible-text'
      ? visibleSource
      : rule.sourceForm === 'h1' ? h1Source : source;
    assert.equal(occurrences(corpus, rule.selector), 1, rule.label);
  }
});

// Source preflight only: the PDF QA still checks actual extracted PDF text.
function visibleBodyText(markdown) {
  const firstChapter = `\n# ${config.structure.parts[0].startHeading}`;
  const bodyStart = markdown.indexOf(firstChapter);
  assert.ok(bodyStart >= 0, 'The configured first body chapter must exist.');
  return markdown.slice(bodyStart)
    .replace(/<!--[\s\S]*?-->/gu, '')
    .replace(/!\[[^\]\r\n]*\](?:\([^)]*\)|\[[^\]\r\n]*\])/gu, '')
    .split(/\r?\n/u)
    .filter((line) => !/^ {0,3}\[[^\]]+\]:/u.test(line))
    .map(visibleHeadingText)
    .join('\n');
}

test('every PDF extractability phrase still occurs in visible README body text', () => {
  const phrases = config.qa.extractablePhrases;
  assert.ok(phrases.length > 0, 'Keep PDF extractability sentinels configured.');
  const visibleBody = visibleBodyText(source);
  for (const phrase of phrases) {
    assert.ok(phrase.length > 0);
    assert.ok(visibleBody.includes(phrase), `PDF extractability phrase missing from README body: ${phrase}`);
  }
});

test('comments and image descriptions cannot satisfy a deleted PDF body phrase', () => {
  const phrase = config.qa.extractablePhrases[0];
  const altered = source.replaceAll(phrase, '')
    + `\n<!-- ${phrase} -->\n![${phrase}](images/example.png)\n`
    + `<img src="images/example.png" alt="${phrase}">\n`;
  assert.equal(visibleBodyText(altered).includes(phrase), false);
});
