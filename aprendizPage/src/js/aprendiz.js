/**
 * Lógica del portal del Aprendiz - ALICIA
 * Manejo de sesión, datos del usuario activo y utilidades del dashboard.
 */

// Función para cerrar la sesión activa
function cerrarSesion(rutaLogin = '../mainPage/inicioSesion.html') {
    localStorage.removeItem('usuarioActivo');
    alert('Sesión cerrada correctamente.');
    window.location.href = rutaLogin;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Asignar evento al botón de cierre de sesión
    const btnLogout = document.getElementById('logoutBtn');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }

    // 2. Cargar información del usuario activo en el sidebar y encabezados
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (usuarioActivo) {
        // Actualizar tarjeta del sidebar
        const spanNombre = document.querySelector('.sidebar-user-card .user-name');
        const spanRol = document.querySelector('.sidebar-user-card .user-role-sub');

        if (spanNombre) spanNombre.textContent = usuarioActivo.nombre || 'Aprendiz';
        if (spanRol) spanRol.textContent = 'Aprendiz';

        // Actualizar saludo o encabezado de bienvenida si existe
        const saludoDashboard = document.getElementById('saludoDashboard');
        if (saludoDashboard) {
            saludoDashboard.textContent = `¡Hola, ${usuarioActivo.nombre}!`;
        }
    }
});
