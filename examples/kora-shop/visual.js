(() => {
  const host = document.querySelector('.campaign');
  const image = host?.querySelector('.campaign-image');
  const button = document.querySelector('#replay-reveal');
  if (!host || !image || !button || !window.matchMedia) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const sampler = document.createElement('canvas');
  const sample = sampler.getContext('2d', { willReadFrequently: true });
  if (!context || !sample) return;
  canvas.className = 'campaign-visual';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.hidden = true;
  host.append(canvas);
  let frame = 0;
  let started = 0;
  let ready = false;
  let cells = [];
  let width = 0, height = 0, step = 0;

  function finish() {
    cancelAnimationFrame(frame);
    frame = 0;
    host.classList.remove('is-revealing');
    host.dataset.reveal = 'settled';
    canvas.hidden = true;
    button.textContent = 'Replay ↻';
    button.setAttribute('aria-label', 'Replay image reveal');
  }

  function render(time) {
    if (!started) started = time;
    const progress = Math.min(1, (time - started) / 1150);
    const ease = 1 - (1 - progress) ** 3;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#30231c';
    context.fillRect(0, 0, width, height);
    for (const cell of cells) {
      const x = cell.x + cell.dx * (1 - ease);
      const y = cell.y + cell.dy * (1 - ease);
      const size = Math.max(1, step * (.18 + .84 * ease));
      context.fillStyle = cell.color;
      context.fillRect(x - size / 2, y - size / 2, size, size);
    }
    if (progress < 1) frame = requestAnimationFrame(render);
    else finish();
  }

  function start() {
    if (preference.matches || document.hidden || !image.naturalWidth) return;
    const box = host.getBoundingClientRect();
    if (!box.width || !box.height || box.bottom < 0 || box.top > innerHeight) return;
    try {
      finish();
      width = Math.round(box.width);
      height = Math.round(box.height);
      const density = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
      step = Math.max(12, Math.sqrt(width * height / 1400));
      const columns = Math.ceil(width / step), rows = Math.ceil(height / step);
      sampler.width = columns; sampler.height = rows;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const sw = width / scale, sh = height / scale;
      const x = (image.naturalWidth - sw) * .59, y = (image.naturalHeight - sh) / 2;
      sample.drawImage(image, x, y, sw, sh, 0, 0, columns, rows);
      const pixels = sample.getImageData(0, 0, columns, rows).data;
      cells = [];
      for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
        const index = (row * columns + column) * 4;
        const seed = Math.sin(column * 91.7 + row * 173.1) * 43758.5;
        const angle = (seed - Math.floor(seed)) * Math.PI * 2;
        cells.push({ x: (column + .5) * step, y: (row + .5) * step,
          dx: Math.cos(angle) * step * 3, dy: Math.sin(angle) * step * 3,
          color: `rgb(${pixels[index]},${pixels[index + 1]},${pixels[index + 2]})` });
      }
      canvas.hidden = false;
      host.classList.add('is-revealing');
      host.dataset.reveal = 'forming';
      button.textContent = 'Skip';
      button.setAttribute('aria-label', 'Skip image reveal');
      started = 0;
      frame = requestAnimationFrame(render);
    } catch {
      finish();
      ready = false;
      button.hidden = true;
    }
  }

  button.addEventListener('click', () => frame ? finish() : start());
  preference.addEventListener('change', () => { finish(); button.hidden = preference.matches || !ready; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
  window.addEventListener('resize', finish, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { if (!entry.isIntersecting && frame) finish(); }).observe(host);
  }
  const decoded = typeof image.decode === 'function' ? image.decode() : new Promise((resolve, reject) => {
    if (image.complete) return image.naturalWidth ? resolve() : reject();
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', reject, { once: true });
  });
  decoded.then(() => {
    ready = true;
    button.hidden = preference.matches;
    start();
  }).catch(() => { finish(); button.hidden = true; });
})();
