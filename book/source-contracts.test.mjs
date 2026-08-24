import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import config from './readme-press.config.mjs';
import { configuredSourceSelectors, extractModelContextTokens } from './source-contracts.mjs';

const source = readFileSync(join(import.meta.dirname, '..', 'README.md'), 'utf8');

function occurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

test('derives mixed-direction context tokens from the README model table', () => {
  assert.deepEqual(extractModelContextTokens(source), ['1M', '400K', '200K', '256K', '262K', '10M']);
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
