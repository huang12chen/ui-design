const shipments = [
  { id: 'RL-2048', customer: 'North Studio', destination: 'Portland, OR', status: 'attention', days: 1, updated: 'Today', next: 'Confirm the delivery address before the next dispatch.' },
  { id: 'RL-2047', customer: 'Arbor Supply', destination: 'Austin, TX', status: 'transit', days: 2, updated: 'Yesterday', next: 'The shipment is moving through the regional hub.' },
  { id: 'RL-2046', customer: 'Common Field', destination: 'Brooklyn, NY', status: 'delivered', days: 4, updated: '4 days ago', next: 'Delivery is complete. No further action is needed.' },
  { id: 'RL-2045', customer: 'Oak & Stone', destination: 'Denver, CO', status: 'attention', days: 6, updated: '6 days ago', next: 'Review the carrier exception and choose a new collection window.' },
  { id: 'RL-2044', customer: 'Moss Studio', destination: 'Seattle, WA', status: 'delivered', days: 12, updated: '12 days ago', next: 'Delivery is complete. No further action is needed.' },
  { id: 'RL-2043', customer: 'East Works', destination: 'Boston, MA', status: 'transit', days: 21, updated: '21 days ago', next: 'The shipment is moving through the regional hub.' }
];
const labels = { attention: 'Needs attention', transit: 'In transit', delivered: 'Delivered' };
const period = document.querySelector('#period');
const status = document.querySelector('#status');
const search = document.querySelector('#search');
const rows = document.querySelector('#rows');
const detailTitle = document.querySelector('#detail-title');
const detail = document.querySelector('#detail-body');
let selectedId = null;

function renderDetail(item) {
  detailTitle.textContent = item ? item.id : 'Select a shipment';
  detail.replaceChildren();
  if (!item) {
    const p = document.createElement('p');
    p.className = 'detail-placeholder';
    p.textContent = 'Choose a row to see its destination and next step without losing your place.';
    detail.append(p);
    return;
  }
  const content = document.createElement('div');
  content.className = 'detail-content';
  const badge = document.createElement('span');
  badge.className = 'status status-' + item.status;
  badge.textContent = labels[item.status];
  const dl = document.createElement('dl');
  for (const [key, value] of [['Customer', item.customer], ['Destination', item.destination], ['Updated', item.updated]]) {
    const group = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = key;
    const dd = document.createElement('dd'); dd.textContent = value;
    group.append(dt, dd); dl.append(group);
  }
  const next = document.createElement('p');
  next.className = 'next-step';
  const title = document.createElement('strong'); title.textContent = 'Next step';
  next.append(title, document.createTextNode(item.next));
  content.append(badge, dl, next); detail.append(content);
}
function render() {
  const query = search.value.trim().toLowerCase();
  const visible = shipments.filter(item => item.days <= Number(period.value) &&
    (status.value === 'all' || item.status === status.value) &&
    [item.id, item.customer, item.destination].some(value => value.toLowerCase().includes(query)));
  if (!visible.some(item => item.id === selectedId)) selectedId = null;
  document.querySelector('#metric-total').textContent = visible.length;
  for (const key of Object.keys(labels)) document.querySelector('#metric-' + key).textContent = visible.filter(item => item.status === key).length;
  document.querySelector('#result-count').textContent = visible.length + (visible.length === 1 ? ' shipment' : ' shipments');
  document.querySelector('#empty').hidden = visible.length > 0;
  rows.replaceChildren();
  for (const item of visible) {
    const row = document.createElement('tr');
    row.setAttribute('aria-selected', String(item.id === selectedId));
    const id = document.createElement('td');
    const button = document.createElement('button'); button.type = 'button'; button.textContent = item.id;
    button.addEventListener('click', () => { selectedId = item.id; render(); rows.querySelector(`[data-id="${item.id}"] button`)?.focus(); });
    const customer = document.createElement('span'); customer.className = 'subline'; customer.textContent = item.customer;
    id.append(button, customer);
    const destination = document.createElement('td'); destination.textContent = item.destination;
    const state = document.createElement('td');
    const badge = document.createElement('span'); badge.className = 'status status-' + item.status; badge.textContent = labels[item.status]; state.append(badge);
    const updated = document.createElement('td'); updated.textContent = item.updated;
    const arrow = document.createElement('td'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗';
    row.dataset.id = item.id; row.append(id, destination, state, updated, arrow); rows.append(row);
  }
  renderDetail(visible.find(item => item.id === selectedId));
}
for (const control of [period, status, search]) control.addEventListener(control === search ? 'input' : 'change', render);
render();
