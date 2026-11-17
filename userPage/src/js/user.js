document.addEventListener('DOMContentLoaded', () => {
    let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (usuarioActivo) {
        if (!usuarioActivo.rol || usuarioActivo.rol === 'usuario') {
            usuarioActivo.rol = 'aprendiz';
            if (!usuarioActivo.ficha) usuarioActivo.ficha = 'PROG-2026-A';
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
        }

                // Redirigir al panel del aprendiz
                window.location.href = '../aprendizPage/aprendiz.html';
                return;
            }

    // Si no hay sesión iniciada, enviar al login
    window.location.href = '../mainPage/inicioSesion.html';
});
