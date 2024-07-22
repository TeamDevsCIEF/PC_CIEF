// Importar productos, artículos del carrito y plantillas desde otros archivos.
import {productes, cartItems} from '../api.js';
import {templateItemCart} from '../template/templateItemCart.js';
import {eventEmitter} from "../eventos/eventEmitter.js";

export default class ShoppingCart {
    constructor() {
        // Suscribir las funciones de actualización al evento 'updateItem'.
        eventEmitter.on('updateItem', this.updateItem);
        eventEmitter.on('updateInputOfTemplate', this.updateItem);

        // Crear un Proxy para cartItems para manejar cambios en el carrito de forma reactiva.
        this.cartProxy = new Proxy(cartItems, {
            // Método para actualizar un elemento en el carrito.
            set: (cartItems, id, newValue) => {
                if (typeof newValue === 'object' && newValue !== null) {
                    cartItems[id] = newValue;
                    this.updateCartPopup();
                    this.cartUpdate();
                    eventEmitter.emit("cartItemsUpdate", "");
                    return true;
                } else {
                    console.error(`El valor nuevo para el id ${id} no es válido`, newValue);
                    return false;
                }
            },
            // Método para eliminar un elemento del carrito.
            deleteProperty: (cartItems, id) => {
                if (id in cartItems) {
                    delete cartItems[id];
                    console.log(`Elemento con id ${id} eliminado`, cartItems);
                    this.updateCartPopup();
                    this.cartUpdate();
                    return true;
                } else {
                    console.error(`El id ${id} no existe en cartItems`);
                    return false;
                }
            },
            // Método para obtener un elemento del carrito.
            get: (cartItems, id) => {
                if (id === 'getAll') {
                    return cartItems;
                } else if (id in cartItems) {
                    console.log(`Elemento con id ${id} consultado`, cartItems[id]);
                    return cartItems[id];
                } else {
                    console.error(`El id ${id} no existe en cartItems`);
                    return undefined;
                }
            }
        });
    }

    // Método para agregar un nuevo elemento al carrito.
    addItem = (item) => {
        let id = Object.keys(item)[0];
        let newItem = { ...item[id], cantidad: 1 };
        let romperForEach = false;
        productes.forEach(prod => {
            if (romperForEach) return;
            if (prod.id === id) {
                newItem.template = templateItemCart(prod, 1, { cartUpdate: this.cartUpdate, deleteItem: this.deleteItem });
                romperForEach = true;
            }
        });
        this.cartProxy[id] = newItem;
        this.cartUpdate();
    }

    // Método para actualizar un elemento existente en el carrito.
    updateItem = (item) => {
        let id = Object.keys(item)[0];
        let newItem = { ...item[id] };
        let romperForEach = false;
        productes.forEach(prod => {
            if (romperForEach) return;
            if (prod.id === id) {
                eventEmitter.emit(`updateInput_${id}`, newItem.cantidad);
                newItem.template = templateItemCart(prod, newItem.cantidad, { cartUpdate: this.cartUpdate, deleteItem: this.deleteItem });
                romperForEach = true;
            }
        });
        this.cartProxy[id] = newItem;
        this.cartUpdate();
    }

    // Método para eliminar un elemento del carrito.
    deleteItem = (id) => {
        let carrito = document.querySelector("#carrito");

        if (this.cartProxy[id]) {
            carrito.removeChild(this.cartProxy[id].template);
            delete this.cartProxy[id]; // Utiliza el proxy para eliminar el elemento.
            this.cartUpdate();
        } else {
            console.error(`El id ${id} no existe en cartItems`);
        }
    }

    // Método para actualizar la visualización del carrito.
    cartUpdate = () => {
        let carrito = document.querySelector("#carrito");
        let firstChild = carrito.firstElementChild;
        let preuFinal = document.querySelector("#preuFinal");
        if (firstChild) {
            carrito.replaceChildren(firstChild);
        }

        // Agregar todos los elementos del carrito al popup.
        for (let id in this.cartProxy["getAll"]) {
            carrito.appendChild(this.cartProxy["getAll"][id].template);
        }

        // Calcular el precio total del carrito.
        let carritoItem = carrito.querySelectorAll(".carrito_item_total");
        let total = 0;
        for (let item of carritoItem) {
            total += parseFloat(item.dataset.total);
        }
        preuFinal.textContent = `${total.toFixed(2)} €`;
    }

    // Método para mostrar u ocultar el popup del carrito según si hay elementos en el carrito.
    updateCartPopup = () => {
        const cartPopup = document.getElementById('carrito');
        if (Object.keys(this.cartProxy).length > 0) {
            cartPopup.style.display = 'block';
        } else {
            cartPopup.style.display = 'none';
        }
        
    }
}
