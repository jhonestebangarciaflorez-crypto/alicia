/* 
@ Descripcion: Script de protección de rutas por rol. 
Coloca este script en las páginas que requieren un rol específico.
*/

document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuarioActivo) {
        alert("Debes iniciar sesión para acceder a esta sección.");
        window.location.href = '../mainPage/inicioSesion.html'; // Redirige al login general
        return;
    }

    // 2. Definimos qué roles tienen permitido ver *esta* página en específico
    // (Esta variable 'rolesPermitidos' la cambias según la página donde pongas el script)
    const rolesPermitidos = ['admin']; // Por ejemplo, si esta página es exclusiva de Admin

    // 3. Validamos si el rol del usuario está dentro de los permitidos
    if (!rolesPermitidos.includes(usuarioActivo.rol)) {
        alert("Acceso denegado. No tienes los permisos necesarios para ver esta página.");
        
        // Lo redirigimos de regreso a su propio panel según su rol real
        switch (usuarioActivo.rol) {
            case 'instructor':
                window.location.href = '../instructorPage/instructor.html';
                break;
            case 'aprendiz':
                window.location.href = '../aprendizPage/aprendiz.html';
                break;
            default:
                window.location.href = '../userPage/user.html';
                break;
        }
    }
});