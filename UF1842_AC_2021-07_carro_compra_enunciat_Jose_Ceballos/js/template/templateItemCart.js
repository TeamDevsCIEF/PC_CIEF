import { cartItemTemplate } from './cartItemTemplate.js';
import {eventEmitter} from "../eventos/eventEmitter.js"; // Importamos un manejador de eventos para comunicar cambios entre diferentes partes de la aplicación.
import {decrement_Input,increment_Input,increment_InputBlur} from "./utils/shareUtils.js"; //Funcion compartida para el uso en diferentes modulos que utilice la misma logica de decrementar el valor de un input.

// Función que crea y devuelve un elemento del carrito basado en el objeto {cartItemTemplate} ubicado en esta misma carpeta de template.
const templateItemCart = (obj = {"id": "", "img": {"src": "", "alt": ""}, "producto": "", "price": "", "currency": "", "measurement": ""}, cantidad = 1, myCart = null) => {
    let item = cartItemTemplate(obj.id);
    let carrito_item = Object.assign(document.createElement('li'), { className: "carrito_item_li carrito_item" });

    // Crear y configurar los elementos para mostrar la información del producto.
    let pProduct = document.createElement("p");
    pProduct.innerHTML = `${obj.producto}`; // nombre del producto

    let pPrice = document.createElement("p");
    pPrice.textContent = `${obj.price} ${obj.currency}/${obj.measurement}`; // precio del producto

    // Crear los elementos para controlar la cantidad del producto.
    let pCarrito_item_count = Object.assign(document.createElement('p'), { className: "carrito_item_count" });
    let count_reduce = Object.assign(document.createElement('span'), { className: "count_reduce" });

    count_reduce.textContent = "-"; // boton de reducir la cantidad del producto
    let count_input = Object.assign(document.createElement('input'), { type: "number", className: "count_input", value: `${cantidad}` });
    let count_add = Object.assign(document.createElement('span'), { className: "count_add" });

    count_add.textContent = "+"; // boton para aumentar la cantidad del producto
    let measurement = Object.assign(document.createElement('span'), { className: "measurement" });
    measurement.textContent = obj.measurement;

    const updateInput = (value) => {
        count_input.value = value; // Función para actualizar el valor del campo de cantidad.
    };
    // Añadir los elementos de control de cantidad al contenedor.
    pCarrito_item_count.appendChild(count_reduce);
    pCarrito_item_count.appendChild(count_input);
    pCarrito_item_count.appendChild(count_add);
    //pCarrito_item_count.appendChild(measurement); //he decidido no mostrar esta medida en el el resultado final, descomentar en caso de necesitar.

    // Crear y configurar el elemento para mostrar el total del producto.
    let total = Object.assign(document.createElement('p'), { id: `total_${obj.id}`, className: "carrito_item_total" });

    // Función para recalcular y actualizar el total del producto.
    const reCalcTotal = () => {
        let calcTotal = (parseFloat(count_input.value) * parseFloat(obj.price)).toFixed(2);
        total.textContent = `${calcTotal} ${obj.currency}`;
        total.setAttribute('data-total', `${calcTotal}`);
    };
    reCalcTotal(); // Este es un primer llamado de la función, para mostrar el total del producto

    // Crear y configurar el botón para eliminar el producto del carrito.
    let pDelete = Object.assign(document.createElement('p'), { className: "pDelete" });
    pDelete.innerHTML = "<i class='fa-solid fa-trash'></i>"; // icono de papelera
    pDelete.addEventListener("click", (event) => {
        myCart.deleteItem(obj.id);
        eventEmitter.emit(`showAddToCart_${obj.id}`,"")// emitir evento para mostrar el boton AddToCart ya que se borro el elemento del carrito
    });

    // Añadir todos los elementos al contenedor principal del producto.
    carrito_item.appendChild(pProduct);
    carrito_item.appendChild(pPrice);
    carrito_item.appendChild(pCarrito_item_count);
    carrito_item.appendChild(total);
    carrito_item.appendChild(pDelete);

    // Añadir funcionalidad a los botones de reducir y aumentar la cantidad.
    count_reduce.addEventListener("click", () => {
        decrement_Input({count_input,obj,item}); // Ejecutar la función de reducir la cantidad del input cuando se hace clic en el boton de reducir.
        eventEmitter.emit('updateInputOfTemplate', item); // Emitimos un evento para notificar el cambio de cantidad.
    });

    count_add.addEventListener("click", () => {
        increment_Input({count_input,obj,item}); // Añadimos un evento para aumentar la cantidad cuando se hace clic en el botón de aumentar.
        eventEmitter.emit(`updateInputOfTemplate`, item); // Emitimos un evento para notificar el cambio de cantidad.
    });

    eventEmitter.on(`updateInput_${obj.id}`, updateInput); // Añadimos un listener para actualizar el campo de entrada cuando se emite un evento específico.

    count_input.addEventListener("blur", (event) => increment_InputBlur({count_input,obj,item})); // Añadimos un evento para actualizar la cantidad cuando se pierde el foco del campo de entrada.
    // Devolver el elemento del carrito creado.
    return carrito_item;
};

const emptyElementTemplate=()=>{
    const emptyElement=document.createElement("li");
    emptyElement.className="carrito_item_li carrito_item"

    emptyElement.innerHTML=`        
        <p></p>
        <p></p>
        <p style="height: 3.5vh;"></p>
        <p></p>
        <p></p>    
    `;
    return emptyElement;

}

export { templateItemCart,emptyElementTemplate };
