/* ============================================================
   profile.js — Perfil, cambio de contraseña, cierre de sesión
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const u = AppState.user || { name: 'Usuario', email: '—', cedula: '—' };

  document.getElementById('avatarInitial').textContent = (u.name || 'U').trim().charAt(0).toUpperCase();
  document.getElementById('profileName').textContent      = u.name || '—';
  document.getElementById('profileEmail').textContent     = u.email;
  document.getElementById('profileEmailRow').textContent  = u.email;
  document.getElementById('profileCedula').textContent    = u.cedula;

  // Form de cambio de contraseña oculto hasta que se hace click
  const box  = document.getElementById('changePassBox');
  const btn  = document.getElementById('openChangePass');
  btn.addEventListener('click', () => {
    box.hidden = !box.hidden;
    btn.querySelector('.right i').className = box.hidden ? 'ph ph-caret-right' : 'ph ph-caret-down';
  });

  // Mostrar/ocultar contraseñas
  wirePasswordToggle(document.getElementById('cpCurrentToggle'), document.getElementById('cpCurrent'));
  wirePasswordToggle(document.getElementById('cpNewToggle'),     document.getElementById('cpNew'));
  wirePasswordToggle(document.getElementById('cpNew2Toggle'),    document.getElementById('cpNew2'));

  document.getElementById('changePassForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const cur = document.getElementById('cpCurrent').value;
    const n1  = document.getElementById('cpNew').value;
    const n2  = document.getElementById('cpNew2').value;
    const msg = document.getElementById('cpMsg');
    msg.hidden = false; msg.className = 'form-error';
    msg.style.animation = 'none'; void msg.offsetWidth; msg.style.animation = '';

    if (AppState.user && cur !== AppState.user.password)
      { msg.textContent = 'La contraseña actual es incorrecta.'; return; }
    if (!/^\d{6,}$/.test(n1))
      { msg.textContent = 'La nueva contraseña debe ser numérica de 6 o más dígitos.'; return; }
    if (n1 === cur)
      { msg.textContent = 'La nueva contraseña debe ser distinta a la actual.'; return; }
    if (n1 !== n2)
      { msg.textContent = 'Las contraseñas no coinciden.'; return; }

    AppState.user.password = n1;
    saveState();
    msg.className = 'form-success';
    msg.textContent = 'Contraseña actualizada correctamente.';
  });

  // Cerrar sesión con confirmación
  document.getElementById('logoutBtn').addEventListener('click', () => {
    showConfirm({
      title: 'Cerrar sesión',
      bodyHTML: '<p>¿Estás seguro de que quieres cerrar tu sesión?</p>',
      confirmText: 'Cerrar sesión',
      destructive: true,
      onConfirm: () => {
        // Borra todo el estado persistido para evitar que datos del usuario
        // anterior queden disponibles después de cerrar sesión.
        try {
          localStorage.removeItem('banca360_state');
        } catch (e) { / ignorar / }
        try { sessionStorage.clear(); } catch (e) { / ignorar / }

        // También limpia la variable en memoria por si queda referenciada
        try { AppState.user = null; } catch (e) { / ignorar / }

        // Redirige a la pantalla de sesión finalizada
        window.location.href = 'sessionEnded.html';
      }
    });
  });
});
