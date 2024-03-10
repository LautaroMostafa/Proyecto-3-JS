let productos = [
    { id: 4, nombre: "God of War", categoria: "Juegos", stock: 5, precio: 60, imagen: "god of war.jpeg" },
    { id: 7, nombre: "Uncharted 4", categoria: "Juegos", stock: 7, precio: 50, imagen: "uncharted 4.jpeg" },
    { id: 15, nombre: "Dark Souls 3", categoria: "Juegos", stock: 10, precio: 40, imagen: "dark souls 3.jpeg" },
    { id: 61, nombre: "La era del hielo", categoria: "Peliculas", stock: 11, precio: 50, imagen: "la-era-de-hielo-1.jpg" },
    { id: 123, nombre: "Jumanji", categoria: "Peliculas", stock: 8, precio: 45, imagen: "jumanji.jpeg" },
    { id: 2, nombre: "Los Minions", categoria: "Peliculas", stock: 2, precio: 35, imagen: "los minions.jpeg" },
    { id: 51, nombre: "Juego de Tronos", categoria: "Series", stock: 9, precio: 20, imagen: "juegos de tronos.jpeg" },
    { id: 8, nombre: "Lupin", categoria: "Series", stock: 12, precio: 15, imagen: "lupin.jpeg" },
    { id: 93, nombre: "What if", categoria: "Series", stock: 7, precio: 10, imagen: "what if.jpeg" },
]

function filtradoCategorias() {
    let categoriaSeleccionada = this.value.toLocaleLowerCase()
    let seleccionFiltrada = []

    if (categoriaSeleccionada === "todo") {
        seleccionFiltrada = productos
    } else {
        seleccionFiltrada = productos.filter(producto => producto.categoria.toLocaleLowerCase() === categoriaSeleccionada)
    }

    mostrarProductos(seleccionFiltrada)
}

function filtrarProductos() {
    const textoBusqueda = document.getElementById("barraBusqueda").value.toLowerCase().trim();
    let categoriaSeleccionada = document.getElementById("seleccionCategoria").value.toLocaleLowerCase();
    let productosFiltrados = [];

    if (categoriaSeleccionada === "todo") {
        productosFiltrados = productos.filter(producto => producto.nombre.toLocaleLowerCase().includes(textoBusqueda) || producto.categoria.toLocaleLowerCase().includes(textoBusqueda));
    } else {
        productosFiltrados = productos.filter(producto => producto.nombre.toLocaleLowerCase().includes(textoBusqueda) && producto.categoria.toLocaleLowerCase() === categoriaSeleccionada);
    }

    mostrarProductos(productosFiltrados);
}

function mostrarProductos(productos) {
    seccionProductos.innerHTML = ""
    productos.forEach(producto => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.className = "producto"

        tarjetaProducto.innerHTML = `
            <img src="./images/${producto.imagen}"/>
            <h2>${producto.nombre}</h2>
            <h3>$${producto.precio}</h3>
            <p id="stockProducto-${producto.id}">Unidades restantes: ${producto.stock}</p>
            <button id=${producto.id}>Agregar al Carrito</button>
        `
        seccionProductos.append(tarjetaProducto)
    })

    document.getElementById("iconoBuscador").addEventListener("click", filtrarProductos)
    agregarProductosCarrito()
    calcularTotalCarrito()
}

function infoProductosCarrito(productoCarrito, productos) {
    let productosAgragados = document.getElementById("contenedorProductoCarrito")
    let tarjetaProductoCarrito = productosAgragados.querySelector(`#productoCarrito-${productoCarrito.id}`)

    if (tarjetaProductoCarrito) {
        let cantidadProductoCarrito = tarjetaProductoCarrito.querySelector(`#cantidadProductoCarrito`)
        let cantidadActual = parseInt(cantidadProductoCarrito.textContent)
        cantidadProductoCarrito.textContent = cantidadActual + 1

        let tarjetaProducto = document.getElementById(productoCarrito.id);
        if (tarjetaProducto) {
            let stockElement = tarjetaProducto.querySelector('p');
            if (stockElement) {
                stockElement.textContent = `Unidades restantes: ${productoCarrito.stock}`;
            }
        }
        let precioUnitarioProducto = parseFloat(tarjetaProductoCarrito.querySelector("#precioProductoCarrito").textContent)
        let nuevoPrecioTotal = (cantidadActual + 1) * productoCarrito.precio
        tarjetaProductoCarrito.querySelector("#precioProductoCarrito").textContent = "$" + nuevoPrecioTotal
        totalCarrito += nuevoPrecioTotal

    } else {
        tarjetaProductoCarrito = document.createElement("div")
        tarjetaProductoCarrito.className = "productoCarrito"
        tarjetaProductoCarrito.id = `productoCarrito-${productoCarrito.id}`

        tarjetaProductoCarrito.innerHTML = `
            <span id="cantidadProductoCarrito">1</span>
            <p id="nombreProductoCarrito">${productoCarrito.nombre}</p>
            <span id="precioProductoCarrito">$${productoCarrito.precio}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" id="iconoEliminarProductoCarrito"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>  
        `

        productosAgragados.append(tarjetaProductoCarrito)
    }

    let eliminarProducto = tarjetaProductoCarrito.querySelector("#iconoEliminarProductoCarrito")
    eliminarProducto.addEventListener("click", () => {
        tarjetaProductoCarrito.remove()
        document.getElementById("cantidadSeleccionadaN").textContent = parseInt(document.getElementById("cantidadSeleccionadaN").textContent) - 1
        productoCarrito.stock++
        calcularTotalCarrito()
    })

    calcularTotalCarrito()
}

function calcularTotalCarrito() {
    let preciosProductos = document.querySelectorAll("#precioProductoCarrito")
    totalCarrito = 0
    let tituloCarrito = document.getElementById("tituloTotalCarrito")
    let botonPagarCarrito = document.getElementById("botonPagarCarrito")
    let totalDelCarrito = document.getElementById("totalCarrito")

    if (preciosProductos.length === 0) {
        tituloCarrito.textContent = "No hay productos en el carrito"
        botonPagarCarrito.style.display = "none"
        totalDelCarrito.style.display = "none"
    } else {
        preciosProductos.forEach(precioProducto => {
            totalCarrito += parseFloat(precioProducto.textContent.replace("$", ""))
        })
        totalDelCarrito.textContent = "$" + totalCarrito
        totalDelCarrito.style.display = "block"
        botonPagarCarrito.style.display = "block"
        tituloCarrito.textContent = "Total:"
    }
}

function agregarProductosCarrito() {
    document.querySelectorAll(".producto button").forEach(button => {
        button.addEventListener("click", () => {
            let productId = parseInt(button.id)
            let productoSeleccionado = productos.find(producto => producto.id === productId)
            if (productoSeleccionado.stock > 0) {
                productoSeleccionado.stock--
                document.getElementById("cantidadSeleccionadaN").textContent = parseInt(document.getElementById("cantidadSeleccionadaN").textContent) + 1
                infoProductosCarrito(productoSeleccionado, productos)
            } else {
                alert("Producto agotado")
            }
        })
    })
}

botonPagarCarrito.addEventListener("click", () => {
    let contenedorProductoCarrito = document.getElementById("contenedorProductoCarrito")
    document.getElementById("cantidadSeleccionadaN").textContent = "0"
    contenedorProductoCarrito.innerHTML = ""
    totalCarrito = 0
    calcularTotalCarrito()
    alert("¡Muchas gracias por su compra!")
    mostrarProductos(productosFiltrados)
})

let productosFiltrados = productos
let totalCarrito = 0
let seccionProductos = document.getElementById("productos")

let iconoTienda = document.getElementById("cantidadIconoCarrito")
let carrito = document.getElementById("contenedorCarrito")

iconoTienda.addEventListener("click", () => {
    carrito.classList.toggle("contenedorCarritoOculto")
})

document.getElementById("seleccionCategoria").addEventListener("change", filtradoCategorias)
mostrarProductos(productos)