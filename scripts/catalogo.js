document.addEventListener('DOMContentLoaded', () => {
    inicializarCatalogo();

    // Capturar filtro desde URL (ej: catalogo.html#CATENA)
    const hash = window.location.hash.replace('#', '').toUpperCase();

    if (hash) {
        const botonEncontrado = document.querySelector(`.fbtn[data-filter="${hash}"]`);

        if (botonEncontrado) {
            filtrarCatalogo(hash, botonEncontrado);

            const seccionMarcas = document.getElementById('marcas');
            if (seccionMarcas) {
                seccionMarcas.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

function inicializarCatalogo() {
    const grid = document.getElementById('brandsGrid');
    if (!grid) return;

    const productosPorMarca = productosData.reduce((acc, producto) => {
        const marca = producto.marca || "OTRAS MARCAS";
        if (!acc[marca]) acc[marca] = [];
        acc[marca].push(producto);
        return acc;
    }, {});

    renderizarTarjetasMarcas(productosPorMarca, grid);
}

function renderizarTarjetasMarcas(grupos, contenedor) {
    let html = '';

    for (const nombreMarca in grupos) {
        const productos = grupos[nombreMarca];
        const categoriaFiltro = asignarCategoriaAutomaticamente(nombreMarca);

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

function asignarCategoriaAutomaticamente(marca) {
    const m = marca.toUpperCase();
    if (m.includes('ALAMOS') || m.includes('NICASIA') || m.includes('CATENA') || m.includes('ENEMIGO') || m.includes('SAINT FELICIEN') || m.includes('ANGELICA')) return 'CATENA';
    if (m.includes('LUIGI') || m.includes('LINDA')) return 'LUIGI';
    if (m.includes('RUTINI') || m.includes('TRUMPETER') || m.includes('ENCUENTRO') || m.includes('DOMINIO')) return 'RUTINI';
    if (m.includes('SOTTANO')) return 'SOTTANO';
    if (m.includes('GIN') || m.includes('VODKA') || m.includes('ACONCAGUA')) return 'SPIRITS';
    return 'OTROS';
}

window.verDetalleMarca = function(nombreMarca) {
    const marcasSection = document.getElementById('marcas');
    const productosSection = document.getElementById('productos-marca');
    const titulo = document.getElementById('titulo-marca-seleccionada');
    const grilla = document.getElementById('grilla-productos');

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

window.filtrarCatalogo = function(categoriaFiltro, btn) {
    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const filtro = categoriaFiltro.toLowerCase();
    const tarjetas = document.querySelectorAll('#brandsGrid .bcard');

    tarjetas.forEach(card => {
        const catCard = (card.getAttribute('data-cat') || '').toLowerCase();

        if (filtro === 'all' || catCard === filtro) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
};