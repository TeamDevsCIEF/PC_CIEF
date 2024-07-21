import {cartItemTemplate} from './cartItemTemplate.js';
const templateItemCart=(obj = {"id":"","img":{"src":"","alt":""},"producto":"","price":"","currency":"","measurement":""},cantidad=1,myCart=null) => {
    console.log("templateItemCart obj",obj);
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
            myCart.cartUpdate();
            
        }
    });
    count_add.addEventListener("click", () => {
        let current = parseInt(count_input.value);
        count_input.value = current + 1;
        reCalcTotal();
        myCart.cartUpdate();
    });
    
    return carrito_item;

    
};


export {templateItemCart};