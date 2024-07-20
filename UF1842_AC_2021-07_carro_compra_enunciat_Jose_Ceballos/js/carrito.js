//Falta programar el boton de - decremento
// falta mostrar el boton agregar al borrar del carrito (y tambien al estar en 0 al sacar el foco)
// Falta ocultar el carrito al no tener elementos en el
// Falta arreglar el diseño de los cards para que el boton add to cart quede pegado al fondo, ahora se desforma
// en el carrito en la columna cantidad centrar las medidas (kg / und etc)
// quitar los controles del input de cantidades de las cards al igual como se le quito al input del carrito

//Profesor para mas comodidad he creado esta lista de productos con los datos que habia en el html con el fin de poder tener mas detalle de los productos como la moneda el precio etc.

const productes=[
    {"id":"1","img":{"src":"img/aranja.png","alt":"Aranja"},"producto":"Pomelo","price":"2.50","currency":"€","measurement":"kg"},
    {"id":"2","img":{"src":"img/kiwi.png","alt":"Kiwi"},"producto":"Kiwi","price":"4.20","currency":"€","measurement":"kg"},
    {"id":"3","img":{"src":"img/llimones.png","alt":"Llimones"},"producto":"Limón","price":"1.20","currency":"€","measurement":"kg"},
    {"id":"4","img":{"src":"img/pinya.png","alt":"Pinya"},"producto":"Piña","price":"2.80","currency":"€","measurement":"unit"},
    {"id":"5","img":{"src":"img/sindria.png","alt":"Sindria"},"producto":"Sandía","price":"1.20","currency":"€","measurement":"kg"},
    {"id":"6","img":{"src":"img/aguacates.jpg","alt":"Aguacates"},"producto":"Aguacate","price":"2.50","currency":"€","measurement":"unit"},
    {"id":"7","img":{"src":"img/freson.jpg","alt":"Fresón"},"producto":"Fresón","price":"6.20","currency":"€","measurement":"kg"},
    {"id":"8","img":{"src":"img/mandarina.jpg","alt":"Mandarina"},"producto":"Mandarina","price":"1.90","currency":"€","measurement":"kg"},
    {"id":"9","img":{"src":"img/manzana_fuji.jpg","alt":"Manzana Fuji"},"producto":"Manzana Fuji","price":"4.20","currency":"€","measurement":"kg"},
    {"id":"10","img":{"src":"img/platans.png","alt":"Plátanos"},"producto":"Plátanos","price":"3.20","currency":"€","measurement":"kg"},
    {"id":"11","img":{"src":"img/pera.jpg","alt":"Pera"},"producto":"Pera","price":"1.80","currency":"€","measurement":"kg"},
    {"id":"12","img":{"src":"img/manzana_golden.jpg","alt":"Manzana Golden"},"producto":"Manzana Golden","price":"3.50","currency":"€","measurement":"kg"}
]

const cartItemTemplate=(id,template=null,total=0,cantidad=0)=>{ return {[id]:{template,total,cantidad}};};
//esta variable tendra este formato {"id":{template:null}} con el fin de llevar el control de los elementos que estan en el carrito y poder eliminarlos por referencia.
let cartItems={};
const cartUpdate = () => {
    let carrito = document.querySelector("#carrito");
    let firstChild = carrito.firstElementChild;
    let preuFinal = document.querySelector("#preuFinal");
    if (firstChild) {
        carrito.replaceChildren(firstChild);
    }    
    
    for(let id in cartItems) {
        
        carrito.appendChild(cartItems[id].template);
    }
    let carritoItem=carrito.querySelectorAll(".carrito_item_total");
    let total=0;
    for(let item of carritoItem) {
        total+=parseFloat(item.dataset.total);
    }
    preuFinal.textContent=`${total.toFixed(2)} €`;    

};
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
const templateItemCart=(obj = {"id":"","img":{"src":"","alt":""},"producto":"","price":"","currency":"","measurement":""},cantidad=1) => {
    let item=cartItemTemplate(obj.id)
    let carrito_item=Object.assign(document.createElement('li'), { className: "carrito_item_li carrito_item" });
    let pProduct=document.createElement("p");
    pProduct.innerHTML =`${obj.producto}`;

    let pPrice=document.createElement("p");
    pPrice.textContent = `${obj.price} ${obj.currency}/${obj.measurement}`;

    
    let pCarrito_item_count= Object.assign(document.createElement('p'), { className: "carrito_item_count" });
    let count_reduce= Object.assign(document.createElement('span'), { className: "count_reduce" });
    count_reduce.textContent = "-";
    let count_input= Object.assign(document.createElement('input'), { type: "number", className: "count_input", value: `${cantidad}` });
    let count_add= Object.assign(document.createElement('span'), { className: "count_add" });
    count_add.textContent = "+";
    let measurement= Object.assign(document.createElement('span'), { className:"measurement"});
    measurement.textContent = obj.measurement;
    
    
    pCarrito_item_count.appendChild(count_reduce);
    pCarrito_item_count.appendChild(count_input);
    pCarrito_item_count.appendChild(count_add);
    pCarrito_item_count.appendChild(measurement);

    let total = Object.assign(document.createElement('p'), {id:`total_${obj.id}`,className:"carrito_item_total"});
    //let currency=document.createElement('span');
    //currency.textContent = ` ${obj.currency}`;
    
    const reCalcTotal=() => {
        let calcTotal = (parseFloat(count_input.value) * parseFloat(obj.price)).toFixed(2);
        total.textContent=`${ calcTotal} ${obj.currency}`;
        total.setAttribute('data-total', `${calcTotal}`);
    
    };//parseFloat(obj.price)*parseFloat(count_input.value)    
    reCalcTotal();
    let pDelete = Object.assign(document.createElement('p'), { className:"pDelete"});
    pDelete.innerHTML = "<i class='fa-solid fa-trash'></i>";
    pDelete.addEventListener("click", (event) => {
        deleteItem_cartItems(obj.id);
    });
    
    carrito_item.appendChild(pProduct);
    carrito_item.appendChild(pPrice);
    carrito_item.appendChild(pCarrito_item_count);
    carrito_item.appendChild(total);
    carrito_item.appendChild(pDelete);
    
    count_reduce.addEventListener("click", () => {
        let current = parseInt(count_input.value);
        if (current > 0) {
            item[obj.id].total=current -1 ;
            count_input.value =item[obj.id].total;
            reCalcTotal();
            cartUpdate();
            
        }
    });
    count_add.addEventListener("click", () => {
        let current = parseInt(count_input.value);
        count_input.value = current + 1;
        reCalcTotal();
        cartUpdate();
    });
    
    return carrito_item;

    
};

// este template es para renderizar el ebjeto productes el cual contiene todos los productos que estaban en el html
const template = (obj = {"id":"","img":{"src":"","alt":""},"producto":"","price":"","currency":"","measurement":""}) => {
    let item=cartItemTemplate(obj.id);
    let div = document.createElement("div");
    let img = Object.assign(document.createElement('img'), { loading: 'lazy', src: `${obj.img.src}`, alt: `${obj.img.alt}`, className: "imatges" });
    let p = document.createElement("p");
    p.textContent = `${obj.producto} : ${obj.price} ${obj.currency}/${obj.measurement}`;

    let addToCart = Object.assign(document.createElement('input'), { type: 'button', value: "Add to Cart" });

    let count = Object.assign(document.createElement('div'), { className: "count" });
    let count_reduce = Object.assign(document.createElement('span'), { className: "count_reduce" });
    count_reduce.textContent = "-";
    let count_input = Object.assign(document.createElement('input'), { type: "number", className: "count_input", value: "1" });
    let count_add = Object.assign(document.createElement('span'), { className: "count_add" });
    count_add.textContent = "+";

    count_reduce.addEventListener("click", () => {

        let current = cartItems[obj.id].cantidad;//parseInt(count_input.value);
        
        if (current > 0) {
            count_input.value = current - 1};
    });

    count_add.addEventListener("click", () => {
        let current = ++cartItems[obj.id].cantidad;//parseInt(count_input.value);
        item[obj.id].cantidad=current;
        count_input.value = current;
        update_cartItems(item)
    });

    count.appendChild(count_reduce);
    count.appendChild(count_input);
    count.appendChild(count_add);

    div.appendChild(img);
    div.appendChild(p);
    div.appendChild(addToCart);
    div.appendChild(count);

    count.addEventListener("blur", (event) => {

        if (count_input.value === '0') {
            count.style.display = 'none';
            addToCart.style.display = 'block';
        }
    
    });

    addToCart.addEventListener("click", () => {
        addToCart.style.display = 'none';
        count.style.display = 'flex';
        
        create_cartItems(item)

        
    });

    return div;
};



let productesDom=document.querySelector(".productes");
productes.forEach(producte=>productesDom.appendChild(template(producte)));



cartUpdate(cartItems);


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
