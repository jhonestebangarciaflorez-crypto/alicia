/*
@ Autor: Jhon Esteban Garcia Florez
@ fecha: 06/09/2026
@ descripcion: validaciones para el formulario de registro y almacenamiento local
*/

async function validacionCampos(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmacion = document.getElementById("confirm-password").value;
    const terminos = document.getElementById("terms").checked;


    if (nombre === "" || email === "" || password === "" || confirmacion === "") {
        alert("Por favor, completa todos los campos obligatorios.");
        return false;
    }


    if (password !== confirmacion) {
        alert("Las contraseñas no coinciden. Revisa e intentalo de nuevo.");
        return false;
    }


    if (!terminos) {
        alert("Debes aceptar el tratamiento de datos personales (Ley 1581) para continuar.");
        return false;
    }


    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];


    const usuarioExistente = usuarios.some(user => user.correo === email);
    if (usuarioExistente) {
        alert("Este correo electrónico ya está registrado. Intenta iniciar sesión.");
        return false;
    }


    const nuevoUsuario = {
        nombre: nombre,
        correo: email,
        contrasena: password,
        fechaRegistro: new Date().toISOString()
    };


    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("¡Registro exitoso!");

    window.location.href = "inicioSesion.html"; 

    return false;
}





/*
@ Autor: Jhon Esteban Garcia Florez
@ fecha: 11/09/2026
@ descripcion: Crear un icono de ojo para mostrar la contraseña o ocultarla.
*/

document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.btn-toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);

        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = '<i data-lucide="eye-off"></i>';
            button.setAttribute('aria-label', 'Ocultar contraseña');
        } else {
            input.type = 'password';
            button.innerHTML = '<i data-lucide="eye"></i>';
            button.setAttribute('aria-label', 'Mostrar contraseña');
        }

        lucide.createIcons();
        });
    });
});










document.addEventListener('DOMContentLoaded', () => {

    const formRegistro = document.getElementById('registroForm');
    const inputUsuario = document.getElementById('usuario');
    const inputPassword = document.getElementById('password');
    const mensajeAlerta = document.getElementById('mensajeAlerta');


    formRegistro.addEventListener('submit', function (e) {
        e.preventDefault();
        

        const usuario = inputUsuario.value.trim();
        const password = inputPassword.value.trim();

        if (!usuario || !password) {
            mostrarMensaje('Por favor, completa todos los campos.', 'error');
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuarioExiste = usuarios.some(user => user.usuario === usuario);
        if (usuarioExiste) {
            mostrarMensaje('Este nombre de usuario ya está registrado. Prueba con otro.', 'error');
            return;
        }


        const nuevoUsuario = {
            nombre: nombre,
            correo: email,
            contrasena: password,
            rol: 'usuario',
            fechaRegistro: new Date().toISOString()
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));


        mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'exito');

        setTimeout(() => {
            window.location.href = '../inicioSesion.html'; 
        }, 1500);
    });

    function mostrarMensaje(texto, tipo) {
        if (!mensajeAlerta) return;
        mensajeAlerta.textContent = texto;
        mensajeAlerta.className = `alerta ${tipo}`; 
    }
});







