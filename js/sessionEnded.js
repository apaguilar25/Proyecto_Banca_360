/* ============================================================
   sessionEnded.js — Limpieza tras cerrar sesión + tema
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof AppState !== 'undefined' && AppState.user) {
    AppState.user = null;
    saveState();
  }
  wireThemeButton(document.getElementById('toggleTheme'));
});
