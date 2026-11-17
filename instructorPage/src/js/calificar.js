document.addEventListener("DOMContentLoaded", () => {
    // 1. Datos iniciales de ejemplo si localStorage está vacío
    const datosIniciales = [
        {
            id: 1,
            avatarNum: "21",
            usuario: "user_4821",
            taller: "Taller 2 - Estructuras de Control",
            fecha: "21 jul 2025",
            estado: "pendiente",
            calificacion: null,
            retroalimentacion: "",
            archivo: "taller_entrega_4821.pdf"
        },
        {
            id: 2,
            avatarNum: "34",
            usuario: "user_2934",
            taller: "Taller 2 - Estructuras de Control",
            fecha: "22 jul 2025",
            estado: "pendiente",
            calificacion: null,
            retroalimentacion: "",
            archivo: "taller_entrega_2934.pdf"
        },
        {
            id: 3,
            avatarNum: "19",
            usuario: "user_5519",
            taller: "Taller 3 - Flexbox",
            fecha: "26 jul 2025",
            estado: "pendiente",
            calificacion: null,
            retroalimentacion: "",
            archivo: "taller_entrega_5519.pdf"
        },
        {
            id: 4,
            avatarNum: "02",
            usuario: "user_7102",
            taller: "Taller 1 - Variables Java",
            fecha: "15 jul 2025",
            estado: "calificado",
            calificacion: 4.8,
            retroalimentacion: "Excelente manejo de tipos de datos.",
            archivo: "taller_java_7102.pdf"
        },
        {
            id: 5,
            avatarNum: "15",
            usuario: "user_7102",
            taller: "Taller 1 - Variables Java",
            fecha: "18 jul 2025",
            estado: "calificado",
            calificacion: 3.0,
            retroalimentacion: "Revisar alcance de variables.",
            archivo: "taller_java_15.pdf"
        }
    ];

    if (!localStorage.getItem("entregas_alicia")) {
        localStorage.setItem("entregas_alicia", JSON.stringify(datosIniciales));
    }

    let idEstudianteSeleccionado = null;

    // Elementos del DOM
    const contenedorPendientes = document.getElementById("lista-pendientes");
    const contenedorCalificadas = document.getElementById("lista-calificadas");
    const panelDerechoContainer = document.getElementById("panel-derecho-container");

    // Función principal para renderizar la interfaz
    function renderizarListas() {
        const entregas = JSON.parse(localStorage.getItem("entregas_alicia")) || [];

        contenedorPendientes.innerHTML = "";
        contenedorCalificadas.innerHTML = "";

        entregas.forEach(item => {
            if (item.estado === "pendiente") {
                const card = document.createElement("div");
                card.className = "card border-0 shadow-sm rounded-4 p-3 bg-white d-flex flex-row align-items-center justify-content-between card-entrega";
                card.style.cursor = "pointer";
                card.innerHTML = `
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style="width: 45px; height: 45px; background-color: #d97706;">
                            ${item.avatarNum}
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1 text-dark" style="font-size: 0.95rem;">${item.usuario}</h6>
                            <small class="text-muted" style="font-size: 0.75rem;">${item.taller} &bull; ${item.fecha}</small>
                        </div>
                    </div>
                    <span class="badge bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-pill fw-medium" style="font-size: 0.75rem;">Pendiente</span>
                `;
                // Evento click para seleccionar tarjeta y mostrar panel derecho
                card.addEventListener("click", () => {
                    idEstudianteSeleccionado = item.id;
                    mostrarPanelCalificacion(item);
                });
                contenedorPendientes.appendChild(card);
            } else {
                const card = document.createElement("div");
                card.className = "card border-0 shadow-sm rounded-4 p-3 bg-white d-flex flex-row align-items-center justify-content-between";
                card.innerHTML = `
                    <div class="d-flex align-items-center gap-3">
                        <div class="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style="width: 45px; height: 45px; background-color: #0d9488;">
                            ${item.avatarNum}
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1 text-dark" style="font-size: 0.95rem;">${item.usuario}</h6>
                            <small class="text-muted" style="font-size: 0.75rem;">${item.taller}</small>
                        </div>
                    </div>
                    <span class="fw-bold fs-5" style="color: #6366f1;">${Number(item.calificacion).toFixed(1)}</span>
                `;
                contenedorCalificadas.appendChild(card);
            }
        });
    }

    // Muestra el formulario de calificación precargado con los datos del usuario seleccionado
    function mostrarPanelCalificacion(item) {
        panelDerechoContainer.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <h5 class="fw-bold mb-4">Calificar entrega</h5>

                <div class="p-3 rounded-4 bg-light mb-3 border-0">
                    <small class="text-muted d-block mb-1" style="font-size: 0.75rem;">Estudiante</small>
                    <h6 class="fw-bold text-dark mb-1">${item.usuario}</h6>
                    <small class="text-muted" style="font-size: 0.8rem;">${item.taller}</small>
                </div>

                <div class="p-3 rounded-4 bg-white border border-light-subtle d-flex align-items-center justify-content-between mb-4 shadow-sm" style="border-style: dashed !important;">
                    <div class="d-flex align-items-center gap-2 text-secondary">
                        <i class="bi bi-file-earmark-text fs-5 text-muted"></i>
                        <span class="small fw-medium text-dark">${item.archivo}</span>
                    </div>
                    <a href="#" class="text-decoration-none small fw-bold" style="color: #6366f1;">Ver PDF</a>
                </div>

                <div class="mb-3">
                    <label class="form-label text-muted fw-bold" style="font-size: 0.7rem; letter-spacing: 0.5px;">CALIFICACIÓN (0.0 - 5.0)</label>
                    <input type="number" step="0.1" min="0" max="5" class="form-control rounded-3 py-2 bg-white border" id="input-calificacion" value="${item.calificacion || 3.0}">
                </div>

                <div class="mb-4">
                    <label class="form-label text-muted fw-bold" style="font-size: 0.7rem; letter-spacing: 0.5px;">RETROALIMENTACIÓN</label>
                    <textarea class="form-control rounded-3 bg-white border" id="input-retro" rows="4" placeholder="Escribe comentarios sobre la entrega del estudiante...">${item.retroalimentacion || ""}</textarea>
                </div>

                <div>
                    <button class="btn text-white w-100 py-2 rounded-pill shadow-sm fw-medium" id="btn-guardar-calificacion" style="background-color: #0d9488;">Guardar calificación</button>
                </div>
            </div>
        `;

        // Evento para guardar la nota y actualizar localStorage
        document.getElementById("btn-guardar-calificacion").addEventListener("click", () => {
            const nuevaNota = parseFloat(document.getElementById("input-calificacion").value);
            const nuevaRetro = document.getElementById("input-retro").value;

            if (isNaN(nuevaNota) || nuevaNota < 0 || nuevaNota > 5) {
                alert("Por favor ingresa una calificación válida entre 0.0 y 5.0");
                return;
            }

            let entregas = JSON.parse(localStorage.getItem("entregas_alicia")) || [];
            entregas = entregas.map(e => {
                if (e.id === idEstudianteSeleccionado) {
                    e.estado = "calificado";
                    e.calificacion = nuevaNota;
                    e.retroalimentacion = nuevaRetro;
                }
                return e;
            });

            localStorage.setItem("entregas_alicia", JSON.stringify(entregas));
            idEstudianteSeleccionado = null;

            // Restablecer panel derecho a estado vacío
            panelDerechoContainer.innerHTML = `
                <div class="card border-0 shadow-sm rounded-4 p-5 h-100 bg-white d-flex align-items-center justify-content-center text-center" style="border: 2px dashed #dee2e6 !important;" id="panel-vacio">
                    <div class="py-5">
                        <div class="text-muted mb-3 fs-1 opacity-50">
                            <i class="bi bi-file-earmark-text"></i>
                        </div>
                        <p class="text-muted mb-0" style="font-size: 0.95rem;">Selecciona una entrega para calificar</p>
                    </div>
                </div>
            `;

            renderizarListas();
        });
    }

    // Inicializar renderizado al cargar la página
    renderizarListas();
});