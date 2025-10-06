// Carrito de compras
let carrito = [];

// Elementos del DOM
let sidebarCarrito, overlay, cerrarCarrito, listaCarrito, totalCarrito, btnVaciar, btnComprar, contadorCarrito;

// Precios por kilo (calculados como 2.2x el precio por libra)
const preciosKilo = {
    'piña': 5500,
    'plátano': 3960,
    'tomate': 4840,
    'papa': 3300,
    'manzana-roja': 11440,
    'bananos': 2860,
    'pera': 8360,
    'uvas': 9900,
    'mango': 4950,
    'papaya': 4840,
    'aguacate': 4950,
    'tomate-de-arbol': 3098,
    'naranja': 3740,
    'uchuva': 19800,
    'guanabana': 12012,
    'gulupa': 24750,
    'espinaca': 990,
    'lechuga': 2750
};

// Inicializar elementos del DOM cuando la página cargue
function inicializarCarrito() {
    sidebarCarrito = document.querySelector('.carrito-sidebar');
    overlay = document.querySelector('.overlay');
    cerrarCarrito = document.querySelector('.cerrar-carrito');
    listaCarrito = document.querySelector('.lista-carrito');
    totalCarrito = document.querySelector('.total-carrito');
    btnVaciar = document.querySelector('.btn-vaciar');
    btnComprar = document.querySelector('.btn-comprar');
    contadorCarrito = document.querySelector('.contador-carrito');

    // Configurar event listeners
    configurarEventListeners();

    // Cargar carrito guardado
    cargarCarrito();

    // Actualizar botones inmediatamente
    actualizarBotonesProductos();
}

// Configurar event listeners
function configurarEventListeners() {
    // Configurar cerrar carrito
    if (cerrarCarrito) {
        cerrarCarrito.addEventListener('click', cerrarCarritoHandler);
    }

    // Configurar overlay
    if (overlay) {
        overlay.addEventListener('click', cerrarCarritoHandler);
    }

    // Configurar botones del carrito
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarrito);
    }

    if (btnComprar) {
        btnComprar.addEventListener('click', finalizarCompra);
    }

    // Configurar icono del carrito
    const iconoCarrito = document.querySelector('.carrito a');
    if (iconoCarrito) {
        iconoCarrito.addEventListener('click', manejarClickCarrito);
    }
}

// Manejar click en el ícono del carrito
function manejarClickCarrito(e) {
    e.preventDefault();
    abrirCarrito();
}

// Abrir carrito
function abrirCarrito() {
    if (sidebarCarrito) {
        sidebarCarrito.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Cerrar carrito
function cerrarCarritoHandler() {
    if (sidebarCarrito) {
        sidebarCarrito.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => 
        item.id === producto.id && item.unidad === producto.unidad
    );

    if (productoExistente) {
        // Si ya existe, aumentar la cantidad
        productoExistente.cantidad += producto.cantidad;
    } else {
        // Si no existe, agregarlo al carrito
        carrito.push(producto);
    }

    // Actualizar la interfaz
    actualizarCarrito();

    // Mostrar mensaje de confirmación
    mostrarMensaje(`${producto.nombre} agregado al carrito`);

    // Abrir el carrito automáticamente
    abrirCarrito();
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    if (index >= 0 && index < carrito.length) {
        const productoEliminado = carrito[index];
        carrito.splice(index, 1);
        actualizarCarrito();
        mostrarMensaje(`${productoEliminado.nombre} eliminado del carrito`);
    }
}

// Actualizar cantidad de un producto en el carrito
function actualizarCantidad(index, cambio) {
    if (carrito[index]) {
        let nuevaCantidad = carrito[index].cantidad + cambio;
        
        // Validar mínimo
        if (nuevaCantidad < 0.1) {
            nuevaCantidad = 0.1;
        }
        
        carrito[index].cantidad = parseFloat(nuevaCantidad.toFixed(1));
        actualizarCarrito();
    }
}

// Cambiar unidad de medida en el carrito
function cambiarUnidad(index, nuevaUnidad) {
    if (carrito[index]) {
        const producto = carrito[index];

        // Si la unidad es la misma, no hacer nada
        if (producto.unidad === nuevaUnidad) return;

        // Cambiar la unidad y ajustar el precio
        producto.unidad = nuevaUnidad;

        // Actualizar precio según la unidad
        if (nuevaUnidad === 'Kg') {
            // Cambiar a kilos - usar precio por kilo
            producto.precio = preciosKilo[producto.id] || producto.precio * 2.2;
        } else {
            // Cambiar a libras - calcular precio por libra
            const precioLb = preciosKilo[producto.id] ? preciosKilo[producto.id] / 2.2 : producto.precio / 2.2;
            producto.precio = Math.round(precioLb);
        }

        actualizarCarrito();
    }
}

// Vaciar carrito
function vaciarCarrito() {
    if (carrito.length > 0) {
        carrito = [];
        actualizarCarrito();
        mostrarMensaje('Carrito vaciado');
    }
}

// Finalizar compra
function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje('Tu carrito está vacío');
        return;
    }

    mostrarMensaje('¡Gracias por tu compra!');
    vaciarCarrito();
    cerrarCarritoHandler();
}

// Actualizar contador del carrito
function actualizarContadorCarrito(cantidad) {
    const contador = document.querySelector('.contador-carrito');
    if (contador) {
        contador.textContent = Math.round(cantidad).toString();
        contador.style.display = cantidad === 0 ? 'none' : 'flex';
    }
}

// Actualizar la interfaz del carrito
function actualizarCarrito() {
    if (!listaCarrito) return;

    // Actualizar lista de productos
    listaCarrito.innerHTML = '';

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<div class="carrito-vacio">Tu carrito está vacío</div>';
        if (totalCarrito) totalCarrito.textContent = '$0';
        actualizarContadorCarrito(0);
        actualizarBotonesProductos();
        guardarCarrito();
        return;
    }

    let total = 0;
    let totalItems = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        totalItems += producto.cantidad;

        const item = document.createElement('div');
        item.className = 'item-carrito';
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="info-item">
                <h4>${producto.nombre}</h4>
                <p class="precio-unitario">$${producto.precio.toLocaleString()} x ${producto.unidad}</p>
                <div class="controles-peso">
                    <div class="selector-unidad">
                        <label>Unidad:</label>
                        <select class="unidad-select" onchange="cambiarUnidad(${index}, this.value)">
                            <option value="Lb" ${producto.unidad === 'Lb' ? 'selected' : ''}>Libra (Lb)</option>
                            <option value="Kg" ${producto.unidad === 'Kg' ? 'selected' : ''}>Kilo (Kg)</option>
                        </select>
                    </div>
                    <div class="controles-cantidad">
                        <label>Cantidad:</label>
                        <div class="botones-cantidad-mejorado">
                            <button type="button" class="btn-cantidad" onclick="actualizarCantidad(${index}, -0.5)">-½</button>
                            <button type="button" class="btn-cantidad" onclick="actualizarCantidad(${index}, -0.1)">-0.1</button>
                            <span class="cantidad-display">${producto.cantidad.toFixed(1)} ${producto.unidad}</span>
                            <button type="button" class="btn-cantidad" onclick="actualizarCantidad(${index}, 0.1)">+0.1</button>
                            <button type="button" class="btn-cantidad" onclick="actualizarCantidad(${index}, 0.5)">+½</button>
                        </div>
                    </div>
                </div>
                <p class="subtotal">Subtotal: $${Math.round(subtotal).toLocaleString()}</p>
                <button class="eliminar-item" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </div>
        `;
        listaCarrito.appendChild(item);
    });

    // Actualizar total y contador
    if (totalCarrito) totalCarrito.textContent = `$${Math.round(total).toLocaleString()}`;
    actualizarContadorCarrito(totalItems);
    actualizarBotonesProductos();
    guardarCarrito();
}

// Actualizar TODOS los botones de producto en la página
function actualizarBotonesProductos() {
    // Botones en tarjetas de producto
    const botonesProducto = document.querySelectorAll('.btn-carrito');
    botonesProducto.forEach(boton => {
        const productoCard = boton.closest('.producto-card');
        if (productoCard) {
            const nombre = productoCard.querySelector('h3').textContent;
            const id = nombre.toLowerCase().replace(/\s+/g, '-');
            const enCarrito = carrito.some(item => item.id === id);
            
            if (enCarrito) {
                boton.innerText = "Retirar 🟧";
                boton.classList.add("retirar");
            } else {
                boton.innerText = "Agregar al carrito";
                boton.classList.remove("retirar");
            }
        }
    });

    // Botones en páginas de detalle
    const botonesDetalle = document.querySelectorAll('.producto-detalle .btn-carrito');
    botonesDetalle.forEach(boton => {
        const productoDetalle = boton.closest('.producto-detalle');
        if (productoDetalle) {
            const nombre = productoDetalle.querySelector('h1').textContent;
            const id = nombre.toLowerCase().replace(/\s+/g, '-');
            const enCarrito = carrito.some(item => item.id === id);
            
            if (enCarrito) {
                boton.innerText = "Retirar del carrito 🟧";
                boton.classList.add("retirar");
            } else {
                boton.innerText = "Agregar al carrito";
                boton.classList.remove("retirar");
            }
        }
    });
}

// Función para manejar el clic en "Agregar al carrito" en tarjetas de producto
function manejarAgregarCarrito(boton) {
    const productoCard = boton.closest('.producto-card');
    const nombre = productoCard.querySelector('h3').textContent;
    const precioTexto = productoCard.querySelector('p').textContent;
    const imagen = productoCard.querySelector('img').src;

    // Extraer precio del texto
    const precioMatch = precioTexto.match(/\$ ([\d.,]+)/);
    if (!precioMatch) {
        console.error('No se pudo extraer el precio del producto');
        return;
    }

    const precio = parseFloat(precioMatch[1].replace(/\./g, '').replace(',', '.'));

    // Crear ID único para el producto
    const id = nombre.toLowerCase().replace(/\s+/g, '-');

    // Verificar si el producto ya está en el carrito
    const productoExistenteIndex = carrito.findIndex(item => item.id === id);

    if (productoExistenteIndex !== -1) {
        eliminarDelCarrito(productoExistenteIndex);
    } else {
        const producto = {
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            unidad: 'Lb',
            cantidad: 1
        };
        agregarAlCarrito(producto);
    }
}

// Función para manejar el agregar al carrito desde páginas de detalle
function manejarAgregarCarritoDetalle(boton) {
    const productoDetalle = boton.closest('.producto-detalle');
    const nombre = productoDetalle.querySelector('h1').textContent;
    const precioTexto = productoDetalle.querySelector('.producto-precio').textContent;
    const imagen = productoDetalle.querySelector('img').src;

    // Extraer precio del texto
    const precioMatch = precioTexto.match(/\$ ([\d.,]+)/);
    if (!precioMatch) {
        console.error('No se pudo extraer el precio del producto');
        return;
    }

    const precio = parseFloat(precioMatch[1].replace(/\./g, '').replace(',', '.'));

    // Crear ID único para el producto
    const id = nombre.toLowerCase().replace(/\s+/g, '-');

    // Verificar si el producto ya está en el carrito
    const productoExistenteIndex = carrito.findIndex(item => item.id === id);

    if (productoExistenteIndex !== -1) {
        eliminarDelCarrito(productoExistenteIndex);
    } else {
        const producto = {
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            unidad: 'Lb',
            cantidad: 1
        };
        agregarAlCarrito(producto);
    }
}

// Mostrar mensaje temporal
function mostrarMensaje(mensaje) {
    let mensajeElemento = document.querySelector('.mensaje-carrito');
    if (!mensajeElemento) {
        mensajeElemento = document.createElement('div');
        mensajeElemento.className = 'mensaje-carrito';
        document.body.appendChild(mensajeElemento);

        mensajeElemento.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2c7a3f;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1002;
            opacity: 0;
            transition: opacity 0.3s;
            font-family: Arial, sans-serif;
        `;
    }

    mensajeElemento.textContent = mensaje;
    mensajeElemento.style.opacity = '1';

    setTimeout(() => {
        if (mensajeElemento) {
            mensajeElemento.style.opacity = '0';
        }
    }, 3000);
}

// Guardar carrito en localStorage
function guardarCarrito() {
    try {
        localStorage.setItem('carritoFreshmarket', JSON.stringify(carrito));
    } catch (e) {
        console.error('Error al guardar el carrito:', e);
    }
}

// Cargar carrito desde localStorage
function cargarCarrito() {
    try {
        const carritoGuardado = localStorage.getItem('carritoFreshmarket');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarrito();
        }
    } catch (e) {
        console.error('Error al cargar el carrito:', e);
        carrito = [];
    }
}

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', inicializarCarrito);

// Hacer las funciones disponibles globalmente
window.manejarAgregarCarrito = manejarAgregarCarrito;
window.manejarAgregarCarritoDetalle = manejarAgregarCarritoDetalle;
window.actualizarCantidad = actualizarCantidad;
window.cambiarUnidad = cambiarUnidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.abrirCarrito = abrirCarrito;