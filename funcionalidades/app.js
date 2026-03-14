function actualizarNavegacion(seccion) {
    const navLinks = document.getElementById('main-nav-links');
    
    if (seccion === 'inicio') {
        navLinks.classList.add('hidden');
    } else {
        navLinks.classList.remove('hidden');
    }
}

// Ejemplo de cómo integrarlo en tu función existente:
function mostrarSeccion(seccion) {
    actualizarNavegacion(seccion);
}

// Ejecutar al cargar para verificar si empezamos en el inicio
window.onload = () => {
    // Supongamos que por defecto arranca en inicio o lo detectas del URL
    actualizarNavegacion('inicio'); 
};