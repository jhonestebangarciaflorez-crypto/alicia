document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener los datos del localStorage usando las claves correctas
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Si no hay usuario activo, redirigir al login (por seguridad)
    if (!usuarioActivo) {
        window.location.href = "../index.html";
        return;
    }

    // Referencias a elementos del DOM
    const sidebarUserName = document.getElementById("sidebarUserName");
    const profileNameCard = document.getElementById("profileNameCard");
    const profileEmailCard = document.getElementById("profileEmailCard");
    const profileAvatarInitial = document.getElementById("profileAvatarInitial");
    const inputNombre = document.getElementById("inputNombre");
    const inputCorreo = document.getElementById("inputCorreo");
    const alertContainer = document.getElementById("alertContainer");

    // Formularios
    const formPersonalInfo = document.getElementById("formPersonalInfo");
    const formPassword = document.getElementById("formPassword");

    // 2. Cargar la información del usuario en la interfaz
    function cargarDatosPerfil() {
        const nombreMostrar = usuarioActivo.nombre || "Usuario";
        const correoMostrar = usuarioActivo.correo || "Sin correo";

        if (sidebarUserName) sidebarUserName.textContent = nombreMostrar;
        if (profileNameCard) profileNameCard.textContent = nombreMostrar;
        if (profileEmailCard) profileEmailCard.textContent = correoMostrar;
        
        if (inputNombre) inputNombre.value = nombreMostrar;
        if (inputCorreo) inputCorreo.value = correoMostrar;

        // Inicial en el avatar
        if (profileAvatarInitial) {
            profileAvatarInitial.textContent = nombreMostrar.charAt(0).toUpperCase();
        }
    }

    cargarDatosPerfil();

    // Función auxiliar para mostrar alertas en pantalla
    function mostrarAlerta(mensaje, tipo = "success") {
        alertContainer.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        setTimeout(() => {
            alertContainer.innerHTML = "";
        }, 4000);
    }

    // 3. Actualizar Información Personal (Nombre y Correo)
    if (formPersonalInfo) {
        formPersonalInfo.addEventListener("submit", (e) => {
            e.preventDefault();

            const nuevoNombre = inputNombre.value.trim();
            const nuevoCorreo = inputCorreo.value.trim();

            if (!nuevoNombre || !nuevoCorreo) {
                mostrarAlerta("Por favor, completa todos los campos de información personal.", "danger");
                return;
            }

            // Actualizar objeto usuarioActivo
            usuarioActivo.nombre = nuevoNombre;
            usuarioActivo.correo = nuevoCorreo;

            // Actualizar en el array general de 'usuarios' buscando por el correo original o ID
            usuarios = usuarios.map(u => {
                if (u.correo === usuarioActivo.correo || u.nombre === usuarioActivo.nombre) {
                    return { ...u, nombre: nuevoNombre, correo: nuevoCorreo };
                }
                return u;
            });

            // Guardar nuevamente en localStorage
            localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            cargarDatosPerfil();
            mostrarAlerta("¡Información personal actualizada correctamente!", "success");
        });
    }

    // 4. Actualizar Contraseña (Usando la propiedad 'contrasena')
    if (formPassword) {
    formPassword.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. Obtener valores actuales de los inputs
        const passwordActualInput = document.getElementById("inputPasswordActual").value;
        const passwordNuevaInput = document.getElementById("inputPasswordNueva").value;
        const passwordConfirmarInput = document.getElementById("inputPasswordConfirmar").value;

        // 2. Volver a leer siempre el localStorage fresco
        let usuariosActuales = JSON.parse(localStorage.getItem("usuarios")) || [];
        let usuarioSesion = JSON.parse(localStorage.getItem("usuarioActivo"));

        if (!usuarioSesion) {
            alert("No hay una sesión activa.");
            window.location.href = "../index.html";
            return;
        }

        // 3. Buscar al usuario en el arreglo general usando su correo como identificador único
        const indiceUsuario = usuariosActuales.findIndex(u => u.correo === usuarioSesion.correo);

        if (indiceUsuario === -1) {
            mostrarAlerta("Error: El usuario activo no existe en el registro general.", "danger");
            return;
        }

        // 4. Validar que la contraseña actual sea correcta (usando la propiedad 'contrasena')
        const contrasenaReal = usuariosActuales[indiceUsuario].contrasena;

        if (passwordActualInput !== contrasenaReal) {
            mostrarAlerta("La contraseña actual ingresada es incorrecta.", "danger");
            return;
        }

        // 5. Validar que las contraseñas nuevas coincidan
        if (passwordNuevaInput !== passwordConfirmarInput) {
            mostrarAlerta("Las nuevas contraseñas no coinciden.", "danger");
            return;
        }

        // 6. Validar que sea diferente a la actual
        if (passwordActualInput === passwordNuevaInput) {
            mostrarAlerta("La nueva contraseña debe ser diferente a la actual.", "warning");
            return;
        }

        // --- 7. ACTUALIZAR LOS DATOS (Paso clave) ---
        // Actualizamos en el arreglo global
        usuariosActuales[indiceUsuario].contrasena = passwordNuevaInput;

        // Actualizamos en la sesión activa
        usuarioSesion.contrasena = passwordNuevaInput;

        // 8. ESCRIBIR DE NUEVO EN EL LOCALSTORAGE CON JSON.stringify()
        localStorage.setItem("usuarios", JSON.stringify(usuariosActuales));
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioSesion));

        // Limpiar formulario y notificar éxito
        formPassword.reset();
        mostrarAlerta("¡Contraseña actualizada y guardada con éxito!", "success");
        
        console.log("LocalStorage actualizado correctamente:", JSON.parse(localStorage.getItem("usuarios")));
    });

    }
});
