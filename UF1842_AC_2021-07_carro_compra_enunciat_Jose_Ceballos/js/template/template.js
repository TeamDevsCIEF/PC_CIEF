import {cartItemTemplate} from './cartItemTemplate.js';
import {EventEmitter,eventEmitter} from "../eventos/eventEmitter.js" ;
// este template es para renderizar el ebjeto productes el cual contiene todos los productos que estaban en el html
//const eventEmitter = new EventEmitter();

const template = (obj = {"id":"","img":{"src":"","alt":""},"producto":"","price":"","currency":"","measurement":""},myCart) => {
    let item=cartItemTemplate(obj.id);
    //console.log("template let item=cartItemTemplate(obj.id);",item);
    let div = document.createElement("div");
    let img = Object.assign(document.createElement('img'), { loading: 'lazy', src: `${obj.img.src}`, alt: `${obj.img.alt}`, className: "imatges" });
    let p = document.createElement("p");
    p.textContent = `${obj.producto} : ${obj.price} ${obj.currency}/${obj.measurement}`;

    let addToCart = Object.assign(document.createElement('input'), { type: 'button', value: "Add to Cart" });

    let count = Object.assign(document.createElement('div'), { className: "count" });
    let count_reduce = Object.assign(document.createElement('span'), { className: "count_reduce" });
    count_reduce.textContent = "-";
    let count_input = Object.assign(document.createElement('input'), { type: "number",step:"0.1" ,className: "count_input", value: "1" });
    let count_add = Object.assign(document.createElement('span'), { className: "count_add" });
    count_add.textContent = "+";

    count_reduce.addEventListener("click", () => {

        let current = myCart.cartItems[obj.id].cantidad;//parseInt(count_input.value);
        
        if (current > 0) {
            count_input.value = current - 1};
    });

    eventEmitter.on('cartItemsUpdate', cartItemsUpdate)
    eventEmitter.emit("test desde tempolate","");
    const updateInput=()=>{
        let current;//parseInt(count_input.value);
        switch(obj.measurement){
            case("unit"):
                //current=++myCart.cartItems[obj.id].cantidad;
                current=++myCart.cartItems[obj.id].cantidad;
                break;
            case("kg"):current=(myCart.cartItems[obj.id].cantidad+= 0.1).toFixed(2);break;
            default:console.log("Error en la medida")
            
        }
        //item[obj.id].cantidad=current;
        count_input.value = current;
        //update_cartItems(item)
        myCart.updateItem(item);
        //myCart.cartUpdate();
    }
    count_add.addEventListener("click", () => {
        updateInput()

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
        
        //create_cartItems(item)
        myCart.addItem( item);

        
    });

    const cartItemsUpdate=()=>{
        console.log("cartItemsUpdate desde template")
    }

    return div;
};
export {template};