/* GUARDIA DE SESIÓN Y CIERRE DE SESIÓN */

function verificarSesion() {
    const sesionActiva = localStorage.getItem('usuarioActivo');
    // Si no hay sesión, expulsa al index general impidiendo bucles con history.replace
    if (!sesionActiva && !window.location.href.includes('index.html')) {
        window.location.replace('../index.html');
    }
}

verificarSesion();

// Evita que al dar "Atrás" el navegador restaure la vista protegida desde la caché
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        verificarSesion();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('usuarioActivo');
            window.location.replace('../index.html');
        });
    }
});