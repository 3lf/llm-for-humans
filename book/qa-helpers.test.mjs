import assert from 'node:assert/strict';
import test from 'node:test';

import { countHtmlCallouts, sourceMatchDetail } from './qa-helpers.mjs';

test('counts only complete callout class tokens', () => {
  const html = [
    '<aside class="callout callout-note"></aside>',
    "<aside class='callout callout-tip extra'></aside>",
    '<div class="callout-note-extra"></div>',
    '<div class="not-a-callout callout-warn"></div>',
  ].join('\n');
  assert.deepEqual(countHtmlCallouts(html), {
    total: 2,
    byKind: { note: 1, tip: 1 },
  });
});

test('reports source line and matching context for strings and patterns', () => {
  const source = 'خط اول\r\nخط دوم با عبارت\r\nخط سوم';
  assert.equal(sourceMatchDetail(source, 'عبارت'), 'line 2: خط دوم با عبارت');
  assert.equal(sourceMatchDetail(source, /خط سوم/u), 'line 3: خط سوم');
  assert.equal(sourceMatchDetail(source, /پیدا نیست/u), null);
});
