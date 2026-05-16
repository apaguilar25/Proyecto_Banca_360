/* ============================================================
   transfer.js — Transferencias con confirmación
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  paintBalance();

  // Cuenta destino: solo dígitos y guiones
  const destEl = document.getElementById('tDestino');
  destEl.addEventListener('input', () => {
    destEl.value = destEl.value.replace(/[^\d-]/g, '');
  });

  const form = document.getElementById('transferForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = document.getElementById('tError');
    err.hidden = true;

    const destino  = destEl.value.replace(/-/g, '').trim();
    const banco    = document.getElementById('tBanco').value;
    const bancoTxt = document.getElementById('tBanco').selectedOptions[0]?.textContent || banco;
    const monto    = parseFloat(document.getElementById('tMonto').value);
    const concepto = document.getElementById('tConcepto').value.trim() || 'Transferencia';

    if (!destino || !banco)      return show('Completa los campos requeridos.');
    if (!/^\d{6,20}$/.test(destino)) return show('La cuenta destino debe ser numérica (mínimo 6 dígitos).');
    if (!monto || monto <= 0)    return show('Monto inválido.');
    if (monto > AppState.balance) return show('Saldo insuficiente.');

    showConfirm({
      title: 'Confirmar transferencia',
      bodyHTML: `
        <div class="modal-row"><span class="key">Destino</span><span class="val">${destino}</span></div>
        <div class="modal-row"><span class="key">Banco</span><span class="val">${bancoTxt}</span></div>
        <div class="modal-row"><span class="key">Concepto</span><span class="val">${concepto}</span></div>
        <div class="modal-row"><span class="key">Monto</span><span class="val">${formatMoney(monto)}</span></div>
      `,
      confirmText: 'Confirmar y enviar',
      onConfirm: () => {
        AppState.balance -= monto;
        addTransaction({
          type: 'sent', category: 'transfer',
          desc: `Transferencia a cuenta ${destino}`,
          amount: monto, to: destino, concept: concepto
        });
        showModal('Transferencia exitosa', `
          <p style="color:var(--success); font-weight:600;">¡Tu transferencia se realizó con éxito!</p>
          <div class="modal-row"><span class="key">Destino</span><span class="val">${destino}</span></div>
          <div class="modal-row"><span class="key">Banco</span><span class="val">${bancoTxt}</span></div>
          <div class="modal-row"><span class="key">Concepto</span><span class="val">${concepto}</span></div>
          <div class="modal-row"><span class="key">Monto</span><span class="val" style="color:var(--error)">-${formatMoney(monto)}</span></div>
          <div class="modal-row"><span class="key">Saldo restante</span><span class="val">${formatMoney(AppState.balance)}</span></div>
        `, {
          footer: `<a class="btn-primary" href="dashboard.html">Ir al dashboard</a>`
        });
      }
    });

    function show(msg) {
      err.hidden = false; err.textContent = msg;
      err.style.animation = 'none'; void err.offsetWidth; err.style.animation = '';
    }
  });
});
