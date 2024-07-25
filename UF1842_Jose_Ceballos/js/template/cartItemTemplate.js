const cartItemTemplate=(id,template=null,total=0,cantidad=0)=>{ 
    // Esta función crea una plantilla para un ítem del carrito.
    // 'id' es el identificador único del producto.
    // 'template' es un objeto que contiene la plantilla del producto, por defecto es null.
    // 'total' representa el precio total del producto en el carrito, por defecto es 0.
    // 'cantidad' es la cantidad del producto en el carrito, por defecto es 0.

    return {[id]:{template,total,cantidad}};};
    
    // Devolvemos un objeto con la estructura: { id: { template, total, cantidad } }
    // Esto organiza la información del producto en el carrito usando su 'id' como clave.
export {cartItemTemplate};