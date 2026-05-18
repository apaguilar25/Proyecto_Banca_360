/* ============================================================
   dashboard.js — Saldo, últimas transacciones y toggles
   ============================================================ */

let _showBalance = true; // Estado local para mostrar u ocultar el saldo

document.addEventListener('DOMContentLoaded', () => {
  paintBalanceMasked();
  renderLatest();

  document.getElementById('toggleBalance').addEventListener('click', toggleBalanceFn);

  // Toggle adicional en "Últimas Transacciones"
  document.getElementById('toggleBalance2')?.addEventListener('click', toggleBalanceFn);
});

// Un botón acciona ambos. Solo se cambia el estado.
function toggleBalanceFn() {
  _showBalance = !_showBalance;
  paintBalanceMasked();
}

function paintBalanceMasked() {
  // Enmascarar el saldo principal
  const el = document.getElementById('balanceAmount');
  el.textContent = _showBalance ? formatMoney(AppState.balance) : '$ • • • •'; // Si el saldo se muestra, formatear normalmente. Si no, mostrar puntos en lugar del monto.
  document.querySelectorAll('#toggleBalance i, #toggleBalance2 i').forEach(i => {
    i.className = 'ph ' + (_showBalance ? 'ph-eye-slash' : 'ph-eye');
  });
  // También enmascarar montos de últimas transacciones
  document.querySelectorAll('#latestList .txn-amount').forEach(el => {
    const sign = el.dataset.sign || '';
    const amount = el.dataset.amount || '';
    el.textContent = _showBalance ? `${sign}${formatMoney(amount)}` : `${sign} • • • •`;
  });
}


function renderLatest() {
  const list = document.getElementById('latestList');
  const latest = AppState.transactions.slice(0, 3); // Tomar solo las 3 transacciones más recientes

  if (!latest.length) {
    list.innerHTML = '<p class="empty-state-msg">Sin movimientos</p>'; // Si no hubiese nada en el historial
    return;
  }
  // Genera una línea por cada transacción usando renderTxnRow, luego une todo en un solo string para asignarlo al innerHTML de la lista
  // Cada línea es un botón con data-txn que contiene el ID de la transacción, para luego usarlo en el listener y mostrar el detalle al hacer click
  list.innerHTML = latest.map(renderTxnRow).join('');
  list.querySelectorAll('[data-txn]').forEach(btn => {
    btn.addEventListener('click', () => openTxnDetail(btn.dataset.txn)); // modal.js se encarga de mostrar el modal con la información de la transacción al hacer click en cada una de las filas
  });
}

function renderTxnRow(t) {
  const isIn = t.type === 'received';
  const sign = isIn ? '+' : '-';
  // Genera un bloque de HTML usando variables del objeto transacción
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
  const t = AppState.transactions.find(x => x.id === id); // Busca la transacción según el id recibido
  if (!t) return;
  const isIn = t.type === 'received'; // True si fue ingreso
  // Manejo de ventanas emergente de modal.js
  // Pasa el título y el contenido
  showModal('Detalle de transacción', `
    <div class="modal-row"><span class="key">ID</span><span class="val">${t.id}</span></div>
    <div class="modal-row"><span class="key">Tipo</span><span class="val">${categoryLabel(t.category)}</span></div>
    <div class="modal-row"><span class="key">Fecha</span><span class="val">${t.date}</span></div>
    <div class="modal-row"><span class="key">Concepto</span><span class="val">${t.concept || '—'}</span></div>
    <div class="modal-row"><span class="key">${isIn ? 'Emisor' : 'Receptor'}</span><span class="val">${t.from || t.to || '—'}</span></div>
    <div class="modal-row"><span class="key">Monto</span>
      <span class="val modal-amount-status ${isIn? 'status-positive':'status-negative'}">
        ${isIn ?'+':'-'}${formatMoney(t.amount)}
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
