/* ============================================================
   dashboard.js — Saldo, últimas transacciones y toggles
   ============================================================ */

let _showBalance = true;

document.addEventListener('DOMContentLoaded', () => {
  paintBalanceMasked();
  renderLatest();

  document.getElementById('toggleBalance').addEventListener('click', toggleBalanceFn);

  // Toggle adicional en "Últimas Transacciones"
  document.getElementById('toggleBalance2')?.addEventListener('click', toggleBalanceFn);
});

function toggleBalanceFn() {
  _showBalance = !_showBalance;
  paintBalanceMasked();
}

function paintBalanceMasked() {
  const el = document.getElementById('balanceAmount');
  el.textContent = _showBalance ? formatMoney(AppState.balance) : '$ • • • •';
  document.querySelectorAll('#toggleBalance i, #toggleBalance2 i').forEach(i => {
    i.className = 'ph ' + (_showBalance ? 'ph-eye' : 'ph-eye-slash');
  });
  // También enmascarar montos de últimas transacciones
  document.querySelectorAll('#latestList .txn-amount').forEach(el => {
    const sign = el.dataset.sign || '';
    const amount = el.dataset.amount || '';
    el.textContent = _showBalance ? `${sign}${formatMoney(amount)}` : `${sign}• • •`;
  });
}

function renderLatest() {
  const list = document.getElementById('latestList');
  const latest = AppState.transactions.slice(0, 3);

  if (!latest.length) {
    list.innerHTML = '<p style="padding:20px; color:var(--text-secondary);">Sin movimientos</p>';
    return;
  }
  list.innerHTML = latest.map(renderTxnRow).join('');
  list.querySelectorAll('[data-txn]').forEach(btn => {
    btn.addEventListener('click', () => openTxnDetail(btn.dataset.txn));
  });
}

function renderTxnRow(t) {
  const isIn = t.type === 'received';
  const sign = isIn ? '+' : '-';
  return `
    <button class="ios-list-item" data-txn="${t.id}">
      <span class="icon-circle ${isIn ? 'in' : 'out'}">
        <i class="ph ${isIn ? 'ph-arrow-down-left' : 'ph-arrow-up-right'}"></i>
      </span>
      <span class="txn-info">
        <span class="txn-desc">${t.desc}</span>
        <span class="txn-date">${t.date}</span>
      </span>
      <span class="txn-amount ${isIn ? 'in' : 'out'}" data-sign="${sign}" data-amount="${t.amount}">
        ${sign}${formatMoney(t.amount)}
      </span>
    </button>
  `;
}

function openTxnDetail(id) {
  const t = AppState.transactions.find(x => x.id === id);
  if (!t) return;
  const isIn = t.type === 'received';
  showModal('Detalle de transacción', `
    <div class="modal-row"><span class="key">ID</span><span class="val">${t.id}</span></div>
    <div class="modal-row"><span class="key">Tipo</span><span class="val">${categoryLabel(t.category)}</span></div>
    <div class="modal-row"><span class="key">Fecha</span><span class="val">${t.date}</span></div>
    <div class="modal-row"><span class="key">Concepto</span><span class="val">${t.concept || '—'}</span></div>
    <div class="modal-row"><span class="key">${isIn ? 'Emisor' : 'Receptor'}</span><span class="val">${t.from || t.to || '—'}</span></div>
    <div class="modal-row"><span class="key">Monto</span>
      <span class="val" style="color:${isIn?'var(--success)':'var(--error)'}">
        ${isIn?'+':'-'}${formatMoney(t.amount)}
      </span>
    </div>
  `);
}

function categoryLabel(c) {
  if (c === 'transfer')      return 'Transferencia';
  if (c === 'mobilePayment') return 'Pago Móvil';
  if (c === 'deposit')       return 'Depósito';
  return 'Movimiento';
}
