// scripts/categorias.js
// Trabaja sobre el HTML existente: añade el panel de descripción a cada .categoria
(function () {
    'use strict';

    // Selecciona todas las tarjetas ya en el DOM
    const tarjetas = document.querySelectorAll('.categorias .contenedor-categorias .categoria');
    if (!tarjetas || tarjetas.length === 0) return;

    tarjetas.forEach((tarjeta) => {
        // Obtener descripción desde data-desc o generar una por defecto usando el título
        const descText = tarjeta.getAttribute('data-desc')?.trim()
            || (() => {
                const t = tarjeta.querySelector('h3')?.textContent?.trim() || 'Descripción';
                return `Explora ${t.toLowerCase()} disponibles y frescos para ti.`;
            })();

        // Crear el contenedor descriptivo si no existe ya
        if (!tarjeta.querySelector('.descripcion-hover')) {
            const desc = document.createElement('div');
            desc.className = 'descripcion-hover';
            desc.textContent = descText;
            tarjeta.appendChild(desc);
        }

        // Hacer la tarjeta focusable para accesibilidad si no lo es
        if (!tarjeta.hasAttribute('tabindex')) {
            tarjeta.setAttribute('tabindex', '0');
        }

        // Eventos: mouseenter/mouseleave para escritorio
        tarjeta.addEventListener('mouseenter', () => {
            tarjeta.classList.add('show-desc');
        });
        tarjeta.addEventListener('mouseleave', () => {
            tarjeta.classList.remove('show-desc');
        });

        // Eventos: focus/blur para teclado
        tarjeta.addEventListener('focus', () => {
            tarjeta.classList.add('show-desc');
        }, true);
        tarjeta.addEventListener('blur', () => {
            tarjeta.classList.remove('show-desc');
        }, true);

        // Soporte táctil: al tocar, alterna la visibilidad (tap-to-toggle)
        // Evita que el primer tap dispare también click en enlaces internos si los hubiera.
        let lastTouch = 0;
        tarjeta.addEventListener('touchstart', (ev) => {
            const now = Date.now();
            if (now - lastTouch < 500) return; // evita doble toque accidental
            lastTouch = now;

            // Alternar la clase show-desc
            if (tarjeta.classList.contains('show-desc')) {
                tarjeta.classList.remove('show-desc');
            } else {
                // cerrar otras tarjetas abiertas
                document.querySelectorAll('.categoria.show-desc').forEach(el => {
                    if (el !== tarjeta) el.classList.remove('show-desc');
                });
                tarjeta.classList.add('show-desc');
            }

            // Evitar que el primer toque propague (mejor experiencia táctil)
            ev.stopPropagation();
        }, { passive: true });

    });

    // Cerrar cualquier descripción si se hace tap fuera en móvil
    document.addEventListener('touchstart', (ev) => {
        // si el target no está dentro de una .categoria, cerramos
        if (!ev.target.closest || !ev.target.closest('.categoria')) {
            document.querySelectorAll('.categoria.show-desc').forEach(el => el.classList.remove('show-desc'));
        }
    }, { passive: true });

})();
