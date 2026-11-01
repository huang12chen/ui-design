import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { BrowserSession } from '../scripts/audit-site.mjs';
import { createStaticServer } from '../scripts/serve.mjs';

test('the hero note does not cover its preceding disclosure while scrolling', async t => {
  const options = { trace: false };
  const { session, reason } = await BrowserSession.start(options);
  if (!session) { t.skip(reason); return; }
  const server = createStaticServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = 'http://127.0.0.1:' + server.address().port;
  try {
    const { targetId } = await session.devtools.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await session.devtools.send('Target.attachToTarget', { targetId, flatten: true });
    await session.devtools.send('Page.enable', {}, sessionId);
    await session.devtools.send('Runtime.enable', {}, sessionId);
    for (const locale of ['', 'zh/']) {
      for (const width of [360, 390, 561, 768, 1024, 1200, 1440]) {
        await session.devtools.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: false }, sessionId);
        await session.devtools.send('Page.navigate', { url: origin + '/' + locale + 'index.html' }, sessionId);
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = await session.devtools.send('Runtime.evaluate', {
          awaitPromise: true, returnByValue: true,
          expression: `(async () => {
            const root = document.querySelector('[data-parallax-root]');
            if (!root) throw new Error('hero not loaded');
            document.documentElement.style.scrollBehavior = 'auto';
            document.documentElement.dataset.motion = 'on';
            const note = root.querySelector('.console-insight');
            const disclosure = root.querySelector('.console-foot');
            const start = root.getBoundingClientRect().top + scrollY;
            const height = root.offsetHeight;
            let maxOverlap = 0, minOffset = Infinity, maxOffset = -Infinity;
            for (let i = 0; i <= 20; i++) {
              scrollTo(0, Math.max(0, start - innerHeight + (height + innerHeight) * i / 20));
              await new Promise(resolve => setTimeout(resolve, 45));
              const a = disclosure.getBoundingClientRect(), b = note.getBoundingClientRect();
              const overlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) *
                Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
              maxOverlap = Math.max(maxOverlap, overlap);
              const offset = new DOMMatrixReadOnly(getComputedStyle(note).transform).m42;
              minOffset = Math.min(minOffset, offset); maxOffset = Math.max(maxOffset, offset);
            }
            document.documentElement.dataset.motion = 'off';
            const pausedTransform = getComputedStyle(note).transform;
            return { maxOverlap, movement: maxOffset - minOffset, pausedTransform, animationSupported: CSS.supports('animation-timeline: view()') };
          })()`
        }, sessionId);
        assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
        assert.equal(result.result.value.maxOverlap, 0, `${locale || 'en'} at ${width}px: ${JSON.stringify(result.result.value)}`);
        if (result.result.value.animationSupported && width >= 561) assert.ok(result.result.value.movement > 1, `note should move at ${width}px: ${JSON.stringify(result.result.value)}`);
        if (width <= 560) assert.equal(result.result.value.movement, 0, `note should stay in flow at ${width}px`);
        assert.equal(result.result.value.pausedTransform, 'none', 'pause returns the note to its resting position');
      }
    }
  } finally {
    await session.stop(options);
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
});
