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

function renderizarDestacadosCatena() {
    const contenedor = document.getElementById('catena-list');
    
    // Lista de IDs que quieres mostrar específicamente en esta sección
    const idsDestacados = [48, 49, 50, 33, 22, 1]; 

    // Filtramos y generamos el HTML
    const htmlProductos = productosData
        .filter(p => idsDestacados.includes(p.id))
        .map(p => `
            <div class="sw-item">
                <div class="sw-item-name">${p.nombre}</div>
                <div class="sw-item-price">${p.precio !== '-' ? '$' + p.precio : 'Consultar'}</div>
            </div>
        `).join('');

    contenedor.innerHTML = htmlProductos;
}

// Llamar a la función cuando cargue la página
document.addEventListener('DOMContentLoaded', renderizarDestacadosCatena);