import assert from 'node:assert/strict';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { BrowserSession } from '../scripts/audit-site.mjs';
import { createStaticServer } from '../scripts/serve.mjs';

test('motion study keeps visual controls, order and reduced-motion state consistent', async t => {
  const options = { trace: false };
  const { session, reason } = await BrowserSession.start(options);
  if (!session) { t.skip(reason); return; }
  const server = createStaticServer({ root: fileURLToPath(new URL('../examples/', import.meta.url)) });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = 'http://127.0.0.1:' + server.address().port;
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
    for (const width of [1440, 390]) {
      await session.devtools.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 390 }, sessionId);
      await session.devtools.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
      await session.devtools.send('Page.navigate', { url: origin + '/motion-lab/' }, sessionId);
      await new Promise(resolve => setTimeout(resolve, 500));
      const initial = await evaluate(`({ motion:document.documentElement.dataset.motion, pressed:document.querySelector('#motion-toggle').getAttribute('aria-pressed'), overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth })`);
      assert.deepEqual(initial, { motion: 'off', pressed: 'false', overflow: 0 });
      const changed = await evaluate(`(() => {
        document.querySelector('[data-select="flare"]').click();
        const slider=document.querySelector('#intensity'); slider.value='35'; slider.dispatchEvent(new Event('input', {bubbles:true}));
        const compare=document.querySelector('#compare-range'); compare.value='80'; compare.dispatchEvent(new Event('input', {bubbles:true}));
        document.querySelector('#pulse-now').click();
        document.querySelector('[data-order="contrast"]').click();
        return { mode:document.body.dataset.mode, name:document.querySelector('#mood-name').textContent,
          pressed:document.querySelector('[data-select="flare"]').getAttribute('aria-pressed'),
          value:document.querySelector('#intensity-value').textContent, intensity:document.querySelector('#stage').style.getPropertyValue('--intensity'),
          compared:document.querySelector('#compare-value').textContent, reveal:document.querySelector('#compare-frame').style.getPropertyValue('--reveal'),
          pulse:document.querySelector('#pulse-status').textContent, echo:document.querySelector('#pulse-echo').getAnimations().length,
          order:[...document.querySelector('#notes').children].map(node=>node.dataset.note),
          running:document.querySelector('#notes').getAnimations({subtree:true}).length };
      })()`);
      assert.deepEqual(changed, { mode: 'flare', name: 'Flare', pressed: 'true', value: '35%', intensity: '0.35', compared: '80%', reveal: '80%', pulse: '1 visual pulse sent.', echo: 0, order: ['function', 'form', 'feeling'], running: 0 });
      const motion = await evaluate(`(async () => {
        document.querySelector('#motion-toggle').click();
        const orb=document.querySelector('.orb-float');
        const animation=orb.getAnimations().find(item=>item.animationName==='float');
        if (!animation) throw new Error('orb animation is missing');
        await animation.ready;
        const first=getComputedStyle(orb).transform;
        let second=first;
        for (let attempt=0; attempt<30 && second===first; attempt++) {
          await new Promise(resolve=>setTimeout(resolve, 100));
          second=getComputedStyle(orb).transform;
        }
        document.querySelector('#pulse-now').click();
        const echoActive=document.querySelector('#pulse-echo').getAnimations().length;
        document.querySelector('[data-order="flow"]').click();
        const active=document.querySelector('#notes').getAnimations({subtree:true}).length;
        document.querySelector('#motion-toggle').click();
        return { first, second, active, echoActive, echoRemaining:document.querySelector('#pulse-echo').getAnimations().length, paused:document.documentElement.dataset.motion,
          remaining:document.querySelector('#notes').getAnimations({subtree:true}).length,
          order:[...document.querySelector('#notes').children].map(node=>node.dataset.note) };
      })()`);
      assert.notEqual(motion.first, motion.second, 'orb should actually move');
      assert.ok(motion.active > 0, 'reordering should animate');
      assert.ok(motion.echoActive > 0, 'pulse feedback should animate');
      assert.equal(motion.echoRemaining, 0, 'pause cancels pulse feedback');
      assert.equal(motion.paused, 'off');
      assert.equal(motion.remaining, 0, 'pause cancels running reordering');
      assert.deepEqual(motion.order, ['form', 'feeling', 'function']);
    }
  } finally {
    await session.stop(options);
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
});
