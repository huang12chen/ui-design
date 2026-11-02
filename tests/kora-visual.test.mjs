import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';

const script = await readFile(new URL('../examples/kora-shop/visual.js', import.meta.url), 'utf8');

async function mount({ reduced = false, rejectImage = false } = {}) {
  const frames = new Map();
  let frameId = 0;
  const preference = new EventTarget();
  preference.matches = reduced;
  const button = new EventTarget();
  button.hidden = true;
  button.setAttribute = (name, value) => { button[name] = value; };
  const image = { naturalWidth: 400, naturalHeight: 200, decode: () => rejectImage ? Promise.reject(new Error('unavailable')) : Promise.resolve() };
  const classes = new Set();
  const host = {
    dataset: {},
    classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x) },
    getBoundingClientRect: () => ({ width: 400, height: 200, top: 0, bottom: 200 }),
    querySelector: () => image,
    append: node => { host.canvas = node; }
  };
  const ctx = { clearRect(){}, fillRect(){}, setTransform(){}, drawImage(){}, getImageData(){ return { data: new Uint8Array(50000).fill(128) }; } };
  const document = new EventTarget();
  document.hidden = false;
  document.querySelector = selector => selector === '.campaign' ? host : button;
  document.createElement = () => ({ hidden: false, getContext: () => ctx, setAttribute(){} });
  const window = new EventTarget();
  window.matchMedia = () => preference;
  window.IntersectionObserver = class { observe(){} };
  runInNewContext(script, {
    document, window, matchMedia: window.matchMedia, devicePixelRatio: 1, innerHeight: 800,
    IntersectionObserver: window.IntersectionObserver,
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id), Math, Promise
  });
  await new Promise(resolve => setImmediate(resolve));
  return { host, button, preference, frames, tick(time) { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(time)); } };
}

test('image reveal can be skipped, replayed and stopped for reduced motion', async () => {
  const { host, button, preference, frames, tick } = await mount();
  assert.equal(host.dataset.reveal, 'forming');
  assert.equal(button['aria-label'], 'Skip image reveal');
  tick(100); tick(1400);
  assert.equal(host.dataset.reveal, 'settled');
  assert.equal(host.canvas.hidden, true);
  assert.equal(button['aria-label'], 'Replay image reveal');
  button.dispatchEvent(new Event('click'));
  assert.equal(host.dataset.reveal, 'forming');
  button.dispatchEvent(new Event('click'));
  assert.equal(host.dataset.reveal, 'settled');
  assert.equal(frames.size, 0);
  button.dispatchEvent(new Event('click'));
  preference.matches = true;
  preference.dispatchEvent(new Event('change'));
  assert.equal(host.dataset.reveal, 'settled');
  assert.equal(button.hidden, true);
  assert.equal(frames.size, 0);
});

test('reduced motion and image failure keep the static image without a replay control', async () => {
  for (const options of [{ reduced: true }, { rejectImage: true }]) {
    const { host, button, frames } = await mount(options);
    assert.equal(button.hidden, true);
    assert.equal(host.classList.contains('is-revealing'), false);
    assert.equal(frames.size, 0);
  }
});
