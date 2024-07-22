import {cartItemTemplate} from './cartItemTemplate.js'; // Importamos una plantilla para los ítems del carrito.
import {cartItems} from '../api.js'; // Importamos los ítems del carrito desde una API.
import {eventEmitter} from "../eventos/eventEmitter.js"; // Importamos un manejador de eventos para comunicar cambios entre diferentes partes de la aplicación.
import {decrement_Input,increment_Input,increment_InputBlur} from "./utils/shareUtils.js"; //Funcion compartida para el uso en diferentes modulos que utilice la misma logica de decrementar el valor de un input.

// Esta función crea un elemento visual (template) para mostrar un producto.
const template = (obj = {"id":"","img":{"src":"","alt":""},"producto":"","price":"","currency":"","measurement":""},myCart) => {
    let item = cartItemTemplate(obj.id); // Creamos un ítem del carrito usando la plantilla importada.

    let div = Object.assign(document.createElement('div'), { id:""  }); // Creamos un contenedor para el producto.
    let img = Object.assign(document.createElement('img'), { loading: 'lazy', src: `${obj.img.src}`, alt: `${obj.img.alt}`, className: "imatges" }); // Creamos una imagen del producto.

    let p = document.createElement("p"); // Creamos un párrafo para mostrar el nombre y precio del producto.
    p.textContent = `${obj.producto} : ${obj.price} ${obj.currency}/${obj.measurement}`; // Añadimos el texto al párrafo.

    let addToCart = Object.assign(document.createElement('input'), { type: 'button',id:"AddToCart" , value: "Add to Cart" }); // Creamos un botón para añadir el producto al carrito.

    let count = Object.assign(document.createElement('div'), { className: "count" }); // Creamos un contenedor para controlar la cantidad del producto.
    let count_reduce = Object.assign(document.createElement('span'), { className: "count_reduce" }); // Creamos un botón para reducir la cantidad.
    count_reduce.textContent = "-"; // Añadimos el texto al botón de reducir.
    
    count_reduce.addEventListener("click", () => {// Añadimos un evento para reducir la cantidad cuando se hace clic en el botón de reducir.
        decrement_Input({count_input,obj,item}); // Ejecutar la función de reducir la cantidad del input cuando se hace clic en el boton de reducir.
        eventEmitter.emit('updateInputOfTemplate', item); // Emitimos un evento para notificar el cambio de cantidad.
    });
    
    let count_input = Object.assign(document.createElement('input'), { type: "number", step: "0.1", className: "count_input", value: "1" }); // Creamos un campo para ingresar la cantidad del producto.
    let count_add = Object.assign(document.createElement('span'), { className: "count_add" }); // Creamos un botón para aumentar la cantidad.
    count_add.textContent = "+"; // Añadimos el texto al botón de aumentar.

    
    count_reduce.addEventListener("click", () => {
        // Añadimos un evento para reducir la cantidad cuando se hace clic en el botón de reducir.
        let current = myCart.cartItems[obj.id].cantidad; // Obtenemos la cantidad actual del producto en el carrito.
        if (current > 0) {
            count_input.value = current - 1; // Reducimos la cantidad en el campo de entrada si es mayor que cero.
        }
    });

    const updateInput = (value) => {
        count_input.value = value; // Función para actualizar el valor del campo de cantidad.
    };

    

    eventEmitter.on(`updateInput_${obj.id}`, updateInput); // Añadimos un listener para actualizar el campo de entrada cuando se emite un evento específico.
    count_add.addEventListener("click", () => {
        increment_Input({count_input,obj,item}); // Añadimos un evento para aumentar la cantidad cuando se hace clic en el botón de aumentar.
        eventEmitter.emit(`updateInputOfTemplate`, item); // Emitimos un evento para notificar el cambio de cantidad.
    });

    count.appendChild(count_reduce); // Añadimos el botón de reducir al contenedor de cantidad.
    count.appendChild(count_input); // Añadimos el campo de entrada de cantidad al contenedor.
    count.appendChild(count_add); // Añadimos el botón de aumentar al contenedor.

    div.appendChild(img); // Añadimos la imagen del producto al contenedor principal.
    div.appendChild(p); // Añadimos el párrafo con el nombre y precio del producto al contenedor principal.
    div.appendChild(addToCart); // Añadimos el botón de añadir al carrito al contenedor principal.
    div.appendChild(count); // Añadimos el contenedor de cantidad al contenedor principal.

    count.addEventListener("blur", (event) => {
        // Añadimos un evento para ocultar el contenedor de cantidad y mostrar el botón de añadir al carrito si la cantidad es cero.
        if (count_input.value === '0') {
            count.style.display = 'none';
            addToCart.style.display = 'block';
        }
    });

    addToCart.addEventListener("click", () => {
        // Añadimos un evento para mostrar el contenedor de cantidad y ocultar el botón de añadir al carrito cuando se hace clic en el botón de añadir al carrito.
        addToCart.style.display = 'none';
        count.style.display = 'flex';
        myCart.addItem(item); // Añadimos el ítem al carrito.
    });

    count_input.addEventListener("blur", (event) => increment_InputBlur({count_input,obj,item})); // Añadimos un evento para actualizar la cantidad cuando se pierde el foco del campo de entrada.
    
    return div; // Devolvemos el contenedor principal que contiene todos los elementos del producto.
};
export {template}; // Exportamos la función para que pueda ser utilizada en otras partes de la aplicación.
