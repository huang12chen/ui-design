const root = document.documentElement;
const motionToggle = document.querySelector('#motion-toggle');
const motionLabel = document.querySelector('#motion-label');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let userSetMotion = false;

function setMotion(enabled) {
  root.dataset.motion = enabled ? 'on' : 'off';
  motionToggle.setAttribute('aria-pressed', String(enabled));
  motionLabel.textContent = enabled ? 'Motion on' : 'Motion off';
  const holdLabel = document.querySelector('#hold-label');
  if (holdLabel) holdLabel.textContent = enabled ? 'HOLD TO SEND' : 'TAP TO SEND';
  const holdHelp = document.querySelector('#hold-help');
  if (holdHelp) holdHelp.textContent = enabled ? 'Press and hold the circle to send a visual pulse. Release early to cancel. You can also use the button below.' : 'Tap the circle or use the button below to send a pulse without animation.';
  if (!enabled) cancelHold();
  if (!enabled) document.querySelector('#pulse-echo')?.getAnimations().forEach(animation => animation.cancel());
  if (!enabled) document.querySelectorAll('#notes .note').forEach(note => note.getAnimations().forEach(animation => animation.cancel()));
}
motionToggle.addEventListener('click', () => {
  userSetMotion = true;
  setMotion(root.dataset.motion !== 'on');
});
reduced.addEventListener('change', () => { if (!userSetMotion) setMotion(!reduced.matches); });

const moods = {
  tide: { name: 'Tidal', description: 'A little room to breathe.' },
  flare: { name: 'Flare', description: 'A warmer kind of energy.' },
  orbit: { name: 'Orbit', description: 'A spark of the unexpected.' }
};
document.querySelectorAll('[data-select]').forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.select;
  document.body.dataset.mode = selected;
  document.querySelectorAll('[data-select]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#mood-name').textContent = moods[selected].name;
  document.querySelector('#mood-description').textContent = moods[selected].description;
}));

const intensity = document.querySelector('#intensity');
const stage = document.querySelector('#stage');
function updateIntensity() {
  stage.style.setProperty('--intensity', Number(intensity.value) / 100);
  document.querySelector('#intensity-value').textContent = intensity.value + '%';
}
intensity.addEventListener('input', updateIntensity);
updateIntensity();

const compare = document.querySelector('#compare-range');
compare.addEventListener('input', () => {
  document.querySelector('#compare-frame').style.setProperty('--reveal', compare.value + '%');
  document.querySelector('#compare-value').textContent = compare.value + '%';
});

const holdButton = document.querySelector('#hold-button');
const pulseEcho = document.querySelector('#pulse-echo');
let holdFrame = 0, activePointer = null, holdStarted = 0, pulses = 0, holdCompleted = false;
function cancelHold() {
  cancelAnimationFrame(holdFrame);
  holdFrame = 0;
  activePointer = null;
  document.querySelector('#hold-button')?.style.setProperty('--hold', '0%');
}
function sendPulse() {
  pulses += 1;
  document.querySelector('#pulse-status').textContent = pulses === 1 ? '1 visual pulse sent.' : pulses + ' visual pulses sent.';
  pulseEcho.getAnimations().forEach(animation => animation.cancel());
  if (root.dataset.motion === 'on' && typeof Element.prototype.animate === 'function') {
    pulseEcho.animate([{ opacity: .9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(2.1)' }], { duration: 650, easing: 'ease-out' });
  }
}
holdButton.addEventListener('pointerdown', event => {
  if (root.dataset.motion !== 'on' || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
  cancelHold();
  activePointer = event.pointerId;
  holdStarted = performance.now();
  holdCompleted = false;
  holdButton.setPointerCapture(event.pointerId);
  const tick = now => {
    if (activePointer !== event.pointerId) return;
    const progress = Math.min(1, (now - holdStarted) / 800);
    holdButton.style.setProperty('--hold', (progress * 100) + '%');
    if (progress >= 1) { holdCompleted = true; sendPulse(); holdFrame = 0; }
    else holdFrame = requestAnimationFrame(tick);
  };
  holdFrame = requestAnimationFrame(tick);
});
holdButton.addEventListener('pointerup', event => { if (event.pointerId === activePointer) cancelHold(); });
holdButton.addEventListener('pointermove', event => {
  if (event.pointerId !== activePointer) return;
  const rect = holdButton.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
    cancelHold();
    if (holdButton.hasPointerCapture(event.pointerId)) holdButton.releasePointerCapture(event.pointerId);
  }
});
holdButton.addEventListener('pointercancel', cancelHold);
holdButton.addEventListener('lostpointercapture', cancelHold);
holdButton.addEventListener('keydown', event => { if (event.key === 'Escape') cancelHold(); });
holdButton.addEventListener('click', event => {
  if (event.detail === 0 || root.dataset.motion !== 'on') sendPulse();
  else if (holdCompleted) holdCompleted = false;
});
document.querySelector('#pulse-now').addEventListener('click', sendPulse);

let pointerFrame = 0;
stage.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || root.dataset.motion !== 'on') return;
  const rect = stage.getBoundingClientRect();
  const x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100));
  const y = Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100));
  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => { stage.style.setProperty('--mx', x + '%'); stage.style.setProperty('--my', y + '%'); });
});
stage.addEventListener('pointerleave', () => {
  cancelAnimationFrame(pointerFrame);
  stage.style.removeProperty('--mx');
  stage.style.removeProperty('--my');
});

const list = document.querySelector('#notes');
const orders = { flow: ['form', 'feeling', 'function'], contrast: ['function', 'form', 'feeling'] };
document.querySelectorAll('[data-order]').forEach(button => button.addEventListener('click', () => {
  const notes = Array.from(list.children);
  notes.forEach(note => note.getAnimations().forEach(animation => animation.cancel()));
  const before = new Map(notes.map(note => [note.dataset.note, note.getBoundingClientRect()]));
  for (const name of orders[button.dataset.order]) list.append(notes.find(note => note.dataset.note === name));
  document.querySelectorAll('[data-order]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#sequence-status').textContent = 'Current sequence: ' + orders[button.dataset.order].join(', ') + '.';
  if (root.dataset.motion === 'on' && typeof Element.prototype.animate === 'function') {
    for (const note of notes) {
      const first = before.get(note.dataset.note), last = note.getBoundingClientRect();
      note.animate([{ transform: `translate(${first.left - last.left}px, ${first.top - last.top}px)` }, { transform: 'translate(0, 0)' }], { duration: 650, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
  }
}));
setMotion(!reduced.matches);
