document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!usuarioActivo) {
        return;
    }

    const sidebarUserName = document.querySelector(".sidebar-user-card .user-name");
    const profileNameCard = document.getElementById("profileNameCard");
    const profileEmailCard = document.getElementById("profileEmailCard");
    const profileAvatarInitial = document.getElementById("profileAvatarInitial");
    const inputNombre = document.getElementById("inputNombre");
    const inputCorreo = document.getElementById("inputCorreo");
    const alertContainer = document.getElementById("alertContainer");

    const formPersonalInfo = document.getElementById("formPersonalInfo");
    const formPassword = document.getElementById("formPassword");

    function cargarDatosPerfil() {
        const nombreMostrar = usuarioActivo.nombre || "Aprendiz";
        const correoMostrar = usuarioActivo.correo || "aprendiz@sena.edu.co";

        if (sidebarUserName) sidebarUserName.textContent = nombreMostrar;
        if (profileNameCard) profileNameCard.textContent = nombreMostrar;
        if (profileEmailCard) profileEmailCard.textContent = correoMostrar;
        
        if (inputNombre) inputNombre.value = nombreMostrar;
        if (inputCorreo) inputCorreo.value = correoMostrar;

        if (profileAvatarInitial) {
            profileAvatarInitial.textContent = nombreMostrar.charAt(0).toUpperCase();
        }
    }

    cargarDatosPerfil();

    function mostrarAlerta(mensaje, tipo = "success") {
        if (!alertContainer) {
            alert(mensaje);
            return;
        }
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        setTimeout(() => {
            if (alertContainer) alertContainer.innerHTML = "";
        }, 4000);
    }

    if (formPersonalInfo) {
        formPersonalInfo.addEventListener("submit", (e) => {
            e.preventDefault();
            const nuevoNombre = inputNombre.value.trim();
            const nuevoCorreo = inputCorreo.value.trim();

            if (!nuevoNombre || !nuevoCorreo) {
                mostrarAlerta("Por favor completa todos los campos requeridos.", "danger");
                return;
            }

            const correoEnUso = usuarios.some(u => u.correo === nuevoCorreo && u.correo !== usuarioActivo.correo);
            if (correoEnUso) {
                mostrarAlerta("Este correo electrónico ya está registrado por otro usuario.", "warning");
                return;
            }

            const indice = usuarios.findIndex(u => u.correo === usuarioActivo.correo);
            if (indice !== -1) {
                usuarios[indice].nombre = nuevoNombre;
                usuarios[indice].correo = nuevoCorreo;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
            }

            usuarioActivo.nombre = nuevoNombre;
            usuarioActivo.correo = nuevoCorreo;
            localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));

            cargarDatosPerfil();
            mostrarAlerta("¡Tu información personal ha sido actualizada con éxito!", "success");
        });
    }

    if (formPassword) {
        formPassword.addEventListener("submit", (e) => {
            e.preventDefault();
            const passActual = document.getElementById("passwordActual")?.value;
            const passNueva = document.getElementById("passwordNueva")?.value;
            const passConfirm = document.getElementById("passwordConfirm")?.value;

            if (usuarioActivo.contrasena && passActual !== usuarioActivo.contrasena) {
                mostrarAlerta("La contraseña actual ingresada es incorrecta.", "danger");
                return;
            }

            if (!passNueva || passNueva.length < 4) {
                mostrarAlerta("La nueva contraseña debe tener al menos 4 caracteres.", "warning");
                return;
            }

            if (passNueva !== passConfirm) {
                mostrarAlerta("Las nuevas contraseñas no coinciden entre sí.", "warning");
                return;
            }

            const indice = usuarios.findIndex(u => u.correo === usuarioActivo.correo);
            if (indice !== -1) {
                usuarios[indice].contrasena = passNueva;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
            }

            usuarioActivo.contrasena = passNueva;
            localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));

            formPassword.reset();
            mostrarAlerta("¡Contraseña actualizada exitosamente!", "success");
        });
    }
});
