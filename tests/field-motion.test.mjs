import assert from 'node:assert/strict';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { BrowserSession } from '../scripts/audit-site.mjs';
import { createStaticServer } from '../scripts/serve.mjs';

test('landscape scroll motion follows the viewport and respects reduced motion', async t => {
  const options = { trace: false };
  const { session, reason } = await BrowserSession.start(options);
  if (!session) { t.skip(reason); return; }
  const server = createStaticServer({ root: fileURLToPath(new URL('../examples/', import.meta.url)) });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const { targetId } = await session.devtools.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await session.devtools.send('Target.attachToTarget', { targetId, flatten: true });
    await session.devtools.send('Page.enable', {}, sessionId);
    await session.devtools.send('Runtime.enable', {}, sessionId);
    const evaluate = async expression => {
      const response = await session.devtools.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
      assert.ok(!response.exceptionDetails, JSON.stringify(response.exceptionDetails));
      return response.result.value;
    };
    for (const width of [390, 1440]) {
      await session.devtools.send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width === 390 }, sessionId);
      await session.devtools.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] }, sessionId);
      await session.devtools.send('Page.navigate', { url: 'http://127.0.0.1:' + server.address().port + '/field-studio/' }, sessionId);
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = await evaluate(`(async () => {
        document.documentElement.style.scrollBehavior='auto';
        const art=document.querySelector('.hero-art'), sun=document.querySelector('.land-sun');
        const top=art.getBoundingClientRect().top+scrollY, values=[];
        for(let i=0;i<=8;i++) { scrollTo(0,Math.max(0,top-innerHeight+(art.offsetHeight+innerHeight)*i/8)); await new Promise(r=>setTimeout(r,75)); values.push(new DOMMatrixReadOnly(getComputedStyle(sun).transform).m42); }
        return { supported:CSS.supports('view-timeline-name: --landscape')&&CSS.supports('animation-timeline: view()'), span:Math.max(...values)-Math.min(...values) };
      })()`);
      if (result.supported) assert.ok(result.span > 2, `sun should move with scroll at ${width}px`);
      await session.devtools.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
      assert.equal(await evaluate("getComputedStyle(document.querySelector('.land-sun')).transform"), 'none');
    }
  } finally {
    await session.stop(options);
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
});
