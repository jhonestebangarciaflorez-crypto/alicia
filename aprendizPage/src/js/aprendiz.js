/**
 * Cierra la sesión del usuario actual limpiando el localStorage,
 * mostrando una alerta y redirigiendo a la vista de inicio de sesión.
 * @param {string} [rutaLogin='../mainPage/inicioSesion.html'] - Ruta opcional hacia la página de login.
 */
function cerrarSesion(rutaLogin = '../index.html') {
    // Elimina el registro del usuario activo
    localStorage.removeItem('usuarioActivo');
    
    // Opcional: Mensaje de confirmación
    alert('Sesión cerrada correctamente.');
    
    // Redirige al usuario a la página de inicio de sesión
    window.location.href = rutaLogin;
}

// Opcional: Si prefieres asignarlo automáticamente buscando el botón por ID al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.getElementById('logoutBtn');
    
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault(); // Previene comportamientos por defecto si es un enlace <a>
            cerrarSesion();
        });
    }
});


/*
@ Descripcion: Lógica del panel de administración. Carga dinámica de datos 
desde el localStorage para el usuario activo, contador de usuarios y registros recientes.
*/

document.addEventListener('DOMContentLoaded', () => {

    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (usuarioActivo) {
        const spanNombre = document.querySelector('.sidebar-user-card .user-name');
        const spanRol = document.querySelector('.sidebar-user-card .user-role-sub');

        if (spanNombre) spanNombre.textContent = usuarioActivo.nombre;
        if (spanRol) spanRol.textContent = usuarioActivo.rol.charAt(0).toUpperCase() + usuarioActivo.rol.slice(1);
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];


    const cardUsuariosTotales = document.querySelector('.col-sm-6.col-xl-3:nth-child(1) h3');
    if (cardUsuariosTotales) {
        cardUsuariosTotales.textContent = usuarios.length;
    }

    const contenedorRegistros = document.querySelector('.col-lg-7 .card .d-flex.flex-column.gap-3');
    
    if (contenedorRegistros && usuarios.length > 0) {

        const ultimosUsuarios = [...usuarios].reverse().slice(0, 3);

        let htmlRegistros = '';

        ultimosUsuarios.forEach(user => {
            const inicial = user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U';
            

            let fechaStr = 'Reciente';
            if (user.fechaRegistro) {
                const fechaObj = new Date(user.fechaRegistro);
                fechaStr = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }


            let estiloBadgeBg = '#eef2ff';
            let estiloBadgeText = 'text-primary';
            let nombreRol = user.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : 'Usuario';

            if (user.rol === 'instructor' || user.rol === 'profesor') {
                estiloBadgeBg = '#eefcf4';
                estiloBadgeText = 'text-success';
            } else if (user.rol === 'admin') {
                estiloBadgeBg = '#fdf2f8';
                estiloBadgeText = 'text-danger';
            }

            htmlRegistros += `
                <div class="d-flex align-items-center justify-content-between pb-3 border-bottom">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style="width: 38px; height: 38px; font-size: 0.9rem;">
                            ${inicial}
                        </div>
                        <div>
                            <span class="d-block fw-semibold text-dark" style="font-size: 0.9rem;">${user.nombre}</span>
                            <small class="text-muted" style="font-size: 0.75rem;">${user.correo} · ${fechaStr}</small>
                        </div>
                    </div>
                    <span class="badge px-3 py-2 rounded-pill fw-normal ${estiloBadgeText}" style="font-size: 0.75rem; background-color: ${estiloBadgeBg};">${nombreRol}</span>
                </div>
            `;
        });

        contenedorRegistros.innerHTML = htmlRegistros;
    }
});




