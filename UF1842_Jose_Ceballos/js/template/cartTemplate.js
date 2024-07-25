const totalCompra=()=>{
    
    let totalCompra= Object.assign(document.createElement('div'), { id: "totalCompra" }); // Creamos un contenedor para ingresar los elementos del total de la compra.
    totalCompra.textContent="Total Compra:";

    let total= Object.assign(document.createElement('span'), { id: "total" }); // Contenedor del total.
    total.innerHTML=`<i class="fas fa-shopping-cart fa-sm"></i>`;
    let preuFinal=Object.assign(document.createElement('span'), { id: "preuFinal" }); // precio a ser actualizado
    preuFinal.textContent="0,00€";
    total.appendChild(preuFinal)

    totalCompra.append(total)

    return totalCompra;


}

const cartTemplate=(obj = {"product": "Producto", "price": "Precio", "q": "Cantidad", "Total": "Total","delete":"Eliminar"})=>{
    let carrito= Object.assign(document.createElement('ul'), { id: "carrito" }); // Creamos un contenedor para ingresar los elementos del carrito de compras.

    let header= Object.assign(document.createElement('li'), { className: "carrito_item_li carrito_item_header" }); // Creamos la cabecera del carrito.
    let product=document.createElement("p") // Para mostrar el nombre del producto
    product.textContent=`${obj.product}`;
    let price=document.createElement("p") // Para mostrar el precio del producto
    price.textContent=`${obj.price}`;
    let quantity=document.createElement("p") // Para mostrar la cantidad del producto
    quantity.textContent=`${obj.q}`;
    let total=document.createElement("p") // Para mostrar el total de la compra
    total.textContent=`${obj.Total}`;
    let _delete=document.createElement("p") // Para mostrar el icono de borrar
    _delete.textContent=`${obj.delete}`;

    header.append(product,price,quantity,total,_delete) // Insertamos todos los elementos que contendra la cabecera
    carrito.appendChild(header) // Insertamos la cabecera al carrito

    return carrito; // retornamos el carrito
}

const cartEmptyTemplate=()=>{
    let carrito=cartTemplate();

    let item= Object.assign(document.createElement('li'), { className: "carrito_item_li carrito_item" }); // Creamos el contenedor de productos vacios.
    let product=document.createElement("p") // Para mostrar el nombre del producto
    let price=document.createElement("p") // Para mostrar el precio del producto
    let quantity=Object.assign(document.createElement("p"),{style:"height: 3.5vh;"}); // Para mostrar la cantidad del producto 
    let total=document.createElement("p") // Para mostrar el total de la compra
    let _delete=document.createElement("p") // Para mostrar el icono de borrar

    item.append(product,price,quantity,total,_delete) // Insertamos todos los elementos que contendra el producto.

    carrito.appendChild(item) // insertamos el objjeto vacio al carrito
    return carrito;

}

export {cartTemplate,cartEmptyTemplate,totalCompra};