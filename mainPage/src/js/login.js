/* 
@ Autor: Jhon Esteban Garcia Florez
@ Descripcion: visibilidad de contraseña y lógica de autenticación conectada al localStorage.
*/

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const toggleButtons = document.querySelectorAll('.btn-toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const input = document.getElementById(targetId);

            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    button.innerHTML = '<i data-lucide="eye-off"></i>';
                    button.setAttribute('aria-label', 'Ocultar contraseña');
                } else {
                    input.type = 'password';
                    button.innerHTML = '<i data-lucide="eye"></i>';
                    button.setAttribute('aria-label', 'Mostrar contraseña');
                }

                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    });





    /* 
    @ Descripcion: Función flecha autoejecutable para asegurar 
    que el Admin Raíz siempre exista.
    */
    const inicializarAdminRaiz = () => {

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const correoAdmin = "admin@sena.edu.co";

        const adminExiste = usuarios.some(user => user.correo === correoAdmin);


        if (!adminExiste) {
            const adminRaiz = {
                nombre: "Administrador Master",
                correo: correoAdmin,
                contrasena: "admin123",
                rol: "admin",
                fechaRegistro: new Date().toISOString()
            };

            usuarios.push(adminRaiz);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            console.log("Administrador raíz inyectado correctamente en el localStorage.");
        }
    };

    inicializarAdminRaiz();





    /* 
    @ Descripcion: Función flecha para asegurar 
    que el instructor Raíz siempre exista.
    */
    const inicializarInstructorRaiz = () => {

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const correoInstructor = "instructor@sena.edu.co";

        const InstructorExiste = usuarios.some(user => user.correo === correoInstructor);


        if (!InstructorExiste) {
            const instructorRaiz = {
                nombre: "Instructor Master",
                correo: correoInstructor,
                contrasena: "instructor123",
                rol: "instructor",
                fechaRegistro: new Date().toISOString()
            };

            usuarios.push(instructorRaiz);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            console.log("Instructor raíz inyectado correctamente en el localStorage.");
        }
    };

    inicializarInstructorRaiz();


    /* 
    @ Descripcion: Función flecha para asegurar 
    que el aprendiz Raíz siempre exista.
    */
    const inicializarAprendizRaiz = () => {

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const correoAprendiz = "aprendiz@sena.edu.co";

        const indice = usuarios.findIndex(user => user.correo === correoAprendiz);

        const aprendizRaiz = {
            nombre: "Aprendiz Sena",
            correo: correoAprendiz,
            contrasena: "aprendiz123",
            rol: "aprendiz",
            ficha: "PROG-2026-A",
            fechaRegistro: new Date().toISOString()
        };

            if (indice === -1) {
                usuarios.push(aprendizRaiz);
                console.log("Aprendiz raíz inyectado correctamente en el localStorage.");
            } else {
                usuarios[indice].rol = "aprendiz";
                if (!usuarios[indice].ficha) usuarios[indice].ficha = "PROG-2026-A";
            }
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        };

        inicializarAprendizRaiz();







        const formLogin = document.getElementById('formLogin');

        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;

                if (!email || !password) {
                    alert('Por favor, completa todos los campos.');
                    return;
                }

                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                const usuarioEncontrado = usuarios.find(user => user.correo === email && user.contrasena === password);

                if (usuarioEncontrado) {
                    // Si el usuario no tiene rol o tiene 'usuario', asignarle 'aprendiz'
                    if (!usuarioEncontrado.rol || usuarioEncontrado.rol === 'usuario') {
                        usuarioEncontrado.rol = 'aprendiz';
                        if (!usuarioEncontrado.ficha) usuarioEncontrado.ficha = 'PROG-2026-A';

                        const idx = usuarios.findIndex(u => u.correo === usuarioEncontrado.correo);
                        if (idx !== -1) {
                            usuarios[idx].rol = 'aprendiz';
                            usuarios[idx].ficha = 'PROG-2026-A';
                            localStorage.setItem('usuarios', JSON.stringify(usuarios));
                        }
                    }

                    // Guardamos la sesión activa
                    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));

                    alert(`¡Bienvenido/a, ${usuarioEncontrado.nombre}!`);


                    switch (usuarioEncontrado.rol) {
                        case 'admin':
                            window.location.href = '../adminPage/admin.html';
                            break;
                        case 'instructor':
                            window.location.href = '../instructorPage/instructor.html';
                            break;
                        case 'aprendiz':
                        default:
                            window.location.href = '../aprendizPage/aprendiz.html';
                            break;
                    }
                } else {
                    alert('Correo o contraseña incorrectos.');
                }
            });
        }
    });





