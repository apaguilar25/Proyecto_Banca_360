/* ============================================================
   modal.js — Modal genérico + modal de confirmación
   ============================================================ */

function showModal(title, bodyHTML, opts = {}) {
  const backdrop = document.createElement('div'); // Crea etiqueta div aun no visible en la página
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
  `;    // bodyHTML trae los datos que van dentro del modal
        // Luego se puede usar el footer para agregar botones personalizados

  document.body.appendChild(backdrop); // Agrega el modal al final del body del html, haciéndolo visible


  const close = () => backdrop.remove(); // creando función para cerrar el modal, eliminando el backdrop del DOM
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('#closeModal')) close(); // click al backdrop o a la X
  });
  document.addEventListener('keydown', function escClose(e) { // cerrar modal con tecla esc
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escClose); }
  });

  // Si se pasó una función onMount en opts, la ejecuta pasando el root del modal y la función close
  if (typeof opts.onMount === 'function') opts.onMount(backdrop, close);
  return { close, root: backdrop };
}

/* Confirmación con botones Confirmar / Cancelar */
function showConfirm({ title, bodyHTML, confirmText = 'Confirmar', cancelText = 'Cancelar', destructive = false, onConfirm }) {
  // El footer del modal tiene botón confirmar y cancelar 
  const footer = `
    <button class="btn-secondary" data-confirm-cancel>${cancelText}</button>
    <button class="${destructive ? 'btn-destructive' : 'btn-primary'}" data-confirm-ok>${confirmText}</button>
  `;
  // Llama a showModal pasando el título, el cuerpo y el footer con los botones, además de una función onMount para agregar los listeners a los botones
  showModal(title, bodyHTML, {
    footer,
    // En onMount, se agregan los event listeners a los botones
    onMount: (root, close) => {
      root.querySelector('[data-confirm-cancel]').addEventListener('click', close);
      root.querySelector('[data-confirm-ok]').addEventListener('click', () => {
        close();
        if (typeof onConfirm === 'function') onConfirm();
      });
    }
  });
}
