// 1. VARIABLES GLOBALES DE CONFIGURACIÓN
const CONFIGURACION = {
    // Usamos un Array (lista) para poner todos los teléfonos que quieras
    telefonosVentas: [
        "+54 9 11 5882-4184",
        "+54 9 11 3792-2708"
    ],
    instagramUsuario: "@elgauchodrink",
    instagramEnlace: "https://instagram.com/elgauchodrink",
    whatsappNumero: "5491137922708",
    mensajeWhatsAppBase: "Hola El Gaucho Drink! 🍷 Quisiera consultar el precio y disponibilidad de estos productos:\n\n"
};

document.addEventListener('DOMContentLoaded', () => {
    // Buscar el contenedor de los teléfonos en el HTML
    const contenedorTelefonos = document.getElementById('lista-telefonos');
    contenedorTelefonos.innerHTML = ''; // Lo limpiamos por las dudas
    
    // Recorrer la lista de teléfonos y crear un enlace de WhatsApp para cada uno
    CONFIGURACION.telefonosVentas.forEach(telefono => {
        // Limpiamos el número: sacamos espacios, guiones y el '+'
        const numeroLimpio = telefono.replace(/\D/g, ''); 
        
        // Creamos la fila de la lista, inyectando un enlace <a> con el link de "wa.me"
        contenedorTelefonos.innerHTML += `
            <li style="margin-bottom: 12px;">
                <a href="https://wa.me/${numeroLimpio}" target="_blank" title="Enviar WhatsApp a ${telefono}">
                    📞 ${telefono}
                </a>
            </li>
        `;
    });
    
    // Enlaces de Instagram y WhatsApp directo
    const linkIg = document.getElementById('link-ig');
    linkIg.innerText = CONFIGURACION.instagramUsuario;
    linkIg.href = CONFIGURACION.instagramEnlace;

    const linkWppDirecto = document.getElementById('link-wpp-directo');
    linkWppDirecto.href = `https://wa.me/${CONFIGURACION.whatsappNumero}`;
});

// 2. GENERAR MARCAS
const marcasLista = [...new Set(productosData.map(producto => producto.marca))];

// 3. LÓGICA DE NAVEGACIÓN (Actualizada para ocultar botones)
function mostrarSeccion(idSeccion) {
    // NUEVO: Le avisamos al HTML en qué sección estamos
    document.body.setAttribute('data-seccion-activa', idSeccion);

    document.querySelectorAll('main > section').forEach(sec => {
        sec.classList.remove('seccion-activa');
        sec.classList.add('seccion-oculta');
    });
    
    document.getElementById(idSeccion).classList.remove('seccion-oculta');
    document.getElementById(idSeccion).classList.add('seccion-activa');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if(idSeccion === 'marcas') {
        renderizarMarcas();
    }
}

// 4. RENDERIZADO
function renderizarMarcas() {
    const contenedor = document.getElementById('grilla-marcas');
    contenedor.innerHTML = '';
    
    marcasLista.forEach(marca => {
        const div = document.createElement('div');
        div.className = 'tarjeta tarjeta-marca';
        div.onclick = () => verProductosDeMarca(marca);
        div.innerHTML = `<h3>${marca}</h3><p>Ver productos</p>`;
        contenedor.appendChild(div);
    });
}

function verProductosDeMarca(marcaSeleccionada) {
    mostrarSeccion('productos');
    document.getElementById('titulo-marca-seleccionada').innerText = `Productos: ${marcaSeleccionada}`;
    
    const contenedor = document.getElementById('grilla-productos');
    contenedor.innerHTML = '';
    
    const productosFiltrados = productosData.filter(prod => prod.marca === marcaSeleccionada);
    
    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p>Próximamente cargaremos los productos de esta marca.</p>';
        return;
    }

    productosFiltrados.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'tarjeta tarjeta-producto';
        
        let precioHTML = prod.precio && prod.precio !== "-" 
            ? `<p class="producto-precio">$${prod.precio}</p>` 
            : `<p class="producto-precio-consultar">Consultar precio</p>`;
            
        // NUEVO: Si el producto tiene 'imagen', la usa. Si no, usa una genérica.
        const imagenUrl = prod.imagen ? prod.imagen : 'imagenes/botella-generica.png';
            
        div.innerHTML = `
            <div class="contenedor-img-producto">
                <img src="${imagenUrl}" alt="${prod.nombre}" class="img-producto">
            </div>
            <h3 class="producto-nombre">${prod.nombre}</h3>
            ${precioHTML}
            <button class="boton-primario" onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

// 5. LÓGICA DEL CARRITO
let carrito = [];

function toggleCarrito() {
    document.getElementById('panel-carrito').classList.toggle('abierto');
}

function agregarAlCarrito(idProducto) {
    const producto = productosData.find(p => p.id === idProducto);
    const itemEnCarrito = carrito.find(item => item.id === idProducto);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    actualizarVistaCarrito();
    document.getElementById('panel-carrito').classList.add('abierto');
}

function cambiarCantidad(idProducto, cambio) {
    const itemEnCarrito = carrito.find(item => item.id === idProducto);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cambio;
        if (itemEnCarrito.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            actualizarVistaCarrito();
        }
    }
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const contador = document.getElementById('contador-carrito');
    
    contenedor.innerHTML = '';
    let cantidadTotal = 0;

    carrito.forEach(item => {
        cantidadTotal += item.cantidad;
        
        contenedor.innerHTML += `
            <div class="item-carrito">
                <div>
                    <strong>${item.nombre}</strong> <br>
                    <div class="control-cantidad">
                        <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span class="cantidad-numero">${item.cantidad}</span>
                        <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div>
                    <button class="btn-eliminar-item" title="Eliminar todo" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    });

    contador.innerText = cantidadTotal;
}

// 6. CHECKOUT POR WHATSAPP
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("La lista está vacía. Agregá productos antes de consultar.");
        return;
    }

    let mensaje = CONFIGURACION.mensajeWhatsAppBase;
    
    carrito.forEach(item => {
        mensaje += `- ${item.cantidad}x ${item.nombre}\n`;
    });
    
    mensaje += "\n¡Aguardó su respuesta, gracias!";

    const url = `https://wa.me/${CONFIGURACION.whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Iniciar en la pantalla principal
mostrarSeccion('inicio');