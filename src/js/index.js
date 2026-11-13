document.addEventListener('DOMContentLoaded', () => {
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    const tarjetas = document.querySelectorAll('.card');


    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {

            botonesFiltro.forEach(btn => btn.classList.remove('active'));
                

            boton.classList.add('active');


            const filtro = boton.getAttribute('data-filter');


            tarjetas.forEach(tarjeta => {
                const categoria = tarjeta.getAttribute('data-category');
                    
                if (filtro === 'todos' || filtro === categoria) {

                    tarjeta.style.display = 'flex'; 
                } else {
                    tarjeta.style.display = 'none';
                }
            });
        });
    });
});

// Lógica para las Preguntas Frecuentes
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        
        // Esta línea cierra las demás preguntas si abres una nueva (opcional, pero se ve mejor)
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Alterna el estado abierto/cerrado de la pregunta seleccionada
        item.classList.toggle('active');
    });
});