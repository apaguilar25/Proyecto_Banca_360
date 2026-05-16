/* ============================================================
   auth.js — Login y Registro
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  // Botón de tema en pantallas auth (login/register/security/sessionEnded)
  wireThemeButton(document.getElementById('toggleTheme'));

  if (page === 'login')    wireLogin();
  if (page === 'register') wireRegister();
});

/* ---------- LOGIN ---------- */
function wireLogin() {
  const form = document.getElementById('loginForm');
  const err  = document.getElementById('loginError');
  const btn  = document.getElementById('loginBtn');

  // Tabs Correo / Cédula
  const tabEmail  = document.getElementById('tabEmail');
  const tabCedula = document.getElementById('tabCedula');
  const blockEmail  = document.getElementById('blockEmail');
  const blockCedula = document.getElementById('blockCedula');

  let mode = 'email';
  const setMode = (m) => {
    mode = m;
    tabEmail.classList.toggle('active', m === 'email');
    tabCedula.classList.toggle('active', m === 'cedula');
    blockEmail.hidden  = m !== 'email';
    blockCedula.hidden = m !== 'cedula';
  };
  tabEmail.addEventListener('click', () => setMode('email'));
  tabCedula.addEventListener('click', () => setMode('cedula'));

  // Cédula: solo dígitos
  const cedNums = document.getElementById('loginCedulaNum');
  cedNums.addEventListener('input', () => {
    cedNums.value = cedNums.value.replace(/\D/g, '').slice(0, 10);
  });

  // Mostrar/ocultar contraseña
  wirePasswordToggle(
    document.getElementById('loginPassToggle'),
    document.getElementById('loginPassword')
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showErr(''); err.hidden = true;

    let identifier = '';
    if (mode === 'email') {
      const email = document.getElementById('loginEmail').value.trim();
      if (!email) return showErr('Ingresa tu correo electrónico.');
      if (!isValidEmail(email)) return showErr('Correo electrónico inválido. Verifica el "@" y el dominio.');
      identifier = email;
    } else {
      const prefix = document.getElementById('loginCedulaPrefix').value;
      const num = cedNums.value;
      if (!/^\d{6,10}$/.test(num)) return showErr('La cédula debe tener entre 6 y 10 dígitos numéricos.');
      identifier = `${prefix}-${num}`;
    }

    const pass = document.getElementById('loginPassword').value;
    if (!/^\d{6,}$/.test(pass)) return showErr('La contraseña debe ser numérica de 6 o más dígitos.');

    btn.disabled = true;
    btn.innerHTML = '<span class="ios-spinner"></span>';

    setTimeout(() => {
      if (!AppState.user) {
        // Crea usuario con la información real ingresada
        const isEmail = mode === 'email';
        AppState.user = {
          name: isEmail ? identifier.split('@')[0] : 'Usuario',
          cedula: isEmail ? '—' : identifier,
          email:  isEmail ? identifier : '—',
          password: pass,
        };
      } else {
        // Si el usuario existe, actualizamos lo que coincide
        if (mode === 'email') AppState.user.email = identifier;
        else AppState.user.cedula = identifier;
        AppState.user.password = pass;
      }
      saveState();
      window.location.href = 'dashboard.html';
    }, 1400);
  });

  function showErr(msg) {
    if (!msg) { err.hidden = true; err.textContent = ''; return; }
    // Re-disparar animación
    err.hidden = false;
    err.textContent = msg;
    err.style.animation = 'none';
    void err.offsetWidth;
    err.style.animation = '';
  }
}

function isValidEmail(e) {
  // @ y dominio con TLD válido de 2+ letras
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(e);
}

/* ---------- REGISTRO ---------- */
function wireRegister() {
  const form = document.getElementById('registerForm');
  const err  = document.getElementById('regError');

  // Cédula: solo números
  const cedNums = document.getElementById('regCedulaNum');
  cedNums.addEventListener('input', () => {
    cedNums.value = cedNums.value.replace(/\D/g, '').slice(0, 10);
  });

  // Mostrar/ocultar en AMBAS contraseñas
  wirePasswordToggle(
    document.getElementById('regPassToggle'),
    document.getElementById('regPass')
  );
  wirePasswordToggle(
    document.getElementById('regPass2Toggle'),
    document.getElementById('regPass2')
  );

  // Contraseña: solo dígitos
  const p1 = document.getElementById('regPass');
  const p2 = document.getElementById('regPass2');
  [p1, p2].forEach(el => el.addEventListener('input', () => {
    el.value = el.value.replace(/\D/g, '');
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    show('');

    const name   = document.getElementById('regName').value.trim();
    const prefix = document.getElementById('regCedulaPrefix').value;
    const cednum = cedNums.value;
    const email  = document.getElementById('regEmail').value.trim();
    const v1     = p1.value;
    const v2     = p2.value;

    if (!name)                                return show('Ingresa tu nombre completo.');
    if (!/^\d{6,10}$/.test(cednum))           return show('La cédula debe tener entre 6 y 10 dígitos numéricos.');
    if (!isValidEmail(email))                 return show('Correo electrónico inválido. Verifica el "@" y el dominio.');
    if (!/^\d{6,}$/.test(v1))                 return show('La contraseña debe ser estrictamente numérica de 6 o más dígitos.');
    if (v1 !== v2)                            return show('Las contraseñas no coinciden.');

    AppState.user = { name, cedula: `${prefix}-${cednum}`, email, password: v1 };
    saveState();
    window.location.href = 'security.html';
  });

  function show(msg) {
    if (!msg) { err.hidden = true; err.textContent = ''; return; }
    err.hidden = false; err.textContent = msg;
    err.style.animation = 'none'; void err.offsetWidth; err.style.animation = '';
  }
}
