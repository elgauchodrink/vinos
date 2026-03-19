/**
 * LÓGICA DEL CARRITO Y APP GLOBAL - ACTUALIZADO VENTA POR CAJA (x6)
 */

let carrito = JSON.parse(localStorage.getItem('carrito-gaucho')) || [];

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorVisual();
    if (document.getElementById('modal-carrito')) {
        renderizarCarritoUI();
    }
});

// --- LÓGICA DE DATOS ---

window.agregarAlCarrito = function(id) {
    const producto = productosData.find(p => p.id === id);
    
    if (!producto) return;

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
    toggleCarrito();
};

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

window.toggleCarrito = function() {
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
                    <p style="color: #c9a84c; font-size: 0.8rem; margin-bottom: 10px; text-align: center;">
                        * Los precios corresponden a la unidad, venta mínima 1 caja (6 botellas).
                    </p>
                    <div class="cart-total">Total (por cajas): <span id="cart-total-price">$0</span></div>
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
        container.innerHTML = '<p style="color: #888; text-align: center; margin-top: 2rem;">El carrito está vacío.</p>';
        totalDisplay.innerText = "$0";
        return;
    }

    let totalCajasCalculado = 0;

    container.innerHTML = carrito.map(item => {
        const precioUnitario = parseFloat(item.precio.replace(/\./g, '').replace(',', '.')) || 0;
        const precioCaja = precioUnitario * 6;
        totalCajasCalculado += precioCaja * item.cantidad;

        return `
            <div class="cart-item">
                <div class="item-info">
                    <p class="item-name">${item.nombre}</p>
                    <p class="item-brand">${item.marca}</p>
                    <p class="item-price">
                        $${item.precio} <small style="color: #888;">(c/u)</small> 
                        <br>
                        <span style="color: #c9a84c; font-size: 0.8rem;">Caja x6: $${precioCaja.toLocaleString('es-AR')}</span>
                    </p>
                </div>
                <div class="item-controls">
                    <div id="quantity-controls-${item.id}" class="quantity-controls">
                        <div style="text-align: center; margin-bottom: 5px; font-size: 0.7rem; color: #888;">Cajas</div>
                        <div class="control-btns">
                            <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                            <span>${item.cantidad}</span>
                            <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button onclick="eliminarDelCarrito(${item.id})" class="btn-remove" style="margin-top: 10px;">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    totalDisplay.innerText = `$${totalCajasCalculado.toLocaleString('es-AR')}`;
}

// --- ENVÍO A WHATSAPP ---

window.enviarWhatsApp = function() {
    if (carrito.length === 0) return;

    const numeroTel = "5491176588135";
    let mensaje = "Hola El Gaucho Drink! 🍷 Quisiera realizar el siguiente pedido (Venta por Caja cerrada x6):\n\n";

    carrito.forEach(item => {
        const precioUnit = parseFloat(item.precio.replace(/\./g, '').replace(',', '.')) || 0;
        const subtotalCaja = (precioUnit * 6) * item.cantidad;
        
        mensaje += `• *${item.cantidad} CAJA(S)* de: ${item.nombre}\n`;
        mensaje += `  Marca: ${item.marca}\n`;
        mensaje += `  Precio x caja: $${(precioUnit * 6).toLocaleString('es-AR')}\n`;
        mensaje += `  Subtotal: $${subtotalCaja.toLocaleString('es-AR')}\n\n`;
    });

    const total = document.getElementById('cart-total-price').innerText;
    mensaje += `*TOTAL DEL PEDIDO: ${total}*`;
    mensaje += `\n\n_Entiendo que el precio mostrado en web es unitario y el pedido es por cajas de 6 botellas._`;

    const url = `https://api.whatsapp.com/send?phone=${numeroTel}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}