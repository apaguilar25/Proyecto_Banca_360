/* ============================================================
   security.js — Preguntas de seguridad post-registro
   ============================================================ */

const SECURITY_QUESTIONS = [
  '¿Cuál es el nombre de tu primera mascota?',
  '¿En qué ciudad naciste?',
  '¿Cuál es el nombre de tu mejor amigo de la infancia?',
  '¿Cuál es tu comida favorita?',
  '¿Cuál es el nombre de tu primera escuela?',
];

document.addEventListener('DOMContentLoaded', () => {
  wireThemeButton(document.getElementById('toggleTheme'));

  // Obtiene referencias a los select de preguntas y los llena con las opciones del array
  const q1 = document.getElementById('q1');
  const q2 = document.getElementById('q2');
  SECURITY_QUESTIONS.forEach((q, i) => {
    q1.add(new Option(q, i));
    q2.add(new Option(q, i));
  });
  // Preselecciona las primeras dos preguntas para guiar al usuario
  // En la 1era selecciona la de index 0, y en la 2da la de index 1
  q2.selectedIndex = 1;

  document.getElementById('securityForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evita envío automático (recargar) para que haga las validaciones
    const err = document.getElementById('secError');
    err.hidden = true;

    const v1 = q1.value, v2 = q2.value;
    const a1 = document.getElementById('a1').value.trim();
    const a2 = document.getElementById('a2').value.trim();

    if (v1 === v2) return show('Elige dos preguntas distintas.');
    if (!a1 || !a2) return show('Responde ambas preguntas.');

    // Guarda las preguntas y respuestas en el estado de la App
    AppState.securityQuestions = [
      { q: SECURITY_QUESTIONS[v1], a: a1 },
      { q: SECURITY_QUESTIONS[v2], a: a2 },
    ];
    saveState();
    // Redirige a dashboard
    window.location.href = 'dashboard.html';

    function show(msg) {
      err.hidden = false; 
      err.textContent = msg;
      err.style.animation = 'none'; 
      void err.offsetWidth; 
      err.style.animation = '';
    }
  });
});
