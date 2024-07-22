import {productes,cartItems} from '../api.js';
import {templateItemCart} from '../template/templateItemCart.js';
import {EventEmitter,eventEmitter} from "../eventos/eventEmitter.js" ;
export default class ShoppingCart {
    constructor() {
//        const eventEmitter = new EventEmitter();

        const a=(t)=>{console.log(t)}
        const b=(t)=>{console.log(`Funcion B dice:`,t)}
        eventEmitter.on('test', a)


        //this.cartItems=cartItems;
        this.cartProxy = new Proxy(cartItems, {
            set: (cartItems, id, newValue) => {
                if (typeof newValue === 'object' && newValue !== null) {
                    cartItems[id] = newValue;
                    console.log(`Elemento con id ${id} actualizado/creado`, cartItems);
                    this.updateCartPopup();
                    this.cartUpdate();
                    eventEmitter.emit("cartItemsUpdate","")
                    return true;
                } else {
                    console.error(`El valor nuevo para el id ${id} no es válido`, newValue);
                    return false;
                }
            },
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
        
        // Enlazar explícitamente el método deleteItem a la instancia de la clase
        //this.deleteItem = this.deleteItem.bind(this);
    }


    
    addItem=( item) =>{
        let id=Object.keys(item)[0]
        let newItem = { ...item[id],cantidad:1 };
        console.log("newItem",newItem)
        let romperForEach = false;
        productes.forEach(prod => {
            if (romperForEach) return;
            if (prod.id === id) {
                newItem.template = templateItemCart(prod,1,{cartUpdate:this.cartUpdate,deleteItem:this.deleteItem});
                romperForEach = true;
            }
        });
        this.cartProxy[id] = newItem;
        this.cartUpdate();
    }

    updateItem=( item)=> {
        let id=Object.keys(item)[0]

        let newItem = { ...item[id] };
        console.log("update newItem",newItem)
        let romperForEach = false;
        productes.forEach(prod => {
            if (romperForEach) return;
            if (prod.id === id) {
                newItem.template = templateItemCart(prod, newItem.cantidad,{cartUpdate:this.cartUpdate,deleteItem:this.deleteItem});
                romperForEach = true;
            }
        });
        this.cartProxy[id] = newItem;
        this.cartUpdate();
    }

    deleteItem=(id)=> {
        let carrito = document.querySelector("#carrito");

        if (this.cartProxy[id]) {
            carrito.removeChild(this.cartProxy[id].template);
            delete this.cartProxy[id]; // Utiliza el proxy para eliminar el elemento
            this.cartUpdate();
        } else {
            console.error(`El id ${id} no existe en cartItems`);
        }
    }


    cartUpdate=()=> {
        let carrito = document.querySelector("#carrito");
        let firstChild = carrito.firstElementChild;
        let preuFinal = document.querySelector("#preuFinal");
        if (firstChild) {
            carrito.replaceChildren(firstChild);
        }
        for (let id in cartItems) {
            carrito.appendChild(cartItems[id].template);
        }

        let carritoItem = carrito.querySelectorAll(".carrito_item_total");
        let total = 0;
        for (let item of carritoItem) {
            total += parseFloat(item.dataset.total);
        }
        preuFinal.textContent = `${total.toFixed(2)} €`;
    }

    updateCartPopup=()=> {
        const cartPopup = document.getElementById('carrito');
        console.log(Object.keys(this.cartProxy).length)
        if (Object.keys(this.cartProxy).length > 0) {
        //if (Object.keys(this.cartItems).length > 0) {
            cartPopup.style.display = 'block';
        } else {
            cartPopup.style.display = 'none';
        }
    }

 
}