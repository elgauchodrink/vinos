/**
 * LÓGICA DINÁMICA DEL CATÁLOGO - El Gaucho Drink
 */

document.addEventListener('DOMContentLoaded', () => {
    inicializarCatalogo();
    
    // Capturar filtro desde URL (ej: catalogo.html#CATENA)
    const hash = window.location.hash.replace('#', '').toUpperCase();
    if (hash) {
        const botones = document.querySelectorAll('.fbtn');
        botones.forEach(btn => {
            if (btn.getAttribute('onclick').includes(hash)) {
                filtrarCatalogo(hash, btn);
            }
        });
    }
});

function inicializarCatalogo() {
    const grid = document.getElementById('brandsGrid');
    if (!grid) return;

    // 1. Agrupamos por marca basándonos en la data
    const productosPorMarca = productosData.reduce((acc, producto) => {
        const marca = producto.marca || "OTRAS MARCAS";
        if (!acc[marca]) acc[marca] = [];
        acc[marca].push(producto);
        return acc;
    }, {});

    renderizarTarjetasMarcas(productosPorMarca, grid);
}

// RENDER NIVEL 1: Las tarjetas de las Bodegas
function renderizarTarjetasMarcas(grupos, contenedor) {
    let html = '';

    for (const nombreMarca in grupos) {
        const productos = grupos[nombreMarca];
        // Usamos la categoría que agregamos manualmente en productos.js
        const categoriaFiltro = (productos[0].categoria || 'otros').toUpperCase();
        
        html += `
            <div class="bcard" data-cat="${categoriaFiltro}" onclick="verDetalleMarca('${nombreMarca}')">
                <div class="b-name">${nombreMarca}</div>
                <div class="b-sub">${productos.length} productos</div>
                <ul class="b-list">
                    ${productos.slice(0, 3).map(p => `<li>${p.nombre}</li>`).join('')}
                    <li>Ver catálogo completo →</li>
                </ul>
            </div>
        `;
    }
    contenedor.innerHTML = html;
}

// RENDER NIVEL 2: Mostrar productos de la marca elegida
window.verDetalleMarca = function(nombreMarca) {
    const marcasSection = document.getElementById('marcas');
    const productosSection = document.getElementById('productos-marca');
    const titulo = document.getElementById('titulo-marca-seleccionada');
    const grilla = document.getElementById('grilla-productos');

    // Filtrar productos de esa marca
    const filtrados = productosData.filter(p => p.marca === nombreMarca);

    titulo.innerText = nombreMarca;
    marcasSection.style.display = 'none';
    productosSection.style.display = 'flex';

    grilla.innerHTML = filtrados.map(p => `
        <div class="bcard">
            <div class="b-name">${p.nombre}</div>
            <div class="b-sub">${p.marca}</div>
            <div class="b-price">
                ${formatearPrecio(p.precio)}
            </div>
            <button class="btn-gold" onclick="event.stopPropagation(); agregarAlCarrito(${p.id})">
                Añadir al Carrito
            </button>
        </div>
    `).join('');
    
    window.scrollTo(0, 0);
};

window.volverAMarcas = function() {
    document.getElementById('marcas').style.display = 'flex';
    document.getElementById('productos-marca').style.display = 'none';
};

function formatearPrecio(precio) {
    if (precio === '-' || !precio || precio === 'Consultar') return 'Consultar';
    return precio.includes('$') ? precio : `$${precio}`;
}

// --- FILTROS ---
window.filtrarCatalogo = function(categoriaFiltro, btn) {
    // 1. Manejo visual de botones
    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2. Normalizamos el filtro a minúsculas
    const filtro = categoriaFiltro.toLowerCase();
    
    // 3. Obtenemos todas las tarjetas de marcas
    const tarjetas = document.querySelectorAll('.bcard');

    tarjetas.forEach(card => {
        // Obtenemos la categoría de la tarjeta (que inyectamos al crearla)
        const catCard = card.getAttribute('data-cat').toLowerCase();
        
        if (filtro === 'all' || catCard === filtro) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
};