/**
 * LÓGICA DINÁMICA DEL CATÁLOGO
 */

document.addEventListener('DOMContentLoaded', () => {
    inicializarCatalogo();
});

function inicializarCatalogo() {
    const grid = document.getElementById('brandsGrid');
    if (!grid) return;

    // 1. Agrupamos por marca basándonos puramente en productos.js
    const productosPorMarca = productosData.reduce((acc, producto) => {
        const marca = producto.marca || "OTRAS MARCAS";
        if (!acc[marca]) acc[marca] = [];
        acc[marca].push(producto);
        return acc;
    }, {});

    // 2. Renderizamos
    renderizarTarjetas(productosPorMarca, grid);
}

function renderizarTarjetas(grupos, contenedor) {
    let html = '';

    for (const nombreMarca in grupos) {
        const productos = grupos[nombreMarca];
        
        // Asignamos categoría automáticamente según el nombre de la marca
        const categoriaFiltro = asignarCategoriaAutomaticamente(nombreMarca);
        
        const principales = productos.slice(0, 5);
        const adicionales = productos.slice(5);

        html += `
            <div class="bcard" data-cat="${categoriaFiltro}">
                <div class="b-name">${nombreMarca}</div>
                <div class="b-sub">${productos.length} productos</div>
                
                <ul class="b-list">
                    ${principales.map(p => `<li>${p.nombre} <span>${formatearPrecio(p.precio)}</span></li>`).join('')}
                </ul>

                ${adicionales.length > 0 ? `
                    <div class="extra" style="display: none;">
                        <ul class="b-list">
                            ${adicionales.map(p => `<li>${p.nombre} <span>${formatearPrecio(p.precio)}</span></li>`).join('')}
                        </ul>
                    </div>
                    <button class="expand-btn" onclick="toggleExtra(this)">+ Ver todos</button>
                ` : ''}
            </div>
        `;
    }
    contenedor.innerHTML = html;
}

// Lógica para clasificar sin listas manuales extensas
function asignarCategoriaAutomaticamente(marca) {
    const m = marca.toUpperCase();
    if (m.includes('ALAMOS') || m.includes('NICASIA') || m.includes('CATENA') || m.includes('ENEMIGO') || m.includes('SAINT FELICIEN') || m.includes('ANGELICA')) return 'CATENA';
    if (m.includes('LUIGI') || m.includes('LINDA')) return 'LUIGI';
    if (m.includes('RUTINI') || m.includes('TRUMPETER') || m.includes('ENCUENTRO') || m.includes('DOMINIO')) return 'RUTINI';
    if (m.includes('SOTTANO')) return 'SOTTANO';
    if (m.includes('GIN') || m.includes('VODKA') || m.includes('ACONCAGUA')) return 'SPIRITS';
    return 'OTROS';
}

function formatearPrecio(precio) {
    if (precio === '-' || !precio) return 'Consultar';
    return precio.includes('$') ? precio : `$${precio}`;
}

// --- FUNCIONES GLOBALES PARA EL HTML ---

window.filtrarCatalogo = function(categoria, btn) {
    // UI: Activar botón
    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filtro = categoria.toUpperCase();
    const cards = document.querySelectorAll('.bcard');

    cards.forEach(card => {
        const catCard = card.getAttribute('data-cat').toUpperCase();
        if (filtro === 'ALL' || catCard === filtro) {
            card.style.display = "flex"; // Usamos flex para mantener tu diseño CSS
        } else {
            card.style.display = "none";
        }
    });
};

window.toggleExtra = function(btn) {
    const extraDiv = btn.previousElementSibling;
    const isHidden = extraDiv.style.display === "none";
    extraDiv.style.display = isHidden ? "block" : "none";
    btn.innerText = isHidden ? "- Ver menos" : "+ Ver todos";
};