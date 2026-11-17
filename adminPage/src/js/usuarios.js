

/* 
@ Descripcion: Lógica para la gestión de usuarios: apertura/cierre del modal, 
creación de nuevos usuarios y renderizado dinámico de la tabla desde el localStorage.
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
                    fechaRegistro: new Date().toISOString()
                };

                usuarios.push(nuevoUsuario);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                alert('¡Usuario creado exitosamente!');
                cerrarModal();
                
                // Recargar para actualizar la tabla
                location.reload();
            });
        }
    }

    // ==========================================
    // 2. RENDERIZADO DINÁMICO DE LA TABLA DESDE LOCALSTORAGE
    // ==========================================
    const tablaBody = document.getElementById('tablaUsuariosBody');

    if (tablaBody) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        if (usuarios.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No hay usuarios registrados.</td></tr>`;
            return;
        }

        let htmlFilas = '';

        usuarios.forEach((user, index) => {
            // Inicial para el avatar
            const inicial = user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U';

            // Formatear fecha
            let fechaStr = 'Reciente';
            if (user.fechaRegistro) {
                const fechaObj = new Date(user.fechaRegistro);
                fechaStr = fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            }

            // Normalizar y formatear nombres de roles y colores de badges
            let rolFormateado = 'Usuario';
            let badgeBg = 'bg-secondary';
            let badgeText = 'text-secondary';
            let avatarBg = 'bg-secondary';

            switch (user.rol) {
                case 'admin':
                    rolFormateado = 'Administrador';
                    badgeBg = 'bg-danger';
                    badgeText = 'text-danger';
                    avatarBg = 'bg-danger';
                    break;
                case 'instructor':
                case 'profesor':
                    rolFormateado = 'Profesor';
                    badgeBg = 'bg-success';
                    badgeText = 'text-success';
                    avatarBg = 'bg-success';
                    break;
                case 'aprendiz':
                case 'estudiante':
                    rolFormateado = 'Estudiante';
                    badgeBg = 'bg-primary';
                    badgeText = 'text-primary';
                    avatarBg = 'bg-primary';
                    break;
                default:
                    rolFormateado = 'Usuario';
                    badgeBg = 'bg-secondary';
                    badgeText = 'text-secondary';
                    avatarBg = 'bg-secondary';
                    break;
            }

            const fichaUser = user.ficha || 'PROG-2026-A';
            const estadoUser = user.estado || 'activo';

            htmlFilas += `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle text-white d-flex align-items-center justify-content-center me-3 fw-bold ${avatarBg}" style="width: 40px; height: 40px;">
                                ${inicial}
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
                        <!-- Botón de Editar -->
                        <button class="btn btn-sm btn-light rounded-2 px-2 py-1 me-1 d-inline-flex align-items-center btn-editar" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7d8da1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <!-- Botón de Eliminar / Desactivar -->
                        <button class="btn btn-sm btn-light rounded-2 px-2 py-1 d-inline-flex align-items-center btn-eliminar" data-index="${index}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5c6c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
                        </button>
                    </td>
                </tr>
            `;
        });

        tablaBody.innerHTML = htmlFilas;
    }
});



/* 
@ Descripcion: Lógica para eliminar un usuario del localStorage desde la tabla.
*/
document.addEventListener('click', (e) => {
    const btnEliminar = e.target.closest('.btn-eliminar');
    if (btnEliminar) {
        const index = btnEliminar.getAttribute('data-index');
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioAEliminar = usuarios[index];

        if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${usuarioAEliminar.nombre}"?`)) {
            // Eliminamos 1 elemento en la posición 'index'
            usuarios.splice(index, 1);
            
            // Actualizamos el localStorage
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            alert('Usuario eliminado correctamente.');
            location.reload(); // Recargamos para actualizar la tabla
        }
    }
});




/* 
@ Descripcion: Lógica actualizada para incluir el campo 'estado' al editar un usuario.
*/
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

    // 1. Escuchar clics en los botones de editar de la tabla
    document.addEventListener('click', (e) => {
        const btnEditar = e.target.closest('.btn-editar');
        if (btnEditar && modalEditar) {
            const index = btnEditar.getAttribute('data-index');
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const user = usuarios[index];

            if (user) {
                // Rellenar el formulario con los datos actuales del usuario (incluyendo el estado)
                document.getElementById('editIndex').value = index;
                document.getElementById('editNombre').value = user.nombre || '';
                document.getElementById('editEmail').value = user.correo || '';
                document.getElementById('editRol').value = user.rol || 'usuario';
                document.getElementById('editFicha').value = user.ficha || 'PROG-2026-A';
                document.getElementById('editEstado').value = user.estado || 'activo';

                // Mostrar el modal
                modalEditar.style.display = 'flex';
            }
        }
    });

    // 2. Guardar los cambios editados
    if (formEditarUsuario) {
        formEditarUsuario.addEventListener('submit', (e) => {
            e.preventDefault();

            const index = document.getElementById('editIndex').value;
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            if (usuarios[index]) {
                // Actualizar los datos, incluyendo el estado seleccionado en el modal
                usuarios[index].nombre = document.getElementById('editNombre').value.trim();
                usuarios[index].correo = document.getElementById('editEmail').value.trim();
                usuarios[index].rol = document.getElementById('editRol').value;
                usuarios[index].ficha = document.getElementById('editFicha').value.trim();
                usuarios[index].estado = document.getElementById('editEstado').value; // <--- NUEVO: Guarda el nuevo estado

                // Guardar de vuelta en el localStorage
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                alert('¡Usuario actualizado exitosamente!');
                cerrarModalEditar();
                location.reload(); // Recargar para ver los cambios reflejados en la tabla
            }
        });
    }
});






/* 
@ Descripcion: Lógica unificada para renderizar la tabla con filtros de rol y búsqueda en tiempo real.
*/

document.addEventListener('DOMContentLoaded', () => {
    // [Aquí se mantiene tu código anterior del modal de crear y editar...]

    // ----------------------------------------------------
    // RENDERIZADO Y FILTRADO DE LA TABLA
    // ----------------------------------------------------
    const tablaBody = document.getElementById('tablaUsuariosBody');
    const inputBusqueda = document.getElementById('inputBusqueda');
    const grupoFiltros = document.getElementById('grupoFiltros');

    let rolActual = 'todos'; // Rol seleccionado por defecto
    let textoBusqueda = '';  // Texto escrito por defecto

    // Función principal que pinta la tabla según los filtros actuales
    function cargarTablaUsuarios() {
        if (!tablaBody) return;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // 1. Filtrar la lista de usuarios
        const usuariosFiltrados = usuarios.filter(user => {
            const nombre = user.nombre ? user.nombre.toLowerCase() : '';
            const correo = user.correo ? user.correo.toLowerCase() : '';
            const rolUser = user.rol ? user.rol.toLowerCase() : 'usuario';

            // Validar coincidencia de texto (nombre o correo)
            const coincideTexto = nombre.includes(textoBusqueda) || correo.includes(textoBusqueda);

            // Validar coincidencia de rol
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

        // 2. Si no hay resultados
        if (usuariosFiltrados.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No se encontraron usuarios coincidentes.</td></tr>`;
            return;
        }

        // 3. Generar HTML de las filas filtradas
        let htmlFilas = '';

        usuariosFiltrados.forEach((user) => {
            // Buscamos el índice real del usuario en el array original (para que editar/eliminar no falle)
            const indexOriginal = usuarios.findIndex(u => u.correo === user.correo);

            const inicial = user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U';

            let fechaStr = 'Reciente';
            if (user.fechaRegistro) {
                const fechaObj = new Date(user.fechaRegistro);
                fechaStr = fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            }

            let rolFormateado = 'Usuario';
            let badgeBg = 'bg-secondary';
            let badgeText = 'text-secondary';
            let avatarBg = 'bg-secondary';

            switch (user.rol) {
                case 'admin':
                    rolFormateado = 'Administrador';
                    badgeBg = 'bg-danger';
                    badgeText = 'text-danger';
                    avatarBg = 'bg-danger';
                    break;
                case 'instructor':
                case 'profesor':
                    rolFormateado = 'Profesor';
                    badgeBg = 'bg-success';
                    badgeText = 'text-success';
                    avatarBg = 'bg-success';
                    break;
                case 'aprendiz':
                case 'estudiante':
                    rolFormateado = 'Estudiante';
                    badgeBg = 'bg-primary';
                    badgeText = 'text-primary';
                    avatarBg = 'bg-primary';
                    break;
                default:
                    rolFormateado = 'Usuario';
                    badgeBg = 'bg-secondary';
                    badgeText = 'text-secondary';
                    avatarBg = 'bg-secondary';
                    break;
            }

            const fichaUser = user.ficha || 'PROG-2026-A';
            const estadoUser = user.estado || 'activo';

            htmlFilas += `
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle text-white d-flex align-items-center justify-content-center me-3 fw-bold ${avatarBg}" style="width: 40px; height: 40px;">
                                ${inicial}
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

    // Evento para la barra de búsqueda en tiempo real
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            textoBusqueda = e.target.value.toLowerCase().trim();
            cargarTablaUsuarios();
        });
    }

    // Eventos para los botones de filtro por rol
    if (grupoFiltros) {
        grupoFiltros.addEventListener('click', (e) => {
            const btnFiltro = e.target.closest('.btn-filtro');
            if (btnFiltro) {
                // Cambiar estilos visuales de los botones
                const botones = grupoFiltros.querySelectorAll('.btn-filtro');
                botones.forEach(b => {
                    b.classList.remove('text-white');
                    b.classList.add('btn-light', 'text-secondary', 'border');
                    b.style.backgroundColor = '';
                });

                btnFiltro.classList.remove('btn-light', 'text-secondary', 'border');
                btnFiltro.classList.add('text-white');
                btnFiltro.style.backgroundColor = '#e91e63';

                // Obtener el rol seleccionado y recargar tabla
                rolActual = btnFiltro.getAttribute('data-rol');
                cargarTablaUsuarios();
            }
        });
    }

    // Cargar la tabla por defecto al iniciar la página
    cargarTablaUsuarios();
});

