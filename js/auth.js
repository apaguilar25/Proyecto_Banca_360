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

  // Elementos principales del formulario
  // Lo guarda para manejarlo en vivo
  const form = document.getElementById('loginForm');
  const err  = document.getElementById('loginError');
  const btn  = document.getElementById('loginBtn');

  // Tabs Correo / Cédula
  const tabEmail  = document.getElementById('tabEmail'); // Tab selección
  const tabCedula = document.getElementById('tabCedula');
  const blockEmail  = document.getElementById('blockEmail'); //Bloques de input
  const blockCedula = document.getElementById('blockCedula');

  // Predeterminado a correo 
  let mode = 'email';
  const setMode = (m) => {
    mode = m;
    tabEmail.classList.toggle('active', m === 'email');
    tabCedula.classList.toggle('active', m === 'cedula');
    blockEmail.hidden  = m !== 'email';
    blockCedula.hidden = m !== 'cedula';
  };
  // Listeners de tabs
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

  // Validaciones al enviar el formulario
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

    // SPINNER: Simulación autenticación
    btn.disabled = true; // Deshabilitar botón para evitar múltiples clicks
    btn.innerHTML = '<span class="ios-spinner"></span>'; // Cambiar texto a spinner

    setTimeout(() => { // Acá crea el usuario esperando que llegue como null
        // Crea usuario con la información real ingresada
        const isEmail = mode === 'email';
        AppState.user = {
          name: isEmail ? identifier.split('@')[0] : 'Usuario',
          cedula: isEmail ? '—' : identifier,
          email:  isEmail ? identifier : '—',
          password: pass,
        };
      saveState();
      window.location.href = 'dashboard.html';
    }, 2000);  // Dura 2 segundos para simular proceso de autenticación
  });

  function showErr(msg) {
    if (!msg) { err.hidden = true; err.textContent = ''; return; }
    // Re-disparar animación
    err.hidden = false;
    err.textContent = msg;
    err.style.animation = 'none'; // Desactiva la animación que haya en el momento
    void err.offsetWidth; // Forzar reflow para reiniciar la animación
    err.style.animation = ''; // Ejecuta la animación desde el inicio
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

  form.addEventListener('submit', (e) => {
    // Evita que el formulario se envíe y recargue la página
    e.preventDefault();
    // Elimina cualquier mensaje de error previo
    show('');

    const name   = document.getElementById('regName').value.trim();
    const prefix = document.getElementById('regCedulaPrefix').value;
    const cednum = cedNums.value;
    const email  = document.getElementById('regEmail').value.trim();
    const v1     = document.getElementById('regPass').value;
    const v2     = document.getElementById('regPass2').value;

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
    err.hidden = false; 
    err.textContent = msg;
    err.style.animation = 'none'; 
    void err.offsetWidth; 
    err.style.animation = '';
  }
}
