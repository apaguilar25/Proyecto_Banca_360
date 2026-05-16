/* ============================================================
   deposit.js — Depósitos
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('depForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = document.getElementById('depError');
    err.hidden = true;

    const monto = parseFloat(document.getElementById('depMonto').value);
    if (!monto || monto <= 0) {
      err.textContent = 'Monto inválido.';
      err.hidden = false;
      err.style.animation = 'none'; void err.offsetWidth; err.style.animation = '';
      return;
    }

    showConfirm({
      title: 'Confirmar depósito',
      bodyHTML: `
        <div class="modal-row"><span class="key">Cuenta</span><span class="val">Cuenta Ahorros · 0102-0123</span></div>
        <div class="modal-row"><span class="key">Monto</span><span class="val">${formatMoney(monto)}</span></div>
      `,
      confirmText: 'Confirmar depósito',
      onConfirm: () => {
        AppState.balance += monto;
        addTransaction({
          type: 'received', category: 'deposit',
          desc: 'Depósito en cuenta', amount: monto,
          from: 'Banca 360', concept: 'Depósito simulado'
        });
        showModal('Depósito acreditado', `
          <p style="color:var(--success); font-weight:600;">¡Tu depósito fue acreditado con éxito!</p>
          <div class="modal-row"><span class="key">Cuenta</span><span class="val">Cuenta Ahorros · 0102-0123</span></div>
          <div class="modal-row"><span class="key">Monto</span><span class="val" style="color:var(--success)">+${formatMoney(monto)}</span></div>
          <div class="modal-row"><span class="key">Nuevo saldo</span><span class="val">${formatMoney(AppState.balance)}</span></div>
        `, { footer: `<a class="btn-primary" href="dashboard.html">Ir al dashboard</a>` });
      }
    });
  });
});
