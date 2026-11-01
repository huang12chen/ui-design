import assert from 'node:assert/strict';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { BrowserSession } from '../scripts/audit-site.mjs';
import { createStaticServer } from '../scripts/serve.mjs';

test('draft output stays truthful through input changes, reset, and reduced motion', async t => {
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
    await session.devtools.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
    await session.devtools.send('Page.navigate', { url: 'http://127.0.0.1:' + server.address().port + '/draft-studio/' }, sessionId);
    await new Promise(resolve => setTimeout(resolve, 500));
    const response = await session.devtools.send('Runtime.evaluate', { returnByValue: true, expression: `(() => {
      const form=document.querySelector('#form'), idea=document.querySelector('#idea'), copy=document.querySelector('#copy');
      form.requestSubmit(); const emptyError=!document.querySelector('#error').hidden;
      idea.value='A neighborhood newsletter'; idea.dispatchEvent(new Event('input',{bubbles:true})); form.requestSubmit();
      const first={title:document.querySelector('#result-title').textContent, ready:!copy.disabled,
        animations:document.querySelector('#result').getAnimations().length};
      idea.value='A different newsletter'; idea.dispatchEvent(new Event('input',{bubbles:true}));
      const stale={status:document.querySelector('#output-status').textContent, disabled:copy.disabled};
      form.requestSubmit(); const second={title:document.querySelector('#result-title').textContent, ready:!copy.disabled};
      document.querySelector('#reset').click();
      return {emptyError,first,stale,second,reset:{value:idea.value,hidden:document.querySelector('#result').hidden,disabled:copy.disabled}};
    })()` }, sessionId);
    assert.ok(!response.exceptionDetails, JSON.stringify(response.exceptionDetails));
    assert.deepEqual(response.result.value, { emptyError: true, first: { title: 'A neighborhood newsletter', ready: true, animations: 0 }, stale: { status: 'INPUT CHANGED', disabled: true }, second: { title: 'A different newsletter', ready: true }, reset: { value: '', hidden: true, disabled: true } });
  } finally {
    await session.stop(options);
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
});
