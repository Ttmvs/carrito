const productos = document.querySelector('#productos')
const items = document.querySelector('#items')
const footer = document.querySelector('#footer')
const templateCard = document.querySelector('#template-card').content
const fragment = document.createDocumentFragment()
const templateFooter = document.querySelector('#template-footer').content
const templateCarrito = document.querySelector('#template-carrito').content
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        crearCarrito()

    }

})
productos.addEventListener('click', evt => {
    agregarCarrito(evt)
})

items.addEventListener('click', evt => {
    btnAumentar(evt)
})

const fetchData = async () => {
    try {
        const res = await fetch('app.json')
        const data = await res.json()
        //console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(ERROR)
        
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        //console.log(producto)
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    productos.appendChild(fragment)
}

const agregarCarrito = evt => {
    //console.log(evt.target)
    //console.log(evt.target.classList.contains('btn'))
    if(evt.target.classList.contains('btn-dark')){
        manipularCarrito(evt.target.parentElement)
    }
    evt.stopPropagation()
}

const manipularCarrito = objeto => {
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    crearCarrito()
    //console.log(producto)
}

const crearCarrito = () =>{
    //console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    modificarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const modificarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).lenght === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">No haz añadido ningún producto aún</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0 )
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    console.log(nPrecio)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnEliminar = document.querySelector('#vaciar-carrito')
    btnEliminar.addEventListener('click', ()=> {
        carrito = {}
        crearCarrito()
    })
}

const btnAumentar = evt =>{
    //console.log(evt.target)
    if(evt.target.classList.contains('btn-info')){
        carrito[evt.target.dataset.id]
        console.log(carrito[evt.target.dataset.id])
        const producto = carrito[evt.target.dataset.id]
        producto.cantidad = carrito[evt.target.dataset.id].cantidad + 1
        carrito[evt.target.dataset.id] = {...producto}
        crearCarrito()
    }

    if(evt.target.classList.contains('btn-danger')){
        const producto =  carrito[evt.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0 ){
            delete carrito[evt.target.dataset.id]
        }
        crearCarrito()
    }
    evt.stopPropagation()
}

