document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuarioActivo) {
        alert("Debes iniciar sesión para acceder a esta sección.");
        window.location.href = '../mainPage/inicioSesion.html';
        return;
    }

    const rolesPermitidos = ['instructor'];


    if (!rolesPermitidos.includes(usuarioActivo.rol)) {
        alert("Acceso denegado. No tienes los permisos necesarios para ver esta página.");
        
        switch (usuarioActivo.rol) {
            case 'admin':
                window.location.href = '../adminPage/admin.html';
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



