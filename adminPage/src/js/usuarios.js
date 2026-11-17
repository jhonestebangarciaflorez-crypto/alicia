/* 
@ Descripcion: Lógica para la gestión de usuarios: apertura/cierre del modal, 
creación de nuevos usuarios, renderizado dinámico de la tabla y soporte para foto personalizada o de rol.
*/

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. LÓGICA DEL MODAL DE CREAR USUARIO
    // ==========================================
    const btnAbrirModal = document.getElementById('btnAbrirModal');
    const modalNuevoUsuario = document.getElementById('modalNuevoUsuario');
    const cerrarModalBtn = document.getElementById('cerrarModalBtn');
    const cancelarModalBtn = document.getElementById('cancelarModalBtn');
    const formCrearUsuario = document.getElementById('formCrearUsuario');

    if (btnAbrirModal && modalNuevoUsuario) {
        btnAbrirModal.addEventListener('click', () => {
            modalNuevoUsuario.style.display = 'flex';
        });

        const cerrarModal = () => {
            modalNuevoUsuario.style.display = 'none';
            if (formCrearUsuario) formCrearUsuario.reset();
        };

        if (cerrarModalBtn) cerrarModalBtn.addEventListener('click', cerrarModal);
        if (cancelarModalBtn) cancelarModalBtn.addEventListener('click', cerrarModal);

        if (formCrearUsuario) {
            formCrearUsuario.addEventListener('submit', (e) => {
                e.preventDefault();

                const nombre = document.getElementById('nuevoNombre').value.trim();
                const correo = document.getElementById('nuevoEmail').value.trim();
                const contrasena = document.getElementById('nuevoPassword').value;
                const rol = document.getElementById('nuevoRol').value;
                const ficha = document.getElementById('nuevaFicha').value.trim() || 'PROG-2026-A';

                let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                const correoExiste = usuarios.some(u => u.correo === correo);
                if (correoExiste) {
                    alert('Ya existe un usuario registrado con este correo electrónico.');
                    return;
                }

                const nuevoUsuario = {
                    nombre: nombre,
                    correo: correo,
                    contrasena: contrasena,
                    rol: rol,
                    ficha: ficha,
                    estado: 'activo',
                    foto: '', // Campo preparado para cuando el usuario suba su foto personalizada
                    fechaRegistro: new Date().toISOString()
                };

                usuarios.push(nuevoUsuario);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                alert('¡Usuario creado exitosamente!');
                cerrarModal();
                
                location.reload();
            });
        }
    }

    // ==========================================
    // 2. FUNCIÓN AUXILIAR PARA OBTENER LA IMAGEN (PERSONALIZADA O DEFAULT POR ROL)
    // ==========================================
    function obtenerAvatarUsuario(user) {
        // Si el usuario subió una foto propia, la usamos
        if (user.foto && user.foto.trim() !== "") {
            return user.foto;
        }

        // Si no tiene foto propia, usamos el default personalizado según su rol
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

    // ==========================================
    // 3. RENDERIZADO DINÁMICO DE LA TABLA DESDE LOCALSTORAGE
    // ==========================================
    const tablaBody = document.getElementById('tablaUsuariosBody');
    const inputBusqueda = document.getElementById('inputBusqueda');
    const grupoFiltros = document.getElementById('grupoFiltros');

    let rolActual = 'todos'; 
    let textoBusqueda = '';  

    function cargarTablaUsuarios() {
        if (!tablaBody) return;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuariosFiltrados = usuarios.filter(user => {
            const nombre = user.nombre ? user.nombre.toLowerCase() : '';
            const correo = user.correo ? user.correo.toLowerCase() : '';
            const rolUser = user.rol ? user.rol.toLowerCase() : 'usuario';

            const coincideTexto = nombre.includes(textoBusqueda) || correo.includes(textoBusqueda);

            let coincideRol = false;
            if (rolActual === 'todos') {
                coincideRol = true;
            } else if (rolActual === 'estudiante' && (rolUser === 'aprendiz' || rolUser === 'estudiante')) {
                coincideRol = true;
            } else if (rolActual === 'profesor' && (rolUser === 'instructor' || rolUser === 'profesor')) {
                coincideRol = true;
            } else {
                coincideRol = (rolUser === rolActual);
            }

            return coincideTexto && coincideRol;
        });

        if (usuariosFiltrados.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No se encontraron usuarios coincidentes.</td></tr>`;
            return;
        }

        let htmlFilas = '';

        usuariosFiltrados.forEach((user) => {
            const indexOriginal = usuarios.findIndex(u => u.correo === user.correo);

            // Obtenemos la imagen correcta (su foto o el default por rol)
            const rutaImagen = obtenerAvatarUsuario(user);

            let fechaStr = 'Reciente';
            if (user.fechaRegistro) {
                const fechaObj = new Date(user.fechaRegistro);
                fechaStr = fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            }

            let rolFormateado = 'Usuario';
            let badgeBg = 'bg-secondary';
            let badgeText = 'text-secondary';

            switch (user.rol) {
                case 'admin':
                case 'administrador':
                    rolFormateado = 'Administrador';
                    badgeBg = 'bg-danger';
                    badgeText = 'text-danger';
                    break;
                case 'instructor':
                case 'profesor':
                    rolFormateado = 'Profesor';
                    badgeBg = 'bg-success';
                    badgeText = 'text-success';
                    break;
                case 'aprendiz':
                case 'estudiante':
                    rolFormateado = 'Estudiante';
                    badgeBg = 'bg-primary';
                    badgeText = 'text-primary';
                    break;
                default:
                    rolFormateado = 'Usuario';
                    badgeBg = 'bg-secondary';
                    badgeText = 'text-secondary';
                    break;
            }

            const fichaUser = user.ficha || 'PROG-2026-A';
            const estadoUser = user.estado || 'activo';

            htmlFilas += `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle overflow-hidden me-3 flex-shrink-0 d-flex align-items-center justify-content-center border" style="width: 40px; height: 40px; background-color: #f8f9fa;">
                                <img src="${rutaImagen}" alt="Avatar de ${user.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">${user.nombre}</h6>
                                <small class="text-muted">${user.correo}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge ${badgeBg} bg-opacity-10 ${badgeText} px-3 py-2 rounded-pill">${rolFormateado}</span>
                    </td>
                    <td class="fw-medium text-secondary">${fichaUser}</td>
                    <td>
                        <span class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">${estadoUser}</span>
                    </td>
                    <td class="text-secondary small">${fechaStr}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-light rounded-2 px-2 py-1 me-1 d-inline-flex align-items-center btn-editar" data-index="${indexOriginal}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7d8da1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button class="btn btn-sm btn-light rounded-2 px-2 py-1 d-inline-flex align-items-center btn-eliminar" data-index="${indexOriginal}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5c6c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
                        </button>
                    </td>
                </tr>
            `;
        });

        tablaBody.innerHTML = htmlFilas;
    }

    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            textoBusqueda = e.target.value.toLowerCase().trim();
            cargarTablaUsuarios();
        });
    }

    if (grupoFiltros) {
        grupoFiltros.addEventListener('click', (e) => {
            const btnFiltro = e.target.closest('.btn-filtro');
            if (btnFiltro) {
                const botones = grupoFiltros.querySelectorAll('.btn-filtro');
                botones.forEach(b => {
                    b.classList.remove('text-white');
                    b.classList.add('btn-light', 'text-secondary', 'border');
                    b.style.backgroundColor = '';
                });

                btnFiltro.classList.remove('btn-light', 'text-secondary', 'border');
                btnFiltro.classList.add('text-white');
                btnFiltro.style.backgroundColor = '#e91e63';

                rolActual = btnFiltro.getAttribute('data-rol');
                cargarTablaUsuarios();
            }
        });
    }

    cargarTablaUsuarios();
});

// ==========================================
// 4. LÓGICA PARA ELIMINAR USUARIO
// ==========================================
document.addEventListener('click', (e) => {
    const btnEliminar = e.target.closest('.btn-eliminar');
    if (btnEliminar) {
        const index = btnEliminar.getAttribute('data-index');
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioAEliminar = usuarios[index];

        if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${usuarioAEliminar.nombre}"?`)) {
            usuarios.splice(index, 1);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            alert('Usuario eliminado correctamente.');
            location.reload();
        }
    }
});

// ==========================================
// 5. LÓGICA DE EDICIÓN DE USUARIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const modalEditar = document.getElementById('modalEditarUsuario');
    const cerrarModalEditarBtn = document.getElementById('cerrarModalEditarBtn');
    const cancelarModalEditarBtn = document.getElementById('cancelarModalEditarBtn');
    const formEditarUsuario = document.getElementById('formEditarUsuario');

    const cerrarModalEditar = () => {
        if (modalEditar) modalEditar.style.display = 'none';
    };

    if (cerrarModalEditarBtn) cerrarModalEditarBtn.addEventListener('click', cerrarModalEditar);
    if (cancelarModalEditarBtn) cancelarModalEditarBtn.addEventListener('click', cerrarModalEditar);

    document.addEventListener('click', (e) => {
        const btnEditar = e.target.closest('.btn-editar');
        if (btnEditar && modalEditar) {
            const index = btnEditar.getAttribute('data-index');
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const user = usuarios[index];

            if (user) {
                document.getElementById('editIndex').value = index;
                document.getElementById('editNombre').value = user.nombre || '';
                document.getElementById('editEmail').value = user.correo || '';
                document.getElementById('editRol').value = user.rol || 'usuario';
                document.getElementById('editFicha').value = user.ficha || 'PROG-2026-A';
                document.getElementById('editEstado').value = user.estado || 'activo';

                modalEditar.style.display = 'flex';
            }
        }
    });

    if (formEditarUsuario) {
        formEditarUsuario.addEventListener('submit', (e) => {
            e.preventDefault();

            const index = document.getElementById('editIndex').value;
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            if (usuarios[index]) {
                usuarios[index].nombre = document.getElementById('editNombre').value.trim();
                usuarios[index].correo = document.getElementById('editEmail').value.trim();
                usuarios[index].rol = document.getElementById('editRol').value;
                usuarios[index].ficha = document.getElementById('editFicha').value.trim();
                usuarios[index].estado = document.getElementById('editEstado').value;

                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                alert('¡Usuario actualizado exitosamente!');
                cerrarModalEditar();
                location.reload();
            }
        });
    }
});