/* ============================================================
   mobilePayment.js — Pago Móvil con prefijo de operadora y confirmación
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const telNum = document.getElementById('mpTelNum');
  const cedNum = document.getElementById('mpCedNum');

  telNum.addEventListener('input', () => {
    telNum.value = telNum.value.replace(/\D/g, '').slice(0, 7);
  });
  cedNum.addEventListener('input', () => {
    cedNum.value = cedNum.value.replace(/\D/g, '').slice(0, 10);
  });

  document.getElementById('mpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = document.getElementById('mpError');
    err.hidden = true;

    const banco   = document.getElementById('mpBanco').value;
    const bancoTxt= document.getElementById('mpBanco').selectedOptions[0]?.textContent || banco;
    const prefTel = document.getElementById('mpTelPrefix').value;
    const tel     = `${prefTel}-${telNum.value}`;
    const prefCed = document.getElementById('mpCedPrefix').value;
    const ced     = `${prefCed}-${cedNum.value}`;
    const monto   = parseFloat(document.getElementById('mpMonto').value);

    if (!banco)                      return show('Selecciona el banco destino.');
    if (telNum.value.length !== 7)   return show('El teléfono debe tener 7 dígitos después del prefijo.');
    if (!/^\d{6,10}$/.test(cedNum.value)) return show('La cédula debe tener entre 6 y 10 dígitos.');
    if (!monto || monto <= 0)        return show('Monto inválido.');
    if (monto > AppState.balance)    return show('Saldo insuficiente.');

    showConfirm({
      title: 'Confirmar Pago Móvil',
      bodyHTML: `
        <div class="modal-row"><span class="key">Banco</span><span class="val">${bancoTxt}</span></div>
        <div class="modal-row"><span class="key">Teléfono</span><span class="val">${tel}</span></div>
        <div class="modal-row"><span class="key">Cédula</span><span class="val">${ced}</span></div>
        <div class="modal-row"><span class="key">Monto</span><span class="val">${formatMoney(monto)}</span></div>
      `,
      confirmText: 'Confirmar y pagar',
      onConfirm: () => {
        AppState.balance -= monto;
        addTransaction({
          type: 'sent', category: 'mobilePayment',
          desc: `Pago Móvil a ${tel}`,
          amount: monto, to: tel, concept: `Pago Móvil ${bancoTxt}`
        });
        showModal('Pago Móvil exitoso', `
          <p class="transfer-success">¡Pago realizado con éxito!</p>
          <div class="modal-row"><span class="key">Banco</span><span class="val">${bancoTxt}</span></div>
          <div class="modal-row"><span class="key">Teléfono</span><span class="val">${tel}</span></div>
          <div class="modal-row"><span class="key">Cédula</span><span class="val">${ced}</span></div>
          <div class="modal-row"><span class="key">Monto</span><span class="val" id="val-negative">-${formatMoney(monto)}</span></div>
          <div class="modal-row"><span class="key">Saldo restante</span><span class="val">${formatMoney(AppState.balance)}</span></div>
        `, { footer: `<a class="btn-primary" href="dashboard.html">Ir al dashboard</a>` });
      }
    });

    function show(msg) {
      err.hidden = false; 
      err.textContent = msg;
      err.style.animation = 'none'; 
      void err.offsetWidth; 
      err.style.animation = '';
    }
  });
});
