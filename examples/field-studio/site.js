const form = document.querySelector('#project-form');
const type = document.querySelector('#project-type');
const note = document.querySelector('#project-note');
const message = document.querySelector('#form-message');
const preview = document.querySelector('#project-preview');
const submit = form.querySelector('button[type="submit"]');

submit.disabled = false;

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!type.value) {
    message.textContent = 'Choose a starting point first.';
    type.focus();
    return;
  }
  if (!note.value.trim()) {
    message.textContent = 'Add a short note about the place.';
    note.focus();
    return;
  }
  document.querySelector('#preview-type').textContent = type.value;
  document.querySelector('#preview-note').textContent = note.value.trim();
  preview.hidden = false;
  message.textContent = 'Your local preview is ready below.';
});

form.addEventListener('input', () => {
  if (!preview.hidden) {
    preview.hidden = true;
    message.textContent = 'Details changed. Prepare the note again to update the preview.';
  } else {
    message.textContent = '';
  }
});

document.querySelector('#clear-project').addEventListener('click', () => {
  form.reset();
  preview.hidden = true;
  message.textContent = 'Project note cleared.';
  type.focus();
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => { link.closest('details').open = false; });
});
