
if (typeof localStorage === "undefined") {
  console.log("No soporta localStorage");
}




const productos = {

    BarrefondoAluminio: {
      nombre: 'Barrefondo Aluminio',
      precio: 1200,
      stock: 115,
      descuento: 0,
      img: 'imagenes/producto-1.jpg'
    },
    BarrefondoSuperior: {
      nombre: 'Barrefondo Superior',
      precio: 1200,
      stock: 10,
      descuento: 0,
      img: 'imagenes/producto-2.jpg'
    },
    BarrefondoSuper: {
      nombre: 'Barrefondo super',
      precio: 1200,
      stock: 10,
      descuento: 0,
      img: 'imagenes/producto-3.jpg'
    },
    BarrefondoCepillo: {
      nombre: 'Barrefondo cepillo',
      precio: 1200,
      stock: 10,
      descuento: 0.1,
      img: 'imagenes/producto-3.jpg'
    },
    CloroDisolucionLenta: {
      nombre: 'Cloro disolucion lenta',
      precio: 1200,
      stock: 10,
      descuento: 0,
      img: 'imagenes/producto-4.jpg'
    },
    CloroEnPastillas: {
      nombre: 'Cloro en pastillas',
      precio: 1200,
      stock: 10,
      descuento: 0,
      img: 'imagenes/producto-5.jpg'
    },
    CloroEnPastillas3kg: {
      nombre: 'Cloro en pastillas 3kg',
      precio: 1200,
      stock: 10,
      descuento: 0,
      img: 'imagenes/producto-6.jpg'
    },
    SacahojasAluminio: {
      nombre: 'Sacahojas Aluminio',
      precio: 1200,
      stock: 10,
      descuento: 0,
      img: 'imagenes/producto-1.jpg'
    }
 
};


// Constante para el IVA
const IVA = 0.21;  // 21% de IVA

// Inicializar el carrito al cargar la página
 document.addEventListener('DOMContentLoaded', cargarCarrito); 

document.addEventListener('DOMContentLoaded', function(){
  // Mostrar los productos en el DOM
  const contenedor = document.getElementById('productos-container');
  if (!contenedor) {
    console.error('El contenedor de productos no se encuentra en el DOM');
    return;
  }
  Object.keys(productos).forEach(key => {
    
    const producto = productos[key];
    const template = `
      <div class="producto">
       <img src="${producto.img}" alt="${producto.nombre}" class="img-responsive">
        <h3>${producto.nombre}</h3>
        <p>Stock: <span id="stock-${key}">${producto.stock}</span></p>
        <p> $${producto.precio}</p>
        <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio}, '${key}')">Agregar al carrito</button>
      </div>
    `;
    contenedor.innerHTML += template;
  });
});

function agregarAlCarrito(nombre, precio, productoKey) {
  
  // Obtener el producto específico
  const producto = productos[productoKey];

  
  // Validar stock
  if (producto.stock <= 0) {
      alert('¡Producto agotado!');
      return;
  }
  
  // Obtener el carrito actual del localStorage
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    console.log(carrito);
  // Agregar nuevo producto
  carrito.push({ 
      nombre: producto.nombre, 
      precio: producto.precio,
      productoKey: productoKey
  });
  
  
  // Reducir stock
  producto.stock--;
  document.getElementById(`stock-${productoKey}`).textContent = producto.stock;

  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarSidebar();

  // Actualizar vista del carrito
  renderizarCarrito();
  
}

function renderizarCarrito() {
  const listaCarrito = document.getElementById('lista-carrito');
  const subtotalCarrito = document.getElementById('subtotal-carrito');
  const descuentoCarrito = document.getElementById('descuento-carrito');
  const ivaCarrito = document.getElementById('iva-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Limpiar lista anterior
  listaCarrito.innerHTML = '';
  
  // Totales iniciales
  let subtotal = 0;
  let descuentoTotal = 0;
  
  // Renderizar cada producto
  carrito.forEach((producto, index) => {
      const productoInfo = productos[producto.productoKey];
      const li = document.createElement('li');
      
      // Calcular descuento individual
      const descuentoProducto = productoInfo.descuento * producto.precio;
      const precioConDescuento = producto.precio - descuentoProducto;
      
      li.innerHTML = `
          ${producto.nombre} - $${producto.precio} 
          ${productoInfo.descuento > 0 ? 
              `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: 
              -$${descuentoProducto.toFixed(2)})</span>` 
              : ''}
      `;
      
      // Botón para eliminar producto
      const botonEliminar = document.createElement('button');
      botonEliminar.classList.add('eliminar-producto');
      botonEliminar.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/> <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/> </svg>';
      botonEliminar.onclick = () => eliminarDelCarrito(index);
      
      li.appendChild(botonEliminar);
      listaCarrito.appendChild(li);
      
      // Sumar al subtotal y descuentos
      subtotal += producto.precio;
      descuentoTotal += descuentoProducto;
  });
  
  // Calcular IVA
  const ivaTotal = (subtotal - descuentoTotal) * IVA;
  const total = subtotal - descuentoTotal + ivaTotal;
  
  // Actualizar totales
  subtotalCarrito.textContent = subtotal.toFixed(2);
  descuentoCarrito.textContent = descuentoTotal.toFixed(2);
  ivaCarrito.textContent = ivaTotal.toFixed(2);
  totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Recuperar el producto para devolver stock
  const producto = productos[carrito[index].productoKey];
  producto.stock++;
  document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
  
  // Eliminar producto por índice
  carrito.splice(index, 1);
  
  // Actualizar localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Renderizar de nuevo
  renderizarCarrito();
}

function vaciarCarrito() {
  // Restaurar stock de todos los productos
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.forEach(item => {
      const producto = productos[item.productoKey];
      producto.stock++;
      document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
  });
  
  // Limpiar localStorage
  localStorage.removeItem('carrito');
  
  // Renderizar
  renderizarCarrito();
}

function cargarCarrito() {
  // Cargar carrito al iniciar la página
  renderizarCarrito();
}

// Funciones de Checkout
function mostrarCheckout() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Validar que hay productos en el carrito
  if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
  }
  
  // Mostrar modal de checkout
  const modal = document.getElementById('checkout-modal');
  modal.style.display = 'flex';
  
  // Actualizar totales en el modal
  const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
  const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
  const iva = parseFloat(document.getElementById('iva-carrito').textContent);
  const total = parseFloat(document.getElementById('total-carrito').textContent);
  
  document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
  document.getElementById('modal-iva').textContent = iva.toFixed(2);
  document.getElementById('modal-total').textContent = total.toFixed(2);
}

function realizarCompra() {
  // Simular compra
  alert('¡Compra realizada con éxito!');
  
  // Vaciar carrito
  localStorage.removeItem('carrito');
  
  // Cerrar modal
  cerrarSidebar();
  
  // Renderizar carrito vacío
  renderizarCarrito();
}

function mostrarSidebar() {
  document.getElementById('sidebar-carrito').classList.add('mostrar');
}

function cerrarSidebar() {
  document.getElementById('sidebar-carrito').classList.remove('mostrar');
}