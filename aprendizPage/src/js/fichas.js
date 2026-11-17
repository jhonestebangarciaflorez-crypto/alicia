/**
 * Lógica para la vista de "Mi Ficha" del Aprendiz - ALICIA
 * Interacción con anuncios, talleres, descarga de guías y conexión con el Tutor IA.
 */

document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    // 1. Personalizar la ficha según el usuario activo
    if (usuarioActivo && usuarioActivo.ficha) {
        const tituloFicha = document.querySelector('.card h4.fw-bold');
        if (tituloFicha) {
            tituloFicha.textContent = `Ficha ${usuarioActivo.ficha}`;
        }
    }

    // 2. Eventos para botones "Tutor IA" en los talleres
    const botonesTutorIA = document.querySelectorAll('button:has(.bi-robot), button:contains("Tutor IA")');
    document.querySelectorAll('button').forEach(btn => {
        if (btn.innerText.includes('Tutor IA')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tarjetaTaller = btn.closest('.card');
                const nombreTaller = tarjetaTaller ? tarjetaTaller.querySelector('h6')?.innerText : 'este taller';
                alert(`🤖 Tutor IA ALICIA conectado:\n\n"Hola, estoy aquí para guiarte en ${nombreTaller}. ¿En qué línea de tu código sientes que necesitas una pista socrática?"`);
            });
        }

        // 3. Eventos para botones "PDF"
        if (btn.innerText.includes('PDF')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tarjetaTaller = btn.closest('.card');
                const nombreTaller = tarjetaTaller ? tarjetaTaller.querySelector('h6')?.innerText : 'Taller';
                alert(`📄 Descarga iniciada:\n\nSe está descargando la guía pedagógica de "${nombreTaller}".`);
            });
        }
    });
});
