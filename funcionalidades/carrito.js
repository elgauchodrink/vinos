// app.js

let carrito = JSON.parse(localStorage.getItem('carrito-gaucho')) || [];

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorVisual();
    renderizarCarritoUI(); // Si el modal está abierto al cargar
});

// --- LÓGICA DE DATOS ---

function agregarAlCarrito(id) {
    // Buscamos el producto en productosData (que viene de productos.js)
    const producto = productosData.find(p => p.id === id);
    
    if (!producto) return;

    // Verificar si ya está en el carrito
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardarYActualizar();
}

function cambiarCantidad(id, delta) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.cantidad += delta;
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            guardarYActualizar();
        }
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarYActualizar();
}

function guardarYActualizar() {
    localStorage.setItem('carrito-gaucho', JSON.stringify(carrito));
    actualizarContadorVisual();
    renderizarCarritoUI();
}

function actualizarContadorVisual() {
    const contador = document.getElementById('count-cart');
    if (contador) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.innerText = totalItems;
    }
}

// --- LÓGICA DE INTERFAZ (UI) ---

function toggleCarrito() {
    let modal = document.getElementById('modal-carrito');
    if (!modal) {
        crearModalCarrito();
        modal = document.getElementById('modal-carrito');
    }
    modal.classList.toggle('active');
    renderizarCarritoUI();
}

function crearModalCarrito() {
    const modalHTML = `
        <div id="modal-carrito" class="cart-modal">
            <div class="cart-content">
                <div class="cart-header">
                    <h3>Tu Pedido</h3>
                    <button onclick="toggleCarrito()" class="close-cart">✕</button>
                </div>
                <div id="cart-items-container"></div>
                <div class="cart-footer">
                    <div class="cart-total">Total: <span id="cart-total-price">$0</span></div>
                    <button onclick="enviarWhatsApp()" class="btn-whatsapp">Finalizar Pedido por WhatsApp</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function renderizarCarritoUI() {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-price');
    if (!container) return;

    if (carrito.length === 0) {
        container.innerHTML = '<p class="empty-msg">El carrito está vacío.</p>';
        totalDisplay.innerText = "$0";
        return;
    }

    let total = 0;
    container.innerHTML = carrito.map(item => {
        // Limpiamos el precio para calcular (quitamos $ y puntos)
        const precioLimpio = parseFloat(item.precio.replace(/\./g, '').replace(',', '.'));
        if (!isNaN(precioLimpio)) {
            total += precioLimpio * item.cantidad;
        }

        return `
            <div class="cart-item">
                <div class="item-info">
                    <p class="item-name">${item.nombre}</p>
                    <p class="item-brand">${item.marca}</p>
                    <p class="item-price">$${item.precio}</p>
                </div>
                <div class="item-controls">
                    <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    <button onclick="eliminarDelCarrito(${item.id})" class="btn-remove">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    totalDisplay.innerText = `$${total.toLocaleString('es-AR')}`;
}

// --- ENVÍO A WHATSAPP ---

function enviarWhatsApp() {
    if (carrito.length === 0) return;

    const numeroTel = "5491176588135";
    let mensaje = "Hola El Gaucho Drink! 🍷 Quisiera realizar el siguiente pedido:\n\n";

    carrito.forEach(item => {
        mensaje += `• ${item.cantidad}x ${item.nombre} (${item.marca}) - $${item.precio}\n`;
    });

    const total = document.getElementById('cart-total-price').innerText;
    mensaje += `\n*Total Estimado: ${total}*\n\nGracias!`;

    const url = `https://api.whatsapp.com/send?phone=${numeroTel}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}