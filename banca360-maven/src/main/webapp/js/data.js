/* ============================================================
   data.js — Estado global persistido en localStorage
   ============================================================ */

const STORAGE_KEY = 'banca360_state';

const DEFAULT_STATE = {
  user: null,
  balance: 2130,
  transactions: [
    { id: 'TXN-001', type: 'received', category: 'transfer',      desc: 'Transferencia Recibida de Juan Pérez', date: '2025-05-14 10:32', amount: 250.00,  from: 'Juan Pérez',     concept: 'Pago factura' },
    { id: 'TXN-002', type: 'sent',     category: 'mobilePayment', desc: 'Pago Móvil a María González',          date: '2025-05-13 18:05', amount: 80.50,   to: 'María González',   concept: 'Cena' },
    { id: 'TXN-003', type: 'received', category: 'deposit',       desc: 'Depósito en oficina',                  date: '2025-05-12 09:15', amount: 1000.00, from: 'Banca 360',      concept: 'Depósito en efectivo' },
    { id: 'TXN-004', type: 'sent',     category: 'transfer',      desc: 'Transferencia a Carlos Rodríguez',     date: '2025-05-10 14:20', amount: 320.00,  to: 'Carlos Rodríguez', concept: 'Alquiler' },
    { id: 'TXN-005', type: 'received', category: 'transfer',      desc: 'Transferencia Recibida de Ana López',  date: '2025-05-08 11:40', amount: 150.00,  from: 'Ana López',      concept: 'Devolución' },
  ],
  theme: 'light',
  securityQuestions: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_STATE, ...parsed };
    // Asegura categoría en transacciones antiguas
    merged.transactions = (merged.transactions || []).map(t => ({
      ...t,
      category: t.category || inferCategory(t),
    }));
    return merged;
  } catch (_) {
    return { ...DEFAULT_STATE };
  }
}
function inferCategory(t) {
  const d = (t.desc || '').toLowerCase();
  if (d.includes('pago móvil') || d.includes('pago movil')) return 'mobilePayment';
  if (d.includes('depósito') || d.includes('deposito'))     return 'deposit';
  return 'transfer';
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
}

const AppState = loadState();

if (!localStorage.getItem(STORAGE_KEY) &&
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  AppState.theme = 'dark';
  saveState();
}

function formatMoney(n) {
  return '$' + Number(n).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function addTransaction(tx) {
  tx.id = 'TXN-' + String(AppState.transactions.length + 1).padStart(3, '0');
  tx.date = new Date().toISOString().slice(0, 16).replace('T', ' ');
  if (!tx.category) tx.category = inferCategory(tx);
  AppState.transactions.unshift(tx);
  saveState();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
}

function requireAuth() {
  if (!AppState.user) {
    window.location.href = 'login.html';
  }
}

function paintBalance() {
  document.querySelectorAll('[data-balance]').forEach(el => {
    el.textContent = formatMoney(AppState.balance);
  });
}

/* Botón compartido de Modo claro/oscuro (login/logout/app) */
function wireThemeButton(btn) {
  if (!btn) return;
  const setIcon = () => {
    const i = btn.querySelector('i');
    if (i) i.className = 'ph ' + (AppState.theme === 'dark' ? 'ph-sun' : 'ph-moon');
  };
  setIcon();
  btn.addEventListener('click', () => {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    saveState();
    applyTheme();
    setIcon();
  });
}

/* Botón para mostrar/ocultar contraseña */
function wirePasswordToggle(toggleBtn, inputEl) {
  if (!toggleBtn || !inputEl) return;
  toggleBtn.addEventListener('click', () => {
    const showing = inputEl.type === 'text';
    inputEl.type = showing ? 'password' : 'text';
    const i = toggleBtn.querySelector('i');
    if (i) i.className = 'ph ' + (showing ? 'ph-eye' : 'ph-eye-slash');
  });
}
