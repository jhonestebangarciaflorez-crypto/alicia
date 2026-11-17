document.addEventListener('DOMContentLoaded', () => {
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuarioActivo) {
        alert("Debes iniciar sesión para acceder a esta sección.");
        window.location.href = '../mainPage/inicioSesion.html';
        return;
    }

    // Si el usuario registrado no tiene rol asignado o tiene 'usuario', convertirlo a 'aprendiz'
    if (!usuarioActivo.rol || usuarioActivo.rol === 'usuario') {
        usuarioActivo.rol = 'aprendiz';
        if (!usuarioActivo.ficha) usuarioActivo.ficha = 'PROG-2026-A';
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
    }

    const rolesPermitidos = ['aprendiz'];

    if (!rolesPermitidos.includes(usuarioActivo.rol)) {
        alert("Acceso denegado. No tienes los permisos necesarios para ver esta página.");

        switch (usuarioActivo.rol) {
            case 'admin':
                window.location.href = '../adminPage/admin.html';
                break;
            case 'instructor':
                window.location.href = '../instructorPage/instructor.html';
                break;
            default:
                window.location.href = '../mainPage/inicioSesion.html';
                break;
        }
    }
});


