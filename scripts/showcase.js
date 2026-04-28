
// 1. Configuración de los Showcases
const configuracionShowcases = [
    {
        id: 'catena',
        tag: 'Bodega Catena Zapata · Luján de Cuyo',
        titulo: 'La Pirámide<br />del Malbec',
        desc: 'Fundada en 1902, Catena Zapata es la bodega argentina más galardonada del mundo. Desde sus viñedos de altura en Mendoza, produce los malbecs que definen Argentina en el mundo.',
        productos: [48, 49, 50, 33, 22, 1],
        claseExtra: '', // Normal
        imagenes: ['/catena/bodega.jpeg', '/catena/brindar.jpeg', '/catena/logo.jpg']
    },
    {
        id: 'rutini',
        tag: 'Rutini Wines · Valle de Uco, Mendoza',
        titulo: 'Tradición &<br />Elegancia',
        desc: 'Desde 1885, Rutini elabora vinos de carácter único en el Valle de Uco. Su colección abarca desde el accesible Trumpeter hasta el sublime Apartado.',
        productos: [101, 100, 96, 91, 104, 106],
        claseExtra: 'rev', // Invertido
        imagenes: ['/rutini/escena.jpeg', '/rutini/posando.png', '/rutini/logo.png']
    },
    {
        id: 'luigi',
        tag: 'Luigi Bosca · Luján de Cuyo desde 1901',
        titulo: 'Pioneros del<br />Vino Argentino',
        desc: 'Una de las bodegas más antiguas y respetadas de Argentina. Luigi Bosca y su línea La Linda ofrecen vinos de carácter y elegancia única.',
        productos: [63, 62, 61, 57, 53, 66],
        claseExtra: '', // Normal
        imagenes: ['/luigiBosca/vistas.jpg', '/luigiBosca/equilibrio.avif', '/luigiBosca/logo.png']
    }
];

// 2. Función para renderizar todos los Showcases
function renderizarShowcases() {
    const container = document.getElementById('showcases-container');
    
    container.innerHTML = configuracionShowcases.map(bodega => {
        // Obtenemos los productos para esta bodega desde productosData
        const listaProductosHTML = productosData
            .filter(p => bodega.productos.includes(p.id))
            .map(p => `
                <div class="sw-item">
                    <div class="sw-item-name">${p.nombre}</div>
                    <div class="sw-item-price">${p.precio !== '-' ? '$' + p.precio : 'Consultar'}</div>
                </div>
            `).join('');

        // Retornamos el bloque de HTML de la sección
        return `
            <section class="${bodega.id}-showcase content-section" id="${bodega.id}">
                <div class="showcase-inner ${bodega.claseExtra}">
                    <div class="sw-content">
                        <p class="sw-brand-tag">${bodega.tag}</p>
                        <h2 class="sw-title">${bodega.titulo}</h2>
                        <p class="sw-desc">${bodega.desc}</p>
                        <div class="sw-products">${listaProductosHTML}</div>
                        <a href="catalogo.html#${bodega.id.toUpperCase()}" class="btn-gold">Ver Línea Completa</a>
                    </div>
                    <div class="sw-imgs">
                        <img src="./imagenes/ilustraciones/${bodega.imagenes[0]}" alt="Escena" />
                        <img src="./imagenes/ilustraciones/${bodega.imagenes[1]}" alt="Familia" />
                        <img class="big" src="./imagenes/ilustraciones/${bodega.imagenes[2]}" alt="Principal" />
                    </div>
                </div>
            </section>
        `;
    }).join('');
}

// 3. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderizarShowcases();
    actualizarNavegacion('inicio');
});

// Mantén tus funciones de navegación igual
function mostrarSeccion(seccion) {
    actualizarNavegacion(seccion);
    // Aquí puedes agregar la lógica de ocultar/mostrar si es SPA
}

function actualizarNavegacion(seccion) {
    const navLinks = document.getElementById('main-nav-links');
    if (navLinks) {
        seccion === 'inicio' ? navLinks.classList.add('hidden') : navLinks.classList.remove('hidden');
    }
}