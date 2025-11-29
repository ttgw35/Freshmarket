// ------------------------------
// Carrito Freshmarket - v2
// Integración: botones +/-, slider, conversión Kg/Lb, pasos inteligentes
// Reemplaza tu script actual por completo con este
// ------------------------------

let carrito = [];

// DOM (se inicializan en inicializarCarrito)
let sidebarCarrito, overlay, cerrarCarrito, listaCarrito, totalCarrito, btnVaciar,
    btnComprar, contadorCarrito;

// Factor de conversión
const LB_POR_KG = 2.20462;

// Mapa de precios por kilo (si existe preferimos usarlo para Kg)
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

// Inicialización
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

// Listeners
function configurarEventListeners() {
  if (cerrarCarrito) cerrarCarrito.addEventListener('click', cerrarCarritoHandler);
  if (overlay) overlay.addEventListener('click', cerrarCarritoHandler);
  if (btnVaciar) btnVaciar.addEventListener('click', vaciarCarrito);
  if (btnComprar) btnComprar.addEventListener('click', finalizarCompra);

  const iconoCarrito = document.querySelector('.carrito a, .carrito img, .carrito');
  if (iconoCarrito) {
    iconoCarrito.addEventListener('click', function (e) {
      e.preventDefault();
      abrirCarrito();
    });
  }
}

function abrirCarrito() {
  if (sidebarCarrito) {
    sidebarCarrito.classList.add('active');
    overlay && overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function cerrarCarritoHandler() {
  if (sidebarCarrito) {
    sidebarCarrito.classList.remove('active');
    overlay && overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Añadir producto (cards usan manejarAgregarCarrito y detalles usan manejarAgregarCarritoDetalle)
function agregarAlCarrito(producto) {
  // GuardamosprecioBaseLb para conversiones: si viene precio en {precio} asumimos es por Libra
  if (producto.precioBaseLb === undefined) {
    producto.precioBaseLb = Number(producto.precio); // precio que pasas al crear producto (por Lb)
  }

  // Checar existencia por id+unidad (cada unidad separada)
  const productoExistente = carrito.find(item =>
    item.id === producto.id && item.unidad === producto.unidad
  );

  if (productoExistente) {
    productoExistente.cantidad = roundToTwo(productoExistente.cantidad + producto.cantidad);
  } else {
    // Normalizar campos mínimos
    producto.cantidad = roundToTwo(producto.cantidad || 1);
    producto.unidad = producto.unidad || 'Lb';
    // Garantizar precio actual por unidad (según unidad)
    if (producto.unidad === 'Kg') {
      // preferimos precio por kilo del mapa si existe
      producto.precio = preciosKilo[producto.id] ? Number(preciosKilo[producto.id]) : roundToTwo(producto.precioBaseLb * LB_POR_KG);
    } else {
      producto.precio = roundToTwo(producto.precioBaseLb); // por libra
    }
    carrito.push(producto);
  }

  actualizarCarrito();
  mostrarMensaje(`${producto.nombre} agregado al carrito`);
  abrirCarrito();
}

// Eliminar por índice
function eliminarDelCarrito(index) {
  if (index >= 0 && index < carrito.length) {
    const productoEliminado = carrito[index];
    carrito.splice(index, 1);
    actualizarCarrito();
    mostrarMensaje(`${productoEliminado.nombre} eliminado del carrito`);
  }
}

// Devuelve el paso según cantidad actual (regla B: <1 => 0.1, >=1 => 0.5)
function pasoInteligente(cantidadActual) {
  return (cantidadActual < 1) ? 0.1 : 0.5;
}

// Actualizar cantidad por botones (uso 'inc' y 'dec') o por delta numérico
function actualizarCantidad(index, cambio) {
  if (!carrito[index]) return;

  let actual = Number(carrito[index].cantidad || 0.1);
  if (cambio === 'inc' || cambio === 'dec') {
    const step = pasoInteligente(actual);
    actual = (cambio === 'inc') ? (actual + step) : (actual - step);
  } else if (typeof cambio === 'number') {
    actual = actual + cambio;
  } else {
    // si llegó un string numérico
    const maybeNum = Number(cambio);
    if (!isNaN(maybeNum)) actual = maybeNum;
  }

  if (actual < 0.1) actual = 0.1; // mínimo seguro
  // Redondeamos internamente a 2 decimales
  carrito[index].cantidad = roundToTwo(actual);

  // Si quisiéramos permitir 0 => eliminar, podríamos, pero mantengo mínimo 0.1
  actualizarCarrito();
}

// Actualizar cantidad directo (slider)
function actualizarCantidadDirecto(index, valor) {
  if (!carrito[index]) return;
  let v = Number(valor);
  if (isNaN(v) || v < 0.1) v = 0.1;
  carrito[index].cantidad = roundToTwo(v);
  actualizarCarrito();
}

// Cambiar unidad (Kg/Lb) y recalcular precio por unidad
function cambiarUnidad(index, nuevaUnidad) {
  if (!carrito[index]) return;
  const producto = carrito[index];

  if (producto.unidad === nuevaUnidad) return;

  // Si no tenemos precioBaseLb (ej legacy), crear uno usando precio actual
  if (producto.precioBaseLb === undefined || isNaN(producto.precioBaseLb)) {
    if (producto.unidad === 'Kg') {
      // si estaba en Kg, calcular base lb
      producto.precioBaseLb = roundToTwo((producto.precio || 0) / LB_POR_KG);
    } else {
      producto.precioBaseLb = roundToTwo(producto.precio || 0);
    }
  }

  producto.unidad = nuevaUnidad;

  if (nuevaUnidad === 'Kg') {
    // si existe precio por kilo conocido en el mapa lo usamos (autoridad), si no calculamos
    if (preciosKilo[producto.id]) {
      producto.precio = Number(preciosKilo[producto.id]);
    } else {
      producto.precio = roundToTwo(producto.precioBaseLb * LB_POR_KG);
    }
  } else {
    // volver a libras
    if (preciosKilo[producto.id]) {
      // precio por kg fue proveído; convertir a lb
      producto.precio = roundToTwo(Number(preciosKilo[producto.id]) / LB_POR_KG);
      // también mantener precioBaseLb consistente
      producto.precioBaseLb = roundToTwo(producto.precio);
    } else {
      producto.precio = roundToTwo(producto.precioBaseLb);
    }
  }

  actualizarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
  if (carrito.length > 0) {
    carrito = [];
    actualizarCarrito();
    mostrarMensaje('Carrito vaciado');
  }
}

// Finalizar compra (redirigir)
function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje('Tu carrito está vacío');
    return;
  }
  // Mantener comportamiento anterior
  window.location.href = 'pago.html';
}

// Actualizar contador (ahora muestra número de productos, no suma de cantidades)
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

// Función util: redondeo a 2 decimales (evita errores de punto flotante)
function roundToTwo(num) {
  return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
}

// Actualizar la UI del carrito (render)
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
    // asegurar campos
    producto.cantidad = Number(producto.cantidad) || 0.1;
    producto.precio = Number(producto.precio) || 0;

    const subtotal = roundToTwo(producto.precio * producto.cantidad);
    total += subtotal;

    // Construir HTML con botones +/-, display y slider
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
            <select class="unidad-select" onchange="cambiarUnidad(${index}, this.value)">
              <option value="Lb" ${producto.unidad === 'Lb' ? 'selected' : ''}>Libra (Lb)</option>
              <option value="Kg" ${producto.unidad === 'Kg' ? 'selected' : ''}>Kilo (Kg)</option>
            </select>
          </div>

          <div class="controles-cantidad" style="flex:1;">
            <label>Cantidad:</label>
            <div class="cantidad-control" style="display:flex; align-items:center; gap:10px; margin-top:6px;">
              <button type="button" class="btn-menos btn-cantidad" onclick="actualizarCantidad(${index}, 'dec')">−</button>
              <div style="min-width:110px; text-align:center; background:#f6f7f8; padding:8px 12px; border-radius:10px; font-weight:800;">
                <span class="cantidad-display">${producto.cantidad.toFixed(2)}</span> <small style="color:#666; margin-left:6px;">${producto.unidad}</small>
              </div>
              <button type="button" class="btn-mas btn-cantidad" onclick="actualizarCantidad(${index}, 'inc')">+</button>
            </div>

            <!-- Slider (paso 0.1 para precisión, la lógica de pasos "rápidos" la dan los botones) -->
            <input type="range" min="0.1" step="0.1" value="${producto.cantidad}" oninput="actualizarCantidadDirecto(${index}, this.value)" class="slider-cantidad" style="width:100%; margin-top:10px;">
          </div>
        </div>

        <p class="subtotal">Subtotal: $${Number(subtotal).toLocaleString()}</p>

        <button class="eliminar-item" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </div>
    `;
    listaCarrito.appendChild(item);
  });

  if (totalCarrito) totalCarrito.textContent = `$${Math.round(total).toLocaleString()}`;
  actualizarContadorCarrito();
  actualizarBotonesProductos();
  guardarCarrito();
}

// Actualizar todos los botones de producto (mantener tu lógica)
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
    }
  });
}

// Manejar agregar desde cards
function manejarAgregarCarrito(boton) {
    const productoCard = boton.closest('.producto-card');
    const nombre = productoCard.querySelector('h3').textContent;

    // Recuperar imagen correctamente
    const imagen = productoCard.querySelector('img').src;

    // Buscar precios dentro de la tarjeta
    let precios = productoCard.querySelectorAll('p');

    // Tomar el ÚLTIMO precio válido dentro de los <p>
    let precio = null;

    precios.forEach(p => {
        const matches = p.textContent.match(/\$ *([\d.,]+)/g);
        if (matches) {
            matches.forEach(m => {
                const val = parseFloat(m.replace(/\$/g, '').replace(/\./g, '').replace(',', '.'));
                if (!isNaN(val)) precio = val; // siempre el último precio válido
            });
        }
    });

    if (precio === null) {
        console.error("No se encontró un precio válido en la tarjeta");
        return;
    }

    const id = nombre.toLowerCase().replace(/\s+/g, '-');

    const productoExistenteIndex = carrito.findIndex(
        item => item.id === id && item.unidad === 'Lb'
    );

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


// Manejar agregar desde detalle (mantengo el nombre)
function manejarAgregarCarritoDetalle(boton) {
  const productoDetalle = boton.closest('.producto-detalle');
  const nombre = productoDetalle.querySelector('h1').textContent;
  const precioTexto = productoDetalle.querySelector('.producto-precio').textContent;
  const imagen = productoDetalle.querySelector('img').src;

  const precioMatch = precioTexto.match(/\$ *([\d.,]+)/);
  if (!precioMatch) {
    console.error('No se pudo extraer el precio del producto');
    return;
  }

  const precio = parseFloat(precioMatch[1].replace(/\./g, '').replace(',', '.'));
  const id = nombre.toLowerCase().replace(/\s+/g, '-');

  const productoExistenteIndex = carrito.findIndex(item => item.id === id && item.unidad === 'Lb');

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

// Mensaje temporal (mantengo tu función)
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
      background: #EDB41C;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1002;
      opacity: 0;
      transition: opacity 0.3s;
      font-family: Arial, sans-serif;
      font-weight:700;
    `;
  }

  mensajeElemento.textContent = mensaje;
  mensajeElemento.style.opacity = '1';

  setTimeout(() => {
    if (mensajeElemento) mensajeElemento.style.opacity = '0';
  }, 2600);
}

// Guardar / Cargar localStorage
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
      // Asegurar campos mínimos para compatibilidad con versiones previas
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

// Inicializar en DOMContentLoaded
document.addEventListener('DOMContentLoaded', inicializarCarrito);

// Exponer funciones globales esperadas por el HTML
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

