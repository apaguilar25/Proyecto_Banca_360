/* ============================================================
   shell.js — Header, sidebar drawer y comportamientos compartidos
   ============================================================ */

(function initShell() {
  applyTheme();

  document.addEventListener('DOMContentLoaded', () => {
    const currentPage = document.body.dataset.page;

    // Marca el item activo del sidebar
    document.querySelectorAll('.sidebar [data-nav]').forEach(link => {
      if (link.dataset.nav === currentPage) link.classList.add('active');
    });

    // Botón hamburguesa abre/cierra sidebar
    const hamburger = document.getElementById('hamburgerBtn');
    const sidebar   = document.querySelector('.sidebar');
    const backdrop  = document.getElementById('sidebarBackdrop');

    // Añade o quita la clase 'open' para mostrar u ocultar el sidebar y el backdrop
    const closeSidebar = () => {
      sidebar?.classList.remove('open');
      backdrop?.classList.remove('open');
    };
    const openSidebar = () => {
      sidebar?.classList.add('open');
      backdrop?.classList.add('open');
    };

    hamburger?.addEventListener('click', () => {
      if (sidebar?.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
    backdrop?.addEventListener('click', closeSidebar);
    sidebar?.querySelectorAll('.nav-item').forEach(n =>
      n.addEventListener('click', closeSidebar)
    );

    // Botón de tema
    wireThemeButton(document.getElementById('toggleTheme'));

    // Esto escribe el nombre del usuario en cualquier parte que haya un elemento con el atributo data-username
    // Nombre del usuario
    if (AppState.user) {
      document.querySelectorAll('[data-username]').forEach(el => {
        el.textContent = AppState.user.name;
      });
    }
  });
})();
