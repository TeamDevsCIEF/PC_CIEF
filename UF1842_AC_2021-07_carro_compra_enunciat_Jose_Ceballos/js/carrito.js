import ShoppingCart from './modules/shoppingCart.js'
import {productes} from './api.js'
import {template} from './template/template.js';
//Falta programar el boton de - decremento
// falta mostrar el boton agregar al borrar del carrito (y tambien al estar en 0 al sacar el foco)
// Falta ocultar el carrito al no tener elementos en el
// Falta arreglar el diseño de los cards para que el boton add to cart quede pegado al fondo, ahora se desforma
// en el carrito en la columna cantidad centrar las medidas (kg / und etc)
// quitar los controles del input de cantidades de las cards al igual como se le quito al input del carrito

//Profesor para mas comodidad he creado esta lista de productos con los datos que habia en el html con el fin de poder tener mas detalle de los productos como la moneda el precio etc.

const myCart = new ShoppingCart();
myCart.updateCartPopup();

/*const cartUpdate = () => {
    let carrito = document.querySelector("#carrito");
    let firstChild = carrito.firstElementChild;
    let preuFinal = document.querySelector("#preuFinal");
    if (firstChild) { carrito.replaceChildren(firstChild);}    
    
    for(let id in cartItems) {
        
        carrito.appendChild(cartItems[id].template);
    }
    let carritoItem=carrito.querySelectorAll(".carrito_item_total");
    let total=0;
    for(let item of carritoItem) {
        total+=parseFloat(item.dataset.total);
    }
    preuFinal.textContent=`${total.toFixed(2)} €`;    

};*/


//esta variable tendra este formato {"id":{template:null}} con el fin de llevar el control de los elementos que estan en el carrito y poder eliminarlos por referencia.
//let cartItems={};

const create_cartItems=(item)=>{
    let newItem={...item}
    for(let id in newItem){
        let romperforEach = false;
        productes.forEach(item => {
            if (romperforEach) return; // Salir del bucle forEach si la condición ya se cumplió

            if(item.id===id){
                newItem[id].template=templateItemCart(item);
                romperforEach=true;
            }
            });
        
    }
    cartItems={...cartItems,...newItem};
    cartUpdate();
};

const update_cartItems=(item)=>{
    let newItem={...item}  
    for(i in newItem) {
        let romperforEach = false;
        productes.forEach(item => {
            if (romperforEach) return; // Salir del bucle forEach si la condición ya se cumplió
            if(item.id===i){
                newItem[i].template = templateItemCart(item,newItem[i].cantidad);
                romperforEach=true;
            }
            });
    }
    
    
    cartItems={...cartItems,...newItem};
    cartUpdate();};
const deleteItem_cartItems=(id)=>{
    let carrito = document.querySelector("#carrito");
    carrito.removeChild(cartItems[id].template);
    delete cartItems[id];
    cartUpdate();
    };


// he creado este template para agregar elementos al carrito





let productesDom=document.querySelector(".productes");
productes.forEach(producte=>productesDom.appendChild(template(producte,myCart)));



/*cartUpdate();*/


/*
Hay que programar un carrito de compra de fruta.

El cliente eligirá que fruta quiere haciendo click sobre la imagen.
Un mensaje emergente le preguntará qué cantidad quiere.

Esta información se mostrará a la derecha, bajo "Total carrito", 
en <p id="carrito"></p>, de esta forma:
 Kiwi 2 kg x 4,20€/kg = 8,40 €

El total se actualizará con cada compra
 Total Compra: 8,40€
 
Se dará la opción de añadir o no más productos que se mostrarán
a continuación de los anteriores, y se sumará todo en el total. 
Por ejemplo:  
 Kiwi 2 kg x 4, 20€/kg = 8, 40€
 Pomelo 1 kg x 2,50€/kg = 2,50€
 Total Compra: 10,90€

Puedes modificar el código facilitado si ello te ayuda con el ejercicio,
pero deberás justificarlo.

Recuerda la importancia comentar con detalle el código.

 Lo importante es el cálculo, no los estilos css
 */
