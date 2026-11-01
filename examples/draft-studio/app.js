const form = document.querySelector('#form');
const idea = document.querySelector('#idea');
const tone = document.querySelector('#tone');
const error = document.querySelector('#error');
const copy = document.querySelector('#copy');
const feedback = document.querySelector('#feedback');
let currentOutput = '';
let isStale = false;

function markChanged() {
  document.querySelector('#count').textContent = idea.value.length + ' / 500';
  if (idea.value.trim()) error.hidden = true;
  if (currentOutput) {
    isStale = true;
    copy.disabled = true;
    document.querySelector('#output-status').textContent = 'INPUT CHANGED';
    document.querySelector('#output-note').textContent = 'Input changed. Build again before copying.';
    feedback.textContent = '';
  }
}
idea.addEventListener('input', markChanged);
tone.addEventListener('change', markChanged);
idea.addEventListener('keydown', event => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.isComposing && event.keyCode !== 229) {
    event.preventDefault(); form.requestSubmit();
  }
});
document.querySelectorAll('[data-suggestion]').forEach(button => button.addEventListener('click', () => {
  idea.value = button.dataset.suggestion;
  markChanged();
  idea.focus();
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = idea.value.trim();
  if (!text) { error.hidden = false; idea.focus(); return; }
  error.hidden = true;
  const directions = {
    clear: ['Explain who this is for and what they will learn.', 'Break the subject into a few useful points, with one concrete example for each.', 'Invite the reader to try one small next step.'],
    warm: ['Start with a relatable moment and tell the reader why the topic matters.', 'Share the main ideas as a friendly conversation, grounded in a concrete example.', 'End with an encouraging invitation to begin.'],
    concise: ['State the subject and the value in one direct sentence.', 'List the essential points in a clear order; remove anything repetitive.', 'Finish with one specific action.']
  };
  const [opening, body, close] = directions[tone.value];
  document.querySelector('#result-title').textContent = text;
  document.querySelector('#result-opening').textContent = opening;
  document.querySelector('#result-body').textContent = body;
  document.querySelector('#result-close').textContent = close;
  document.querySelector('#placeholder').hidden = true;
  document.querySelector('#result').hidden = false;
  const result = document.querySelector('#result');
  result.getAnimations().forEach(animation => animation.cancel());
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && typeof Element.prototype.animate === 'function') {
    result.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280, easing: 'ease-out' });
  }
  document.querySelector('#output-status').textContent = 'OUTLINE READY';
  document.querySelector('#output-note').textContent = 'Local template · review and edit in your own document.';
  feedback.textContent = '';
  currentOutput = `${text}\n\nOpen with the purpose\n${opening}\n\nDevelop the idea\n${body}\n\nClose with a next step\n${close}`;
  isStale = false;
  copy.disabled = false;
});
copy.addEventListener('click', async () => {
  if (!currentOutput || isStale) return;
  try { await navigator.clipboard.writeText(currentOutput); feedback.textContent = 'Outline copied.'; }
  catch { feedback.textContent = 'Copy was unavailable. Select the outline text to copy it.'; }
});
document.querySelector('#reset').addEventListener('click', () => {
  form.reset(); currentOutput = ''; isStale = false; copy.disabled = true; error.hidden = true;
  document.querySelector('#count').textContent = '0 / 500';
  document.querySelector('#placeholder').hidden = false; document.querySelector('#result').hidden = true;
  document.querySelector('#output-status').textContent = 'WAITING FOR INPUT';
  document.querySelector('#output-note').textContent = 'Nothing has been generated yet.';
  feedback.textContent = ''; idea.focus();
});
