document.addEventListener('DOMContentLoaded', () => {
        const tarjetas = Array.from(document.querySelectorAll('.card'));
        const botonesFiltro = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('buscador-catalogo');
        const searchBtn = document.getElementById('btn-buscar');
        const paginacionContainer = document.getElementById('paginacion-container');

        // Variables
        let currentPage = 1;
        const cardsPerPage = 8;
        let currentCategory = 'todos';
        let searchQuery = '';

        function updateView() {
            const filteredCards = tarjetas.filter(tarjeta => {
                const categoryMatch = currentCategory === 'todos' || tarjeta.getAttribute('data-category') === currentCategory;
                const textContent = tarjeta.innerText.toLowerCase(); 
                const searchMatch = textContent.includes(searchQuery);
                
                return categoryMatch && searchMatch;
            });


            const totalPages = Math.ceil(filteredCards.length / cardsPerPage) || 1;
            if (currentPage > totalPages) currentPage = totalPages;


            const startIndex = (currentPage - 1) * cardsPerPage;
            const endIndex = startIndex + cardsPerPage;


            tarjetas.forEach(tarjeta => {
                tarjeta.style.display = 'none'; 
            });


            filteredCards.slice(startIndex, endIndex).forEach(tarjeta => {
                tarjeta.style.display = 'flex'; 
            });


            renderPagination(totalPages);
        }

        // Función para crear los botones
        function renderPagination(totalPages) {
            paginacionContainer.innerHTML = '';

            // Crear botón anterior
            const prevBtn = document.createElement('button');
            prevBtn.className = `btn-page ${currentPage === 1 ? 'disabled' : ''}`;
            prevBtn.textContent = '< Anterior';
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateView();
                }
            });
            paginacionContainer.appendChild(prevBtn);

            // Crear números de página
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `btn-page ${currentPage === i ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    updateView();
                });
                paginacionContainer.appendChild(pageBtn);
            }

            // Crear botón siguiente
            const nextBtn = document.createElement('button');
            nextBtn.className = `btn-page ${currentPage === totalPages ? 'disabled' : ''}`;
            nextBtn.textContent = 'Siguiente >';
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updateView();
                }
            });
            paginacionContainer.appendChild(nextBtn);
        }




        // Evento al escribir en la barra
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            currentPage = 1;
            updateView();
        });


        searchBtn.addEventListener('click', () => {
            searchQuery = searchInput.value.toLowerCase();
            currentPage = 1;
            updateView();
        });


        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', () => {

                botonesFiltro.forEach(btn => btn.classList.remove('active'));
                boton.classList.add('active');
                
                // Actualizar estado
                currentCategory = boton.getAttribute('data-filter');
                currentPage = 1; 
                updateView();
            });
        });

        // Arrancar la vista por primera vez
        updateView();
    });
