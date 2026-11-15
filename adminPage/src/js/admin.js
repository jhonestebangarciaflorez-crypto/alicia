document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));


    if (usuarioActivo && usuarioActivo.nombre) {
        const spanNombre = document.querySelector('.user-name');
        
        if (spanNombre) {

            spanNombre.textContent = usuarioActivo.nombre;
        }
    }
});