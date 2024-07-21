import {cartItemTemplate} from './cartItemTemplate.js';
// este template es para renderizar el ebjeto productes el cual contiene todos los productos que estaban en el html
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
    let count_input = Object.assign(document.createElement('input'), { type: "number", className: "count_input", value: "1" });
    let count_add = Object.assign(document.createElement('span'), { className: "count_add" });
    count_add.textContent = "+";

    count_reduce.addEventListener("click", () => {

        let current = myCart.cartItems[obj.id].cantidad;//parseInt(count_input.value);
        
        if (current > 0) {
            count_input.value = current - 1};
    });

    count_add.addEventListener("click", () => {
        let current = ++myCart.cartItems[obj.id].cantidad;//parseInt(count_input.value);
        //item[obj.id].cantidad=current;
        count_input.value = current;
        //update_cartItems(item)
        myCart.updateItem(item);
        //myCart.cartUpdate();
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

    return div;
};
export {template};