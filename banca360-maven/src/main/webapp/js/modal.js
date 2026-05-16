/* ============================================================
   modal.js — Modal genérico + modal de confirmación
   ============================================================ */

function showModal(title, bodyHTML, opts = {}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const footerHTML = opts.footer ? `<footer class="modal-footer">${opts.footer}</footer>` : '';
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <header class="modal-header">
        <h2 id="modalTitle">${title}</h2>
        <button class="icon-btn" id="closeModal" aria-label="Cerrar">
          <i class="ph ph-x"></i>
        </button>
      </header>
      <div class="modal-body">${bodyHTML}</div>
      ${footerHTML}
    </div>
  `;
  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('#closeModal')) close();
  });
  document.addEventListener('keydown', function escClose(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escClose); }
  });

  if (typeof opts.onMount === 'function') opts.onMount(backdrop, close);
  return { close, root: backdrop };
}

/* Confirmación con botones Confirmar / Cancelar */
function showConfirm({ title, bodyHTML, confirmText = 'Confirmar', cancelText = 'Cancelar', destructive = false, onConfirm }) {
  const footer = `
    <button class="btn-secondary" data-confirm-cancel>${cancelText}</button>
    <button class="${destructive ? 'btn-destructive' : 'btn-primary'}" data-confirm-ok>${confirmText}</button>
  `;
  showModal(title, bodyHTML, {
    footer,
    onMount: (root, close) => {
      root.querySelector('[data-confirm-cancel]').addEventListener('click', close);
      root.querySelector('[data-confirm-ok]').addEventListener('click', () => {
        close();
        if (typeof onConfirm === 'function') onConfirm();
      });
    }
  });
}
