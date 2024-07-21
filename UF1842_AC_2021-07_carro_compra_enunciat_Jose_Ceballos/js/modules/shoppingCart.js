import {productes} from '../api.js';
import {templateItemCart} from '../template/templateItemCart.js';

export default class ShoppingCart {
    constructor() {
        this.cartItems = {};
        this.cartProxy = new Proxy(this.cartItems, {
            set: (cartItems, id, newValue) => {
                //cartItems={...cartItems,...newValue};
                this.cartItems={...this.cartItems,...newValue};
                //cartItems[id] = newValue;
                this.updateCartPopup();
                this.cartUpdate();
                return true;
            },
            deleteProperty: (cartItems, id) => {
                delete cartItems[id];
                this.updateCartPopup();
                this.cartUpdate();
                return true;
            }
        });
    }
    
    addItem( item) {
        let id=Object.keys(item)[0]
        let newItem = { ...item };
        let romperForEach = false;
        productes.forEach(prod => {
            if (romperForEach) return;
            if (prod.id === id) {
                newItem[id].template = templateItemCart(prod,1,{cartUpdate:this.cartUpdate});
                romperForEach = true;
            }
        });
        this.cartProxy[id] = newItem;
        this.cartUpdate();
    }

    updateItem( item) {
        let id=Object.keys(item)[0]

        let newItem = { ...item };
        let romperForEach = false;
        productes.forEach(prod => {
            if (romperForEach) return;
            if (prod.id === id) {
                newItem[id].template = templateItemCart(prod, newItem[id].cantidad,{cartUpdate:this.cartUpdate});
                romperForEach = true;
            }
        });
        this.cartProxy[id] = newItem;
        this.cartUpdate();
    }

    deleteItem(id) {
        let carrito = document.querySelector("#carrito");
        carrito.removeChild(this.cartItems[id].template);
        delete this.cartProxy[id];
        this.cartUpdate();
    }

    cartUpdate() {
        let carrito = document.querySelector("#carrito");
        let firstChild = carrito.firstElementChild;
        let preuFinal = document.querySelector("#preuFinal");
        if (firstChild) {
            carrito.replaceChildren(firstChild);
        }
        for (let id in this.cartItems) {
            carrito.appendChild(this.cartItems[id].template);
        }

        let carritoItem = carrito.querySelectorAll(".carrito_item_total");
        let total = 0;
        for (let item of carritoItem) {
            total += parseFloat(item.dataset.total);
        }
        preuFinal.textContent = `${total.toFixed(2)} €`;
    }

    updateCartPopup() {
        const cartPopup = document.getElementById('carrito');
        //if (Object.keys(this.cartProxy).length > 0) {
        if (Object.keys(this.cartItems).length > 0) {
            cartPopup.style.display = 'block';
        } else {
            cartPopup.style.display = 'none';
        }
    }

    /*templateItemCart(product, cantidad = 1) {
        // Aquí va tu lógica para crear el template del producto
        // Esto es solo un ejemplo de cómo podría verse
        let itemElement = document.createElement('div');
        itemElement.classList.add('carrito_item_total');
        itemElement.dataset.total = (product.price * cantidad).toFixed(2);
        itemElement.innerHTML = `
            <p>${product.name}</p>
            <p>${product.price} €/kg</p>
            <p class="carrito_item_count">
                <span class="count_reduce">-</span>
                <input type="number" class="count_input" value="${cantidad}">
                <span class="count_add">+</span>
                <span class="measurement">kg</span>
            </p>
            <p data-id="total_${product.id}">${(product.price * cantidad).toFixed(2)} €</p>
            <p><i class="fa-solid fa-trash"></i></p>
        `;
        return itemElement;
    }*/
}