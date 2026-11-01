const products = {
  daily: { name: 'The Daily Blend', price: 18 },
  golden: { name: 'Golden Hour', price: 20 },
  evening: { name: 'Evening Wind', price: 19 }
};
const quantities = { daily: 0, golden: 0, evening: 0 };
const dialog = document.querySelector('#cart');
const items = document.querySelector('#cart-items');
const live = document.querySelector('#announcement');

function render() {
  const entries = Object.entries(quantities).filter(([, count]) => count > 0);
  const count = entries.reduce((sum, [, n]) => sum + n, 0);
  const total = entries.reduce((sum, [id, n]) => sum + products[id].price * n, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#dialog-count').textContent = count;
  document.querySelector('#cart-total').textContent = '$' + total;
  items.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.className = 'cart-empty';
    empty.textContent = 'Your bag is empty. Find a blend that suits your moment.';
    items.append(empty);
    return;
  }
  for (const [id, quantity] of entries) {
    const row = document.createElement('div');
    row.className = 'cart-row';
    const detail = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = products[id].name;
    const price = document.createElement('p');
    price.textContent = '$' + products[id].price + ' each';
    detail.append(title, price);
    const controls = document.createElement('div');
    controls.className = 'quantity';
    for (const [label, delta] of [['−', -1], ['+', 1]]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.setAttribute('aria-label', (delta < 0 ? 'Remove one ' : 'Add one ') + products[id].name);
      button.addEventListener('click', () => {
        quantities[id] = Math.max(0, quantities[id] + delta);
        render();
        live.textContent = products[id].name + ': ' + quantities[id] + ' in bag';
        // The previous controls were replaced; return focus to the matching control or the bag heading.
        const replacement = items.querySelector(`[data-id="${id}"] [aria-label="${button.getAttribute('aria-label')}"]`);
        (replacement ?? document.querySelector('#cart-close')).focus();
      });
      if (delta > 0) {
        const value = document.createElement('span');
        value.textContent = quantity;
        controls.append(value);
      }
      controls.append(button);
    }
    row.dataset.id = id;
    row.append(detail, controls);
    items.append(row);
  }
}
document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.add;
  quantities[id] += 1;
  render();
  live.textContent = products[id].name + ' added to bag';
}));
document.querySelector('#cart-open').addEventListener('click', () => { render(); dialog.showModal(); });
document.querySelector('#cart-close').addEventListener('click', () => dialog.close());
document.querySelector('#continue-shopping').addEventListener('click', () => dialog.close());
render();
