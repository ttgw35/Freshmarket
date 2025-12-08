// Carrito Freshmarket - v2 (versión corregida y consolidada)
// Reemplaza TODO tu script actual por este. Comentarios explican cambios clave.

let carrito = [];

// DOM (se inicializan en inicializarCarrito)
let sidebarCarrito, overlay, cerrarCarrito, listaCarrito, totalCarrito, btnVaciar,
  btnComprar, contadorCarrito;

const LB_POR_KG = 2.20462;

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

// Guard para listeners idempotente
let listenersConfigured = false;

function inicializarCarrito() {
  sidebarCarrito = document.querySelector('.carrito-sidebar');
  overlay = document.querySelector('.overlay');
  cerrarCarrito = document.querySelector('.cerrar-carrito');
  listaCarrito = document.querySelector('.lista-carrito');
  totalCarrito = document.querySelector('.total-carrito');
  btnVaciar = document.querySelector('.btn-vaciar');
  btnComprar = document.querySelector('.btn-comprar');
  contadorCarrito = document.querySelector('.contador-carrito');

  configurarEventListeners();
  cargarCarrito();
  actualizarBotonesProductos();

  // Seguridad: limpiar estilos inline peligrosos si los tuviera
  if (sidebarCarrito) {
    sidebarCarrito.style.top = '';
    sidebarCarrito.style.right = '';
    sidebarCarrito.style.transform = '';
  }
}

/* -------------------------
   CONFIGURAR EVENT LISTENERS (una sola definición, idempotente)
   ------------------------- */
function configurarEventListeners() {
  if (listenersConfigured) return;
  listenersConfigured = true;

  if (cerrarCarrito) cerrarCarrito.addEventListener('click', cerrarCarritoHandler);
  if (overlay) overlay.addEventListener('click', cerrarCarritoHandler);
  if (btnVaciar) btnVaciar.addEventListener('click', vaciarCarrito);
  if (btnComprar) btnComprar.addEventListener('click', finalizarCompra);

  // Icono del carrito: seleccionamos el elemento que tenga la clase .carrito (mejor ser 
  // específico en tu HTML, ej: .carrito-toggle)
  const iconoCarrito = document.querySelector('.carrito, .carrito a, .carrito img, .carrito-toggle');
  if (iconoCarrito) {
    iconoCarrito.addEventListener('click', function (e) {
      // si se hizo click en un enlace real (que navega) permitimos navegación
      const anchor = e.target.closest('a');
      if (anchor && anchor.getAttribute('href') && anchor.getAttribute('href') !== '#') {
        // permitir navegación normal
        return;
      }
      e.preventDefault();
      abrirCarrito();
    });
  }

  // Observador para mantener pointer-events sincronizado (solo en overlay)
  if (overlay) {
    const observer = new MutationObserver(() => {
      overlay.style.pointerEvents = overlay.classList.contains('active') ? 'auto' : 'none';
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    window.__carritoOverlayObserver = observer;
  }
}

/* -------------------------
   ABRIR / CERRAR (unificado y seguro)
   ------------------------- */
function abrirCarrito() {
  if (!sidebarCarrito || !overlay) return;
  sidebarCarrito.classList.add('active');
  overlay.classList.add('active');

  // bloqueo de scroll por clase -> se recomienda añadir .no-scroll { overflow:hidden; } en CSS
  document.body.classList.add('no-scroll');

  // pointer-events por clase (no confiar exclusivamente en inline)
  overlay.style.pointerEvents = 'auto';
}

function cerrarCarritoHandler() {
  if (!sidebarCarrito || !overlay) return;
  sidebarCarrito.classList.remove('active');
  overlay.classList.remove('active');

  document.body.classList.remove('no-scroll');

  // dejar pointer-events none después de la animación para evitar bloquear clicks
  setTimeout(() => {
    if (!overlay.classList.contains('active')) overlay.style.pointerEvents = 'none';
  }, 300); // coincidir con tu transición CSS
}

/* -------------------------
   LÓGICA DEL CARRITO
   ------------------------- */

function roundToTwo(num) {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
}

function pasoInteligente(cantidadActual) {
  return (cantidadActual < 1) ? 0.1 : 0.5;
}

// Añadir producto: AHORA buscamos por id **ignorando unidad** para evitar duplicados
function agregarAlCarrito(producto) {
  if (producto.precioBaseLb === undefined) {
    producto.precioBaseLb = Number(producto.precio);
  }

  // Buscamos por ID únicamente (evita duplicados si el usuario cambió unidad)
  const productoExistente = carrito.find(item => item.id === producto.id);

  if (productoExistente) {
    productoExistente.cantidad = roundToTwo(productoExistente.cantidad + producto.cantidad);
  } else {
    producto.cantidad = roundToTwo(producto.cantidad || 1);
    producto.unidad = producto.unidad || 'Lb';
    if (producto.unidad === 'Kg') {
      producto.precio = preciosKilo[producto.id] ? Number(preciosKilo[producto.id]) : roundToTwo(producto.precioBaseLb * LB_POR_KG);
    } else {
      producto.precio = roundToTwo(producto.precioBaseLb);
    }
    carrito.push(producto);
  }

  actualizarCarrito();
  mostrarMensaje(`${producto.nombre} agregado al carrito`);
  abrirCarrito();
}

// Eliminar por índice actual (se usa desde listeners añadidos en render para evitar índices stale)
function eliminarDelCarrito(index) {
  if (index >= 0 && index < carrito.length) {
    const productoEliminado = carrito[index];
    carrito.splice(index, 1);
    actualizarCarrito();
    mostrarMensaje(`${productoEliminado.nombre} eliminado del carrito`);
  }
}

// actualizar cantidad usando index (se mantienen closures seguras desde el render)
function actualizarCantidad(index, cambio) {
  if (!carrito[index]) return;
  let actual = Number(carrito[index].cantidad || 0.1);
  if (cambio === 'inc' || cambio === 'dec') {
    const step = pasoInteligente(actual);
    actual = (cambio === 'inc') ? (actual + step) : (actual - step);
  } else if (typeof cambio === 'number') {
    actual = actual + cambio;
  } else {
    const maybeNum = Number(cambio);
    if (!isNaN(maybeNum)) actual = maybeNum;
  }
  if (actual < 0.1) actual = 0.1;
  carrito[index].cantidad = roundToTwo(actual);
  actualizarCarrito();
}

function actualizarCantidadDirecto(index, valor) {
  if (!carrito[index]) return;
  let v = Number(valor);
  if (isNaN(v) || v < 0.1) v = 0.1;
  carrito[index].cantidad = roundToTwo(v);
  actualizarCarrito();
}

function cambiarUnidad(index, nuevaUnidad) {
  if (!carrito[index]) return;
  const producto = carrito[index];

  if (producto.unidad === nuevaUnidad) return;

  if (producto.precioBaseLb === undefined || isNaN(producto.precioBaseLb)) {
    if (producto.unidad === 'Kg') {
      producto.precioBaseLb = roundToTwo((producto.precio || 0) / LB_POR_KG);
    } else {
      producto.precioBaseLb = roundToTwo(producto.precio || 0);
    }
  }

  producto.unidad = nuevaUnidad;

  if (nuevaUnidad === 'Kg') {
    if (preciosKilo[producto.id]) {
      producto.precio = Number(preciosKilo[producto.id]);
    } else {
      producto.precio = roundToTwo(producto.precioBaseLb * LB_POR_KG);
    }
  } else {
    if (preciosKilo[producto.id]) {
      producto.precio = roundToTwo(Number(preciosKilo[producto.id]) / LB_POR_KG);
      producto.precioBaseLb = roundToTwo(producto.precio);
    } else {
      producto.precio = roundToTwo(producto.precioBaseLb);
    }
  }

  actualizarCarrito();
}

function vaciarCarrito() {
  if (carrito.length > 0) {
    carrito = [];
    actualizarCarrito();
    mostrarMensaje('Carrito vaciado');
  }
}

function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje('Tu carrito está vacío');
    return;
  }
  window.location.href = 'pago.html';
}

function actualizarContadorCarrito() {
  const contador = document.querySelector('.contador-carrito');
  if (!contador) return;
  const count = carrito.length || 0;
  if (count <= 0) {
    contador.classList.add('hidden');
    contador.textContent = '0';
  } else {
    contador.classList.remove('hidden');
    contador.textContent = String(count);
  }
}

function mostrarMensaje(mensaje) {
  let mensajeElemento = document.querySelector('.mensaje-carrito');

  // Si no existe el elemento, lo creamos (pero oculto por defecto)
  if (!mensajeElemento) {
    mensajeElemento = document.createElement('div');
    mensajeElemento.className = 'mensaje-carrito';
    document.body.appendChild(mensajeElemento);

    // Estilos base: oculto y sin captura de eventos por defecto
    mensajeElemento.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #EDB41C;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1002;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      font-family: Arial, sans-serif;
      font-weight:700;
      pointer-events: none; /* importante: por defecto no captura clicks */
      transform: translateY(-8px);
    `;
  }

  // Actualiza texto y muestra el mensaje
  mensajeElemento.textContent = mensaje;

  // Mostrar: activamos pointer-events mientras se ve
  mensajeElemento.style.pointerEvents = 'auto';
  mensajeElemento.style.opacity = '1';
  mensajeElemento.style.transform = 'translateY(0)';

  // Después del tiempo, ocultamos y quitamos pointer-events
  setTimeout(() => {
    // Hacemos la transición de salida
    mensajeElemento.style.opacity = '0';
    mensajeElemento.style.transform = 'translateY(-8px)';
    // Desactivar pointer-events para que no bloquee
    mensajeElemento.style.pointerEvents = 'none';
    // (Opcional) remover del DOM tras la transición para limpiar
    setTimeout(() => {
      // si quieres que quede permanentemente en DOM, comenta la línea siguiente
      if (mensajeElemento && mensajeElemento.parentNode) {
        mensajeElemento.parentNode.removeChild(mensajeElemento);
      }
    }, 350); // esperar a que termine la transición
  }, 2400);
}


function guardarCarrito() {
  try {
    localStorage.setItem('carritoFreshmarket', JSON.stringify(carrito));
  } catch (e) {
    console.error('Error al guardar el carrito:', e);
  }
}

function cargarCarrito() {
  try {
    const carritoGuardado = localStorage.getItem('carritoFreshmarket');
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado) || [];
      carrito = carrito.map(p => {
        p.cantidad = Number(p.cantidad) || 0.1;
        p.precioBaseLb = p.precioBaseLb !== undefined ? Number(p.precioBaseLb) : (p.precio || 0);
        p.precio = Number(p.precio) || p.precioBaseLb;
        p.unidad = p.unidad || 'Lb';
        return p;
      });
      actualizarCarrito();
    }
  } catch (e) {
    console.error('Error al cargar el carrito:', e);
    carrito = [];
  }
}

/* -------------------------
   RENDERIZADO DEL CARRITO (mejor manejo de listeners, sin onclick inline)
   ------------------------- */
function actualizarCarrito() {
  if (!listaCarrito) return;
  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<div class="carrito-vacio">Tu carrito está vacío</div>';
    if (totalCarrito) totalCarrito.textContent = '$0';
    actualizarContadorCarrito();
    actualizarBotonesProductos();
    guardarCarrito();
    return;
  }

  let total = 0;

  carrito.forEach((producto, index) => {
    producto.cantidad = Number(producto.cantidad) || 0.1;
    producto.precio = Number(producto.precio) || 0;

    const subtotal = roundToTwo(producto.precio * producto.cantidad);
    total += subtotal;

    const item = document.createElement('div');
    item.className = 'item-carrito';
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="info-item">
        <h4>${producto.nombre}</h4>
        <p class="precio-unitario">$${Number(producto.precio).toLocaleString()} x ${producto.unidad}</p>
        <div class="controles-peso">
          <div class="selector-unidad">
            <label>Unidad:</label>
            <select class="unidad-select">
              <option value="Lb" ${producto.unidad === 'Lb' ? 'selected' : ''}>Libra (Lb)</option>
              <option value="Kg" ${producto.unidad === 'Kg' ? 'selected' : ''}>Kilo (Kg)</option>
            </select>
          </div>
          <div class="controles-cantidad" style="flex:1;">
            <label>Cantidad:</label>
            <div class="cantidad-control" style="display:flex; align-items:center; gap:10px; margin-top:6px;">
              <button type="button" class="btn-menos btn-cantidad">−</button>
              <div style="min-width:110px; text-align:center; background:#f6f7f8; padding:8px 12px; border-radius:10px; font-weight:800;">
                <span class="cantidad-display">${producto.cantidad.toFixed(2)}</span> <small style="color:#666; margin-left:6px;">${producto.unidad}</small>
              </div>
              <button type="button" class="btn-mas btn-cantidad">+</button>
            </div>
            <input type="range" min="0.1" step="0.1" value="${producto.cantidad}" class="slider-cantidad" style="width:100%; margin-top:10px;">
          </div>
        </div>
        <p class="subtotal">Subtotal: $${Number(subtotal).toLocaleString()}</p>
        <button class="eliminar-item">Eliminar</button>
      </div>
    `;
    listaCarrito.appendChild(item);

    // Añadimos listeners aquí (evita índices "stale" y onclick inline)
    const btnMas = item.querySelector('.btn-mas');
    const btnMenos = item.querySelector('.btn-menos');
    const slider = item.querySelector('.slider-cantidad');
    const selectUnidad = item.querySelector('.unidad-select');
    const btnEliminar = item.querySelector('.eliminar-item');

    btnMas && btnMas.addEventListener('click', () => actualizarCantidad(index, 'inc'));
    btnMenos && btnMenos.addEventListener('click', () => actualizarCantidad(index, 'dec'));
    slider && slider.addEventListener('input', (e) => actualizarCantidadDirecto(index, e.target.value));
    selectUnidad && selectUnidad.addEventListener('change', (e) => cambiarUnidad(index, e.target.value));
    btnEliminar && btnEliminar.addEventListener('click', () => eliminarDelCarrito(index));
  });

  if (totalCarrito) totalCarrito.textContent = `$${Math.round(total).toLocaleString()}`;
  actualizarContadorCarrito();
  actualizarBotonesProductos();
  guardarCarrito();
}

/* -------------------------
   Sincronizar botones de productos (cards y detalle)
   - ahora comprobamos existencia por ID (no por unidad) para evitar duplicados.
   ------------------------- */
function actualizarBotonesProductos() {
  const botonesProducto = document.querySelectorAll('.btn-carrito');
  botonesProducto.forEach(boton => {
    const productoCard = boton.closest('.producto-card');
    if (productoCard) {
      const nombre = productoCard.querySelector('h3').textContent;
      const id = nombre.toLowerCase().replace(/\s+/g, '-');
      const enCarrito = carrito.some(item => item.id === id);

      if (enCarrito) {
        boton.innerText = "Retirar";
        boton.classList.add("retirar");
      } else {
        boton.innerText = "Agregar al carrito";
        boton.classList.remove("retirar");
      }

      // asegurar que el botón use la función global manejarAgregarCarrito al click
      boton.removeEventListener('click', boton._handler);
      boton._handler = () => manejarAgregarCarrito(boton);
      boton.addEventListener('click', boton._handler);
    }
  });

  const botonesDetalle = document.querySelectorAll('.producto-detalle .btn-carrito');
  botonesDetalle.forEach(boton => {
    const productoDetalle = boton.closest('.producto-detalle');
    if (productoDetalle) {
      const nombre = productoDetalle.querySelector('h1').textContent;
      const id = nombre.toLowerCase().replace(/\s+/g, '-');
      const enCarrito = carrito.some(item => item.id === id);

      if (enCarrito) {
        boton.innerText = "Retirar del carrito";
        boton.classList.add("retirar");
      } else {
        boton.innerText = "Agregar al carrito";
        boton.classList.remove("retirar");
      }

      boton.removeEventListener('click', boton._handler);
      boton._handler = () => manejarAgregarCarritoDetalle(boton);
      boton.addEventListener('click', boton._handler);
    }
  });
}

/* -------------------------
   Manejo de botones (cards / detalle)
   - ahora buscamos existencia por id únicamente (no por unidad)
   ------------------------- */

function manejarAgregarCarrito(boton) {
  const productoCard = boton.closest('.producto-card');
  const nombre = productoCard.querySelector('h3').textContent;
  const imagenEl = productoCard.querySelector('img');
  const imagen = imagenEl ? imagenEl.src : '';
  let precios = productoCard.querySelectorAll('p');
  let precio = null;

  precios.forEach(p => {
    const matches = p.textContent.match(/\$ *([\d.,]+)/g);
    if (matches) {
      matches.forEach(m => {
        const val = parseFloat(m.replace(/\$/g, '').replace(/\./g, '').replace(',', '.'));
        if (!isNaN(val)) precio = val;
      });
    }
  });

  if (precio === null) {
    console.error("No se encontró un precio válido en la tarjeta");
    return;
  }

  const id = nombre.toLowerCase().replace(/\s+/g, '-');

  const productoExistenteIndex = carrito.findIndex(item => item.id === id);

  if (productoExistenteIndex !== -1) {
    // quitar
    eliminarDelCarrito(productoExistenteIndex);
  } else {
    const producto = {
      id: id,
      nombre: nombre,
      precio: precio,
      precioBaseLb: precio,
      imagen: imagen,
      unidad: 'Lb',
      cantidad: 1
    };
    agregarAlCarrito(producto);
  }
}

function manejarAgregarCarritoDetalle(boton) {
  const productoDetalle = boton.closest('.producto-detalle');
  const nombre = productoDetalle.querySelector('h1').textContent;
  const precioTexto = productoDetalle.querySelector('.producto-precio').textContent;
  const imagenEl = productoDetalle.querySelector('img');
  const imagen = imagenEl ? imagenEl.src : '';

  const precioMatch = precioTexto.match(/\$ *([\d.,]+)/);
  if (!precioMatch) {
    console.error('No se pudo extraer el precio del producto');
    return;
  }

  const precio = parseFloat(precioMatch[1].replace(/\./g, '').replace(',', '.'));
  const id = nombre.toLowerCase().replace(/\s+/g, '-');

  const productoExistenteIndex = carrito.findIndex(item => item.id === id);

  if (productoExistenteIndex !== -1) {
    eliminarDelCarrito(productoExistenteIndex);
  } else {
    const producto = {
      id: id,
      nombre: nombre,
      precio: precio,
      precioBaseLb: precio,
      imagen: imagen,
      unidad: 'Lb',
      cantidad: 1
    };
    agregarAlCarrito(producto);
  }
}

/* -------------------------
   Inicialización
   ------------------------- */
document.addEventListener('DOMContentLoaded', inicializarCarrito);

// Exponer funciones globales necesarias (si tu HTML espera llamadas globales)
window.manejarAgregarCarrito = manejarAgregarCarrito;
window.manejarAgregarCarritoDetalle = manejarAgregarCarritoDetalle;
window.actualizarCantidad = actualizarCantidad;
window.cambiarUnidad = cambiarUnidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.abrirCarrito = abrirCarrito;




// Script para herovideo 

const video = document.getElementById("hero-video");
const btn = document.getElementById("play-pause-btn");

btn.addEventListener("click", () => {
    if (video.paused) {
        video.play();
        btn.classList.remove("play");
    } else {
        video.pause();
        btn.classList.add("play");
    }
});

