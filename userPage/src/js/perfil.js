/* LÓGICA DE PERFIL Y PERSISTENCIA DE DATOS */

document.addEventListener('DOMContentLoaded', () => {
    const camBtn = document.getElementById('camBtn');
    const avatarContainer = document.querySelector('.profile-avatar-wrap');
    const inputFullName = document.getElementById('fullName');
    const inputPhone = document.getElementById('phone');
    const cardProfileName = document.getElementById('cardProfileName');
    const sidebarUserName = document.querySelector('.sidebar-user-card .user-name');
    const sidebarAvatarImg = document.querySelector('.sidebar-user-card img');
    const personalForm = document.getElementById('personalForm');
    const passwordForm = document.getElementById('passwordForm');

    let fotoTemporal = null;

    // 1. Cargar datos almacenados previamente en localStorage al abrir la página
    const datosGuardados = JSON.parse(localStorage.getItem('perfilUsuario'));
    if (datosGuardados) {
        if (datosGuardados.nombre) {
            if (inputFullName) inputFullName.value = datosGuardados.nombre;
            if (cardProfileName) cardProfileName.textContent = datosGuardados.nombre;
            if (sidebarUserName) sidebarUserName.textContent = datosGuardados.nombre;
        }
        if (datosGuardados.telefono && inputPhone) {
            inputPhone.value = datosGuardados.telefono;
        }
        if (datosGuardados.foto) {
            fotoTemporal = datosGuardados.foto;
            const avatarImg = avatarContainer?.querySelector('img');
            if (avatarImg) avatarImg.src = fotoTemporal;
            if (sidebarAvatarImg) sidebarAvatarImg.src = fotoTemporal;
        }
    }

    // 2. Manejo dinámico para subir y cambiar la foto de perfil
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

    // 3. Sincronización en tiempo real del nombre con la tarjeta lateral
    if (inputFullName && cardProfileName) {
        inputFullName.addEventListener('input', (e) => {
            cardProfileName.textContent = e.target.value.trim() || 'Estudiante';
        });
    }

    // 4. Funcionalidad del botón "Guardar cambios"
    if (personalForm) {
        personalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreFinal = inputFullName.value.trim() || 'Estudiante';
            const telefonoFinal = inputPhone.value.trim();

            const perfilActualizado = {
                nombre: nombreFinal,
                telefono: telefonoFinal,
                foto: fotoTemporal
            };

            // Guardar permanentemente en navegador
            localStorage.setItem('perfilUsuario', JSON.stringify(perfilActualizado));

            // Reflejar cambios visuales inmediatos en el sidebar
            if (sidebarUserName) sidebarUserName.textContent = nombreFinal;
            if (fotoTemporal && sidebarAvatarImg) sidebarAvatarImg.src = fotoTemporal;

            mostrarToast('¡Cambios guardados exitosamente!');
        });
    }

    // 5. Validación y cambio de contraseña
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