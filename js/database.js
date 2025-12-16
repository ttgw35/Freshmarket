 // Base de datos de productos para búsqueda
    const productosDB = [
      {
        id: 'piña',
        nombre: 'Piña',
        precio: 2500,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764253450/pina_aydnsk.png',
        categoria: 'Frutas',
        url: 'piña.html'
      },
      {
        id: 'plátano',
        nombre: 'Plátano',
        precio: 1800,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764254939/platano_h59awc.png',
        categoria: 'verdura',
        url: 'platano.html'
      },
      {
        id: 'Gulupa',
        nombre: 'Gulupa',
        precio: 9000,
        imagen: 'img/gulupa.png',
        categoria: 'Frutas',
        url: 'gulupa.html'
      },
       {
        id: 'zanahoria',
        nombre: 'zanahoria',
        precio: 3320,
        imagen: 'img/zanahoria.png',
        categoria: 'verduras',
        url: 'zanahoria.html'
      },
       {
        id: 'remolacha',
        nombre: 'remolacha',
        precio: 2790,
        imagen: 'img/remolacha.png',
        categoria: 'verduras',
        url: 'remolacha.html'
      },
       {
        id: 'lulo',
        nombre: 'Lulo',
        precio: 3050,
        imagen: 'img/lulo.granel.png',
        categoria: 'Jugos',
        url: 'lulo.html'
      },
       {
        id: 'Mora',
        nombre: 'Mora',
        precio: 6200,
        imagen: 'img/mora.png',
        categoria: 'Jugos',
        url: 'mora.html'
      },
      {
        id: 'Oregano',
        nombre: 'Orégano',
        precio: 790,
        imagen: 'img/oregano.png',
        categoria: 'Hierbas',
        url: 'oregano.html'
      },
       {
        id: 'Pulpa de mango',
        nombre: 'Pulpa de mango',
        precio: 1720,
        imagen: 'img/pulpa mango.png',
        categoria: 'Pulpas',
        url: 'pulpa-de-mango.html'
      },
       {
        id: 'Pulpa de maracuyá',
        nombre: 'Pulpa de maracuyá',
        precio: 3400,
        imagen: 'img/pulpa maracuyá.png',
        categoria: 'Pulpas',
        url: 'pulpa-de-maracuya.html'
      },
      {
        id: 'Tomate de árbol',
        nombre: 'Tomate de árbol',
        precio: 1400,
        imagen: 'img/tomate de arbol.jpg',
        categoria: 'frutas',
        url: 'tomatearbol.html'
      },
      {
        id: 'Albahaca',
        nombre: 'Albahaca',
        precio: 2200,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764078820/albahaca_estwf5.png',
        categoria: 'Hierbas aromáticas',
        url: 'albahaca.html'
      },
      {
        id: 'Hierbabuena',
        nombre: 'Hierbabuena',
        precio: 5200,
        imagen: 'img/hierbabuena.png',
        categoria: 'Hierbas medicinales',
        url: 'hierbabuena.html'
      },
      {
        id: 'Naranja',
        nombre: 'Naranja',
        precio: 1700,
        imagen: 'img/naranja.jpg',
        categoria: 'frutas',
        url: 'naranja.html'
      },
      {
        id: 'Manzanilla',
        nombre: 'Manzanilla',
        precio: 3200,
        imagen: 'img/manzanilla.png',
        categoria: 'hierbas',
        url: 'manzanilla.html'
      },
      {
        id: 'Limon Tahití',
        nombre: 'limón',
        precio: 2320,
        imagen: 'img/limon.png',
        categoria: 'oferta',
        url: 'limon.html'
      },
      {
        id: 'Cebolla cabezona',
        nombre: 'Cebolla cabezona',
        precio: 2170,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764079379/cebolla_cabezona_j2bueo.png',
        categoria: 'oferta',
        url: 'cebolla.html'
      },
      {
        id: 'granadilla',
        nombre: 'granadilla',
        precio: 4524,
        imagen: 'img/granadilla.png',
        categoria: 'oferta',
        url: 'granadilla.html'
      },
      {
        id: 'tomate',
        nombre: 'Tomate',
        precio: 2200,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764254995/tomate_ehruk8.png',
        categoria: 'Verduras',
        url: 'tomate.html'
      },
      {
        id: 'papa',
        nombre: 'Papa parda',
        precio: 1500,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764265320/papa_orvfi2.png',
        categoria: 'Tubérculos',
        url: 'papa.html'
      },
      {
        id: 'mango',
        nombre: 'Mango',
        precio: 2250,
        imagen: 'img/mango.png',
        categoria: 'Frutas Tropicales',
        url: 'mango.html'
      },
      {
        id: 'papaya',
        nombre: 'Papaya',
        precio: 2200,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764364147/papaya_kgodc2.png',
        categoria: 'Frutas Tropicales',
        url: 'papaya.html'
      },
      {
        id: 'Guanabana',
        nombre: 'guanábana',
        precio: 5460,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764364111/guanaba_iicr0o.png',
        categoria: 'Frutas poco comunes',
        url: 'guanabana.html'
      },
      {
        id: 'aguacate',
        nombre: 'Aguacate',
        precio: 2250,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764078601/aguacate_cuaxuw.png',
        categoria: 'Frutas Tropicales',
        url: 'aguacate.html'
      },
      {
        id: 'manzana-roja',
        nombre: 'Manzana Roja',
        precio: 5200,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764363788/manzana_roja_iykvao.png',
        categoria: 'Productos Frescos',
        url: 'manzana.html'
      },
      {
        id: 'bananos',
        nombre: 'Bananos',
        precio: 1300,
        imagen: 'https://res.cloudinary.com/ditgyvcpf/image/upload/v1764079380/banano_silzty.png',
        categoria: 'Productos Frescos',
        url: 'banano.html'
      },
      {
        id: 'uchuva',
        nombre: 'Uchuva',
        precio: 9000,
        imagen: 'img/uchuva.png',
        categoria: 'Frutas Poco Comunes',
        url: 'uchuva.html'
      },
      {
        id: 'espinaca',
        nombre: 'Espinaca',
        precio: 450,
        imagen: 'img/espinaca.png',
        categoria: 'Verduras',
        url: 'espinaca.html'
      },
      {
        id: 'lechuga',
        nombre: 'Lechuga',
        precio: 1250,
        imagen: 'img/lechuga.png',
        categoria: 'Verduras',
        url: 'lechuga.html'
      }
    ];

    // Elementos del DOM
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');

    // Función para buscar productos
    function buscarProductos(termino) {
      if (!termino) return [];

      const terminoLower = termino.toLowerCase();
      return productosDB.filter(producto =>
        producto.nombre.toLowerCase().includes(terminoLower) ||
        producto.categoria.toLowerCase().includes(terminoLower)
      );
    }

    // Función para mostrar sugerencias
    function mostrarSugerencias(productos) {
      suggestionsContainer.innerHTML = '';

      if (productos.length === 0) {
        suggestionsContainer.innerHTML = '<div class="no-results">No se encontraron productos</div>';
        suggestionsContainer.style.display = 'block';
        return;
      }

      // Mostrar máximo 5 sugerencias
      const productosMostrar = productos.slice(0, 5);

      productosMostrar.forEach(producto => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='img/placeholder.png'">
          <div class="suggestion-info">
            <div class="suggestion-name">${producto.nombre}</div>
            <div class="suggestion-price">$${producto.precio.toLocaleString()} / libra</div>
          </div>
          <span class="suggestion-category">${producto.categoria}</span>
        `;

        suggestionItem.addEventListener('click', () => {
          window.location.href = producto.url;
          suggestionsContainer.style.display = 'none';
        });

        suggestionsContainer.appendChild(suggestionItem);
      });

      suggestionsContainer.style.display = 'block';
    }

    // Función para realizar búsqueda
    function realizarBusqueda() {
      const termino = searchInput.value.trim();
      if (termino) {
        const resultados = buscarProductos(termino);
        if (resultados.length > 0) {
          window.location.href = resultados[0].url;
        }
      }
      suggestionsContainer.style.display = 'none';
    }

    // Event Listeners para búsqueda
    if (searchInput && suggestionsContainer) {
      searchInput.addEventListener('input', (e) => {
        const termino = e.target.value.trim();
        if (termino.length > 1) {
          const resultados = buscarProductos(termino);
          mostrarSugerencias(resultados);
        } else {
          suggestionsContainer.style.display = 'none';
        }
      });

      searchInput.addEventListener('focus', () => {
        const termino = searchInput.value.trim();
        if (termino.length > 1) {
          const resultados = buscarProductos(termino);
          mostrarSugerencias(resultados);
        }
      });

      if (searchButton) {
        searchButton.addEventListener('click', realizarBusqueda);
      }

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          realizarBusqueda();
        }
      });

      // Cerrar sugerencias al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
          suggestionsContainer.style.display = 'none';
        }
      });
    }

    // Menú hamburguesa
    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }

    // Cerrar menú al hacer clic en un enlace (en móviles)
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });