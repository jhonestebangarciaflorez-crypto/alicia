/* LÓGICA DE PERFIL Y PERSISTENCIA DE DATOS (Con correo editable) */

document.addEventListener('DOMContentLoaded', () => {
    const camBtn = document.getElementById('camBtn');
    const avatarContainer = document.querySelector('.profile-avatar-wrap');
    const inputFullName = document.getElementById('fullName');
    const inputPhone = document.getElementById('phone');
    const inputEmail = document.getElementById('email'); 
    const cardProfileName = document.getElementById('cardProfileName');
    const cardProfileEmail = document.getElementById('cardProfileEmail');
    const sidebarUserName = document.querySelector('.sidebar-user-card .user-name');
    const sidebarAvatarImg = document.querySelector('.sidebar-user-card img');
    const personalForm = document.getElementById('personalForm');
    const passwordForm = document.getElementById('passwordForm');

    let fotoTemporal = null;

    // 1. OBTENER EL USUARIO ACTIVO ACTUAL
    let usuarioActual = JSON.parse(localStorage.getItem('usuarioActivo')) || 
                        JSON.parse(localStorage.getItem('user')) || 
                        JSON.parse(localStorage.getItem('perfilUsuario'));

    if (!usuarioActual) {
        const listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (listaUsuarios.length > 0) {
            usuarioActual = listaUsuarios[listaUsuarios.length - 1]; 
        } else {
            usuarioActual = { nombre: 'Estudiante', correo: 'usuario@correo.com', telefono: '' };
        }
    }

    // Guardar el correo original para saber a quién buscar/actualizar en el array de usuarios
    const correoOriginal = usuarioActual.correo || usuarioActual.email || '';

    // 2. CARGAR LOS DATOS EN LA VISTA DE PERFIL
    const nombreUsuario = usuarioActual.nombre || 'Estudiante';
    const correoUsuario = correoOriginal || 'usuario@correo.com';
    const telefonoUsuario = usuarioActual.telefono || usuarioActual.phone || '';

    if (inputFullName) inputFullName.value = nombreUsuario;
    if (cardProfileName) cardProfileName.textContent = nombreUsuario;
    if (sidebarUserName) sidebarUserName.textContent = nombreUsuario;

    if (inputEmail) inputEmail.value = correoUsuario;
    if (cardProfileEmail) cardProfileEmail.textContent = correoUsuario;

    if (inputPhone) inputPhone.value = telefonoUsuario;

    // Cargar foto si ya la tenía guardada
    const fotoGuardada = usuarioActual.foto;
    if (fotoGuardada) {
        fotoTemporal = fotoGuardada;
        const avatarImg = avatarContainer?.querySelector('img');
        if (avatarImg) avatarImg.src = fotoTemporal;
        if (sidebarAvatarImg) sidebarAvatarImg.src = fotoTemporal;
    }

    // 3. Manejo dinámico para subir y cambiar la foto de perfil
    if (camBtn && avatarContainer) {
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = 'image/*';
        inputFile.style.display = 'none';
        document.body.appendChild(inputFile);

        camBtn.addEventListener('click', () => inputFile.click());

        inputFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    fotoTemporal = event.target.result;
                    const avatarImg = avatarContainer.querySelector('img');
                    if (avatarImg) {
                        avatarImg.src = fotoTemporal;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. Sincronización en tiempo real del nombre con la tarjeta visual
    if (inputFullName && cardProfileName) {
        inputFullName.addEventListener('input', (e) => {
            cardProfileName.textContent = e.target.value.trim() || 'Estudiante';
        });
    }

    // Sincronización en tiempo real del correo con la tarjeta visual
    if (inputEmail && cardProfileEmail) {
        inputEmail.addEventListener('input', (e) => {
            cardProfileEmail.textContent = e.target.value.trim() || 'usuario@correo.com';
        });
    }

    // 5. Funcionalidad del botón "Guardar cambios"
    if (personalForm) {
        personalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreFinal = inputFullName.value.trim() || 'Estudiante';
            const correoFinal = inputEmail.value.trim() || 'usuario@correo.com';
            const telefonoFinal = inputPhone ? inputPhone.value.trim() : '';

            // Actualizamos los datos del usuario actual
            usuarioActual.nombre = nombreFinal;
            usuarioActual.correo = correoFinal;
            usuarioActual.telefono = telefonoFinal;
            usuarioActual.foto = fotoTemporal;

            // Guardar cambios en la sesión activa
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActual));
            localStorage.setItem('perfilUsuario', JSON.stringify(usuarioActual));

            // Actualizar o sincronizar dentro del array general de "usuarios"
            let listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            let encontrado = false;

            listaUsuarios = listaUsuarios.map(u => {
                if (u.correo === correoOriginal || u.correo === correoFinal) {
                    encontrado = true;
                    return { ...u, nombre: nombreFinal, correo: correoFinal, telefono: telefonoFinal, foto: fotoTemporal };
                }
                return u;
            });

            // Si por alguna razón no estaba en la lista, lo agregamos
            if (!encontrado) {
                listaUsuarios.push(usuarioActual);
            }

            localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

            // Reflejar cambios visuales inmediatos
            if (sidebarUserName) sidebarUserName.textContent = nombreFinal;
            if (cardProfileName) cardProfileName.textContent = nombreFinal;
            if (cardProfileEmail) cardProfileEmail.textContent = correoFinal;
            if (fotoTemporal && sidebarAvatarImg) sidebarAvatarImg.src = fotoTemporal;

            mostrarToast('¡Cambios guardados exitosamente!');
        });
    }

    // 6. Validación y cambio de contraseña
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPass = document.getElementById('newPass').value;
            const confirmPass = document.getElementById('confirmPass').value;

            if (newPass.length < 8) {
                mostrarToast('La nueva contraseña debe tener al menos 8 caracteres.');
                return;
            }
            if (newPass !== confirmPass) {
                mostrarToast('Las contraseñas no coinciden.');
                return;
            }

            usuarioActual.contrasena = newPass;
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActual));

            let listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            listaUsuarios = listaUsuarios.map(u => {
                if (u.correo === usuarioActual.correo) {
                    return { ...u, contrasena: newPass };
                }
                return u;
            });
            localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));

            passwordForm.reset();
            mostrarToast('¡Contraseña actualizada con éxito!');
        });
    }

    // Sistema de notificaciones flotantes tipo Toast
    function mostrarToast(mensaje) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = mensaje;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        } else {
            alert(mensaje);
        }
    }
});