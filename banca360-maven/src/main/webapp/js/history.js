/* ============================================================
   history.js — Filtros direccionales + filtro de tipo (dropdown)
   ============================================================ */

let _dirFilter  = 'all';     // all | received | sent
let _typeFilter = 'all';     // all | transfer | mobilePayment | both (=transfer+mobilePayment)

document.addEventListener('DOMContentLoaded', () => {
  renderHistory();

  // Dirección: segmented control (mutuamente excluyente)
  document.querySelectorAll('[data-dir-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      _dirFilter = btn.dataset.dirFilter;
      document.querySelectorAll('[data-dir-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderHistory();
    });
  });

  // Tipo: select (Transferencias / Pago Móvil / Ambos)
  const typeSel = document.getElementById('typeFilter');
  typeSel.addEventListener('change', () => {
    _typeFilter = typeSel.value;
    renderHistory();
  });
});

function renderHistory() {
  const list = document.getElementById('historyList');
  const items = AppState.transactions.filter(t => {
    const dirOk =
      _dirFilter === 'all' ||
      (_dirFilter === 'received' && t.type === 'received') ||
      (_dirFilter === 'sent'     && t.type === 'sent');

    const typeOk =
      _typeFilter === 'all' ||
      (_typeFilter === 'transfer'      && t.category === 'transfer') ||
      (_typeFilter === 'mobilePayment' && t.category === 'mobilePayment') ||
      (_typeFilter === 'both'          && (t.category === 'transfer' || t.category === 'mobilePayment'));

    return dirOk && typeOk;
  });

  if (!items.length) {
    list.innerHTML = '<p style="padding:24px; text-align:center; color:var(--text-secondary);">No hay movimientos para mostrar.</p>';
    return;
  }
  list.innerHTML = items.map(renderTxnRow).join('');

  list.querySelectorAll('[data-txn]').forEach(btn => {
    btn.addEventListener('click', () => openTxnDetail(btn.dataset.txn));
  });
}

function renderTxnRow(t) {
  const isIn = t.type === 'received';
  return `
    <button class="ios-list-item" data-txn="${t.id}">
      <span class="icon-circle ${isIn ? 'in' : 'out'}">
        <i class="ph ${isIn ? 'ph-arrow-down-left' : 'ph-arrow-up-right'}"></i>
      </span>
      <span class="txn-info">
        <span class="txn-desc">${t.desc}</span>
        <span class="txn-date">${t.date} · ${categoryLabel(t.category)}</span>
      </span>
      <span class="txn-amount ${isIn ? 'in' : 'out'}">
        ${isIn ? '+' : '-'}${formatMoney(t.amount)}
      </span>
    </button>
  `;
}

function categoryLabel(c) {
  if (c === 'transfer')      return 'Transferencia';
  if (c === 'mobilePayment') return 'Pago Móvil';
  if (c === 'deposit')       return 'Depósito';
  return 'Movimiento';
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
