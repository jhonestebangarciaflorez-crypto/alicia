/* 
@ Descripción: Lógica del catálogo para el usuario común: lectura de localStorage, 
filtrado simultáneo por búsqueda de texto, tecnología y nivel, y apertura del panel de lectura.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Referencias de Contenedores y Búsqueda
    const contenedorCatalogo = document.getElementById('contenedorCatalogoTemas');
    const contadorTemas = document.getElementById('contadorTemasPublicados');
    const inputBusqueda = document.getElementById('inputBusquedaTema');
    const globalSearchInput = document.getElementById('globalSearchInput'); // <-- Referencia a la barra del header
    const grupoFiltrosTecnologia = document.getElementById('grupoFiltrosTecnologia');
    const grupoFiltrosNivel = document.getElementById('grupoFiltrosNivel');

    // Variables de Estado para Filtrado
    let textoBusqueda = '';
    let tecnologiaActual = 'todos';
    let nivelActual = 'todos';

    // Función principal de renderizado y filtrado unificado
    function cargarCatalogo() {
        if (!contenedorCatalogo) return;

        let temas = JSON.parse(localStorage.getItem('temas'));
        if (!temas || temas.length === 0) {
            temas = [
                { titulo: "Variables y Tipos de Datos", tecnologia: "Java", nivel: "Principiante", descripcion: "Declaración, tipos primitivos y conversión en Java.", archivo: null },
                { titulo: "Estructuras de Control", tecnologia: "Java", nivel: "Principiante", descripcion: "if/else, switch, bucles for, while y do-while.", archivo: null },
                { titulo: "Arreglos y Cadenas", tecnologia: "Java", nivel: "Principiante", descripcion: "Manejo de arrays unidimensionales y la clase String.", archivo: null },
                { titulo: "POO en Java", tecnologia: "Java", nivel: "Intermedio", descripcion: "Clases, herencia, polimorfismo e interfaces.", archivo: null },
                { titulo: "HTML Semántico", tecnologia: "HTML/CSS", nivel: "Principiante", descripcion: "Estructura semántica, etiquetas y accesibilidad.", archivo: null },
                { titulo: "Consultas SELECT", tecnologia: "SQL", nivel: "Principiante", descripcion: "Recuperación de datos con filtros y ordenamiento.", archivo: null }
            ];
            localStorage.setItem('temas', JSON.stringify(temas));
        }

        // Actualizar contador de temas publicados
        if (contadorTemas) {
            contadorTemas.innerHTML = `${temas.length} temas disponibles &bull; Explora el contenido del catálogo`;
        }

        // Filtrar simultáneamente por texto, tecnología y nivel
        const temasFiltrados = temas.filter(tema => {
            const titulo = tema.titulo ? tema.titulo.toLowerCase() : '';
            const desc = tema.descripcion ? tema.descripcion.toLowerCase() : '';
            const tec = tema.tecnologia ? tema.tecnologia.toLowerCase() : '';
            const niv = tema.nivel ? tema.nivel.toLowerCase() : '';

            const coincideTexto = titulo.includes(textoBusqueda) || desc.includes(textoBusqueda);
            const coincideTec = (tecnologiaActual === 'todos' || tec === tecnologiaActual.toLowerCase());
            const coincideNiv = (nivelActual === 'todos' || niv === nivelActual.toLowerCase());

            return coincideTexto && coincideTec && coincideNiv;
        });

        if (temasFiltrados.length === 0) {
            contenedorCatalogo.innerHTML = `<div class="col-12 text-center py-5 text-muted">No se encontraron temas coincidentes con los filtros seleccionados.</div>`;
            return;
        }

        // DETECTAR SI EL PANEL DERECHO ESTÁ ABIERTO
        const panelDerecho = document.getElementById('panelDerecho');
        const estaPanelAbierto = panelDerecho && !panelDerecho.classList.contains('d-none');

        // CLASE DINÁMICA: 2 columnas si el panel está abierto, 4 si está cerrado
        const claseColumnaTarjeta = estaPanelAbierto 
            ? "col-xl-6 col-lg-6 col-md-6" 
            : "col-xl-3 col-lg-4 col-md-6";

        let htmlTarjetas = '';

        temasFiltrados.forEach((tema) => {
            const indexOriginal = temas.findIndex(t => t.titulo === tema.titulo && t.tecnologia === tema.tecnologia);

            let badgeNivelClass = 'bg-warning bg-opacity-10 text-warning';
            if (tema.nivel === 'Intermedio') badgeNivelClass = 'bg-primary bg-opacity-10 text-primary';
            if (tema.nivel === 'Avanzado') badgeNivelClass = 'bg-danger bg-opacity-10 text-danger';

            // Seleccionar icono SVG según el lenguaje/tecnología del tema
            let iconoSvg = '';
            const tec = tema.tecnologia ? tema.tecnologia.toLowerCase() : '';

            if (tec.includes('java')) {
                iconoSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
            } else if (tec.includes('html')) {
                iconoSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`;
            } else if (tec.includes('sql')) {
                iconoSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>`;
            } else {
                iconoSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
            }

            let archivoBadge = tema.archivo ? `<span class="badge bg-info bg-opacity-10 text-info border px-2 py-1 rounded-pill small ms-2">📎 ${tema.archivo}</span>` : '';

            htmlTarjetas +=`
                <div class="${claseColumnaTarjeta}">
                    <div class="card border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                                    ${iconoSvg}
                                </div>
                                <span class="badge ${badgeNivelClass} px-3 py-1 rounded-pill small fw-medium">${tema.nivel}</span>
                            </div>
                            <h5 class="fw-bold mb-1 text-dark">${tema.titulo}</h5>
                            <p class="text-muted small mb-2">${tema.tecnologia} ${archivoBadge}</p>
                            <p class="text-secondary small mb-4">${tema.descripcion}</p>
                        </div>
                        <div class="d-flex justify-content-between align-items-center pt-2">
                            <button class="btn btn-link text-decoration-none fw-bold small p-0 text-primary btn-abrir-tema" data-index="${indexOriginal}">
                                Abrir <i class="bi bi-chevron-right small"></i>
                            </button>

                            <span class="badge bg-light text-muted border px-2 py-1 rounded-pill small">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="20" height="20" rx="5"/>
                                    <g stroke="#DB2777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
                                        <path d="M10 3v3"/>
                                        <circle cx="10" cy="2.5" r="0.75" fill="#DB2777"/>
                                        <rect x="4.5" y="6" width="11" height="9" rx="2.5"/>
                                        <circle cx="7.5" cy="9.5" r="0.75" fill="#DB2777"/>
                                        <circle cx="12.5" cy="9.5" r="0.75" fill="#DB2777"/>
                                        <line x1="8" y1="12.5" x2="12" y2="12.5"/>
                                        <line x1="2.5" y1="10.5" x2="4.5" y2="10.5"/>
                                        <line x1="15.5" y1="10.5" x2="17.5" y2="10.5"/>
                                    </g>
                                </svg>
                                Tutor IA
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });

        contenedorCatalogo.innerHTML = htmlTarjetas;
    }

    // Evento de Búsqueda en Tiempo Real (Barra del Main)
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            textoBusqueda = e.target.value.toLowerCase().trim();
            // Sincronizar con la barra del header
            if (globalSearchInput) {
                globalSearchInput.value = e.target.value;
            }
            cargarCatalogo();
        });
    }

    // Evento de Búsqueda en Tiempo Real (Barra del Header)
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            textoBusqueda = e.target.value.toLowerCase().trim();
            // Sincronizar con la barra del main
            if (inputBusqueda) {
                inputBusqueda.value = e.target.value;
            }
            cargarCatalogo();
        });
    }

    // Eventos para Filtros de Tecnología
    if (grupoFiltrosTecnologia) {
        grupoFiltrosTecnologia.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-tec');
            if (btn) {
                grupoFiltrosTecnologia.querySelectorAll('.btn-tec').forEach(b => {
                    b.classList.remove('text-white');
                    b.classList.add('btn-light', 'text-secondary', 'border');
                    b.style.backgroundColor = '';
                });
                btn.classList.remove('btn-light', 'text-secondary', 'border');
                btn.classList.add('text-white');
                btn.style.backgroundColor = '#6366f1';

                tecnologiaActual = btn.getAttribute('data-tecnologia');
                cargarCatalogo();
            }
        });
    }

    // Eventos para Filtros de Nivel
    if (grupoFiltrosNivel) {
        grupoFiltrosNivel.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-niv');
            if (btn) {
                grupoFiltrosNivel.querySelectorAll('.btn-niv').forEach(b => {
                    b.classList.remove('text-white');
                    b.classList.add('btn-light', 'text-secondary', 'border');
                    b.style.backgroundColor = '';
                });
                btn.classList.remove('btn-light', 'text-secondary', 'border');
                btn.classList.add('text-white');
                btn.style.backgroundColor = '#6366f1';

                nivelActual = btn.getAttribute('data-nivel');
                cargarCatalogo();
            }
        });
    }

    // Inicializar catálogo al cargar la página
    cargarCatalogo();
});

// Mostrar detalle y activar vista dividida al hacer clic en "Abrir" (Solo lectura, sin botones de edición)
document.addEventListener('click', (e) => {
    const btnAbrir = e.target.closest('.btn-abrir-tema');
    if (btnAbrir) {
        const index = btnAbrir.getAttribute('data-index');
        const temas = JSON.parse(localStorage.getItem('temas')) || [];
        const tema = temas[index];

        const columnaCatalogo = document.getElementById('columnaCatalogo');
        const panelDerecho = document.getElementById('panelDerecho');
        const cardDetalle = document.getElementById('cardDetalleContenido');

        if (tema && columnaCatalogo && panelDerecho) {
            // TRANSICIÓN A VISTA DIVIDIDA
            columnaCatalogo.classList.remove('col-12');
            columnaCatalogo.classList.add('col-lg-7');
            panelDerecho.classList.remove('d-none'); // Muestra el panel derecho

            // Rellenar la información del tema seleccionado (solo lectura)
            cardDetalle.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="d-flex align-items-center gap-2">
                        <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                            💻
                        </div>
                        <div>
                            <h5 class="fw-bold mb-0 text-dark">${tema.titulo}</h5>
                            <small class="text-muted">${tema.tecnologia} · <span class="badge bg-warning bg-opacity-10 text-warning">${tema.nivel}</span></small>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-light text-secondary border-0" id="cerrarDetalleBtn" title="Cerrar panel">✕</button>
                    </div>
                </div>
                <p class="text-secondary mb-3">${tema.descripcion}</p>

                <!-- Bloque de contenido/código de lectura -->
                <div class="p-3 rounded-3 text-white mb-3" style="background-color: #1e1b4b; font-family: monospace; font-size: 0.85rem;">
                    <span class="text-muted">// Contenido de documentación para ${tema.titulo}</span><br>
                    <span>public class Ejemplo {</span><br>
                    &nbsp;&nbsp;<span>public static void main(String[] args) {</span><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span>System.out.println("¡Bienvenido al tema!");</span><br>
                    &nbsp;&nbsp;<span>}</span><br>
                    <span>}</span>
                </div>

                <div class="p-2 rounded-3 bg-light text-primary small fw-semibold text-center">
                    🤖 El Tutor IA está listo para guiarte en este tema ↓
                </div>
            `;
        }
    }

    // BOTÓN PARA CERRAR EL PANEL DE LECTURA
    if (e.target.closest('#cerrarDetalleBtn')) {
        const columnaCatalogo = document.getElementById('columnaCatalogo');
        const panelDerecho = document.getElementById('panelDerecho');

        if (columnaCatalogo && panelDerecho) {
            columnaCatalogo.classList.remove('col-lg-7');
            columnaCatalogo.classList.add('col-12');
            panelDerecho.classList.add('d-none');

            // Recargar catálogo para volver a 4 columnas
            const eventoCargar = new Event('DOMContentLoaded');
            document.dispatchEvent(eventoCargar);
        }
    }
});