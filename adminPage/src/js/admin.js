/* 
@ Descripcion: Lógica del panel de administración. Carga dinámica de datos 
desde el localStorage para el usuario activo, contadores, registros recientes e imágenes por rol o perfil.
*/

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // FUNCIÓN AUXILIAR PARA OBTENER LA IMAGEN
    // ==========================================
    function obtenerAvatarUsuario(user) {
        if (user.foto && user.foto.trim() !== "") {
            return user.foto;
        }

        const rolLower = (user.rol || "").toLowerCase().trim();

        switch (rolLower) {
            case 'admin':
            case 'administrador':
                return '../global_src/assets/img/admin.png';
            case 'instructor':
            case 'profesor':
                return '../global_src/assets/img/instructor.png';
            case 'aprendiz':
            case 'estudiante':
                return '../global_src/assets/img/aprendiz.png';
            default:
                return '../global_src/assets/img/user.png';
        }
    }

    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (usuarioActivo) {
        const spanNombre = document.querySelector('.sidebar-user-card .user-name');
        const spanRol = document.querySelector('.sidebar-user-card .user-role-sub');
        const imgAvatarSidebar = document.querySelector('.sidebar-user-card .avatar-circle img');

        if (spanNombre) spanNombre.textContent = usuarioActivo.nombre;
        if (spanRol) spanRol.textContent = usuarioActivo.rol.charAt(0).toUpperCase() + usuarioActivo.rol.slice(1);
        
        // Si el usuario activo también tiene su avatar personalizado o por rol en el sidebar
        if (imgAvatarSidebar) {
            imgAvatarSidebar.src = obtenerAvatarUsuario(usuarioActivo);
        }
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
            // Obtenemos la imagen correcta para los registros recientes
            const rutaImagen = obtenerAvatarUsuario(user);

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
            } else if (user.rol === 'admin' || user.rol === 'administrador') {
                estiloBadgeBg = '#fdf2f8';
                estiloBadgeText = 'text-danger';
            }

            htmlRegistros += `
                <div class="d-flex align-items-center justify-content-between pb-3 border-bottom">
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle overflow-hidden d-flex align-items-center justify-content-center border flex-shrink-0" style="width: 38px; height: 38px; background-color: #f8f9fa;">
                            <img src="${rutaImagen}" alt="Avatar de ${user.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
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

    const btnLogout = document.getElementById('logoutBtn');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('usuarioActivo');
            alert('Sesión cerrada correctamente.');
            window.location.href = '../mainPage/inicioSesion.html';
        });
    }
});


/* 
@ Descripcion: Cargar dinámicamente el número de fichas activas en el Dashboard del Administrador.
*/
document.addEventListener('DOMContentLoaded', () => {
    const cardFichasActivasAdmin = document.getElementById('contadorFichasAdmin');
    
    if (cardFichasActivasAdmin) {
        const fichas = JSON.parse(localStorage.getItem('fichas')) || [];
        const fichasActivasCount = fichas.filter(f => f.estado === 'activa').length;
        cardFichasActivasAdmin.textContent = fichasActivasCount;
    }
});