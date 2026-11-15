/* 
@ Descripcion: Lógica para la gestión de fichas: apertura/celta de modal, 
guardado en localStorage, conteo de fichas activas y renderizado dinámico de tarjetas.
*/

document.addEventListener('DOMContentLoaded', () => {
    const btnAbrirModal = document.getElementById('btnAbrirModalFicha');
    const modalFicha = document.getElementById('modalNuevaFicha');
    const cerrarModalBtn = document.getElementById('cerrarModalFichaBtn');
    const cancelarModalBtn = document.getElementById('cancelarModalFichaBtn');
    const formCrearFicha = document.getElementById('formCrearFicha');
    const contenedorFichas = document.getElementById('contenedorFichas');
    const contadorFichasActivas = document.getElementById('contadorFichasActivas');

    // 1. Control del Modal
    if (btnAbrirModal && modalFicha) {
        btnAbrirModal.addEventListener('click', () => {
            modalFicha.style.display = 'flex';
        });

        const cerrarModal = () => {
            modalFicha.style.display = 'none';
            if (formCrearFicha) formCrearFicha.reset();
        };

        if (cerrarModalBtn) cerrarModalBtn.addEventListener('click', cerrarModal);
        if (cancelarModalBtn) cancelarModalBtn.addEventListener('click', cerrarModal);

        // 2. Guardar nueva ficha en el localStorage
        if (formCrearFicha) {
            formCrearFicha.addEventListener('submit', (e) => {
                e.preventDefault();

                const codigo = document.getElementById('codigoFicha').value.trim().toUpperCase();
                const programa = document.getElementById('nombrePrograma').value.trim();
                const profesor = document.getElementById('nombreProfesor').value.trim();
                const estado = document.getElementById('estadoFicha').value;

                let fichas = JSON.parse(localStorage.getItem('fichas')) || [];

                // Validar si la ficha ya existe
                const fichaExiste = fichas.some(f => f.codigo === codigo);
                if (fichaExiste) {
                    alert('Ya existe una ficha registrada con este código.');
                    return;
                }

                const nuevaFicha = {
                    codigo: codigo,
                    programa: programa,
                    profesor: profesor,
                    estado: estado,
                    estudiantes: Math.floor(Math.random() * 15) + 20, // Número simulado de estudiantes aleatorio
                    talleres: Math.floor(Math.random() * 5) + 3,      // Talleres simulados
                    promedio: (Math.random() * 1.5 + 3.5).toFixed(1)   // Promedio simulado (ej. 4.2)
                };

                fichas.push(nuevaFicha);
                localStorage.setItem('fichas', JSON.stringify(fichas));

                alert('¡Ficha registrada exitosamente!');
                cerrarModal();
                cargarFichas();
            });
        }
    }

    // 3. Función para renderizar fichas y actualizar el contador
    function cargarFichas() {
        if (!contenedorFichas) return;

        // Fichas por defecto iniciales si el localStorage está vacío
        let fichas = JSON.parse(localStorage.getItem('fichas'));
        if (!fichas || fichas.length === 0) {
            fichas = [
                { codigo: "PROG-2026-A", programa: "Análisis y Desarrollo de Software", profesor: "Prof. Ana Gómez", estado: "activa", estudiantes: 28, talleres: 6, promedio: "4.3" },
                { codigo: "PROG-2026-B", programa: "Análisis y Desarrollo de Software", profesor: "Prof. Luis Torres", estado: "activa", estudiantes: 30, talleres: 5, promedio: "4.1" },
                { codigo: "WEB-2026-A", programa: "Desarrollo Web Front End", profesor: "Prof. Andrea Ruiz", estado: "activa", estudiantes: 25, talleres: 7, promedio: "4.5" },
                { codigo: "DATA-2026-B", programa: "Análisis de Datos", profesor: "Prof. Marcos Silva", estado: "cerrada", estudiantes: 22, talleres: 4, promedio: "3.9" }
            ];
            localStorage.setItem('fichas', JSON.stringify(fichas));
        }

        // Calcular fichas activas
        const activas = fichas.filter(f => f.estado === 'activa').length;
        if (contadorFichasActivas) {
            contadorFichasActivas.textContent = `${activas} fichas activas`;
        }

        let htmlTarjetas = '';

        fichas.forEach((ficha, index) => {
            const esActiva = ficha.estado === 'activa';
            const badgeClass = esActiva ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary';

            htmlTarjetas += `
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm rounded-4 p-4">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <h5 class="fw-bold mb-0">${ficha.codigo}</h5>
                                    <span class="badge ${badgeClass} px-2 py-1 rounded-pill small">${ficha.estado}</span>
                                </div>
                                <p class="text-secondary small mb-1">${ficha.programa}</p>
                                <p class="text-muted small mb-0">${ficha.profesor}</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light text-secondary border-0 p-1 rounded-2 btn-editar-ficha" data-index="${index}" title="Editar ficha">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7d8da1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button class="btn btn-sm btn-light text-danger border-0 p-1 rounded-2 btn-eliminar-ficha" data-index="${index}" title="Eliminar ficha">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#FF4D4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M9 3h6v2H9z"/>
                                        <path d="M3 6h18"/>
                                        <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/>
                                        <line x1="10" y1="11" x2="10" y2="17"/>
                                        <line x1="14" y1="11" x2="14" y2="17"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <hr class="text-muted opacity-25 my-3">
                        <div class="row text-center">
                            <div class="col-4">
                                <h4 class="fw-bold mb-0 text-dark">${ficha.estudiantes}</h4>
                                <small class="text-muted">Estudiantes</small>
                            </div>
                            <div class="col-4">
                                <h4 class="fw-bold mb-0 text-dark">${ficha.talleres}</h4>
                                <small class="text-muted">Talleres</small>
                            </div>
                            <div class="col-4">
                                <h4 class="fw-bold mb-0" style="color: #6366f1;">${ficha.promedio}</h4>
                                <small class="text-muted">Promedio</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        contenedorFichas.innerHTML = htmlTarjetas;
    }

    // 4. Eliminar ficha
    document.addEventListener('click', (e) => {
        const btnEliminar = e.target.closest('.btn-eliminar-ficha');
        if (btnEliminar) {
            const index = btnEliminar.getAttribute('data-index');
            let fichas = JSON.parse(localStorage.getItem('fichas')) || [];

            if (confirm(`¿Deseas eliminar la ficha ${fichas[index].codigo}?`)) {
                fichas.splice(index, 1);
                localStorage.setItem('fichas', JSON.stringify(fichas));
                cargarFichas();
            }
        }
    });

    // Cargar fichas al iniciar
    cargarFichas();
});




/* 
@ Descripcion: Lógica para abrir el modal de edición de fichas, 
rellenarlo con los datos actuales y actualizar el localStorage.
*/
document.addEventListener('DOMContentLoaded', () => {
    const modalEditarFicha = document.getElementById('modalEditarFicha');
    const cerrarModalEditarFichaBtn = document.getElementById('cerrarModalEditarFichaBtn');
    const cancelarModalEditarFichaBtn = document.getElementById('cancelarModalEditarFichaBtn');
    const formEditarFicha = document.getElementById('formEditarFicha');

    const cerrarModalEditar = () => {
        if (modalEditarFicha) modalEditarFicha.style.display = 'none';
    };

    if (cerrarModalEditarFichaBtn) cerrarModalEditarFichaBtn.addEventListener('click', cerrarModalEditar);
    if (cancelarModalEditarFichaBtn) cancelarModalEditarFichaBtn.addEventListener('click', cerrarModalEditar);

    // 1. Escuchar clics en los botones de editar de las tarjetas de fichas
    document.addEventListener('click', (e) => {
        const btnEditar = e.target.closest('.btn-editar-ficha');
        if (btnEditar && modalEditarFicha) {
            const index = btnEditar.getAttribute('data-index');
            const fichas = JSON.parse(localStorage.getItem('fichas')) || [];
            const ficha = fichas[index];

            if (ficha) {
                // Rellenar el formulario con los datos actuales
                document.getElementById('editIndexFicha').value = index;
                document.getElementById('editCodigoFicha').value = ficha.codigo || '';
                document.getElementById('editNombrePrograma').value = ficha.programa || '';
                document.getElementById('editNombreProfesor').value = ficha.profesor || '';
                document.getElementById('editEstadoFicha').value = ficha.estado || 'activa';

                // Mostrar el modal
                modalEditarFicha.style.display = 'flex';
            }
        }
    });

    // 2. Guardar los cambios editados en el localStorage
    if (formEditarFicha) {
        formEditarFicha.addEventListener('submit', (e) => {
            e.preventDefault();

            const index = document.getElementById('editIndexFicha').value;
            let fichas = JSON.parse(localStorage.getItem('fichas')) || [];

            if (fichas[index]) {
                fichas[index].codigo = document.getElementById('editCodigoFicha').value.trim().toUpperCase();
                fichas[index].programa = document.getElementById('editNombrePrograma').value.trim();
                fichas[index].profesor = document.getElementById('editNombreProfesor').value.trim();
                fichas[index].estado = document.getElementById('editEstadoFicha').value;

                // Actualizar localStorage
                localStorage.setItem('fichas', JSON.stringify(fichas));

                alert('¡Ficha actualizada exitosamente!');
                cerrarModalEditar();
                location.reload(); // Recargar para actualizar tarjetas y contadores
            }
        });
    }
});

