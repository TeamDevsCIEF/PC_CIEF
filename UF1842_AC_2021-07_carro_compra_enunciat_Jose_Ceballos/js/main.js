import ShoppingCart from './modules/shoppingCart.js';
import { productes } from './api.js';
import { template } from './template/template.js';

// Profesor, para más comodidad he creado una lista de productos con los datos que había en el HTML
// con el fin de poder tener más detalle de los productos como la moneda, el precio, etc. ver {productes} que contiene todos los datos de html.


/* 
 * Funciones incluidas en este archivo JavaScript:
 * 
 * 1. Añadir un producto al carrito de compras
 *    - Al añadir un producto, el botón "añadir" desaparece y aparece otro botón para aumentar o disminuir las cantidades.
 * 
 * 2. Aumentar y disminuir la cantidad de productos del carrito
 *    - Actualizar las cantidades en el listado de productos y en el carrito simultáneamente.
 *    - No permitir cantidades de productos negativas.
 *    - Distinguir entre productos con kg o unidad:
 *        - Los productos que se venden por kg su cantidad puede ser fraccionada.
 *        - Los productos que se venden por unidad solo pueden aumentar y disminuir en una unidad.
 * 
 * 3. Poder eliminar los productos del carrito
 *    - Al eliminar los productos del carrito se restablece el botón de agregar al carrito.
 * 
 * 4. Calcular el total de venta por producto individual y sumar todos los totales de los demás productos como total de compra.
 * 
 * 5. Ocultar el carrito mientras no existan productos en él.
 * 
 * 6. No permitir el ingreso de caracteres diferentes a numéricos en los campos de cantidad.
 * 
 * 7. Actualizar la vista del carrito de compras (popup) cuando hay cambios en el contenido del carrito.
 * 
 * 8. Emitir eventos personalizados (usando eventEmitter) para notificar otros componentes sobre los cambios en el carrito.
 * 
 * 9. Validar que el input de cantidad no acepte valores menores que 0 directamente.
 * 
 * 10. Manejar el caso en que el usuario intente ingresar caracteres especiales o texto no numérico en los campos de cantidad.
 * 
 * 11. Asegurar que las cantidades fraccionadas (para productos por kg) sean manejadas correctamente en todas las funciones.
 */


// falta mostrar el boton agregar al borrar del carrito (y tambien al estar en 0 al sacar el foco)


// Crear una nueva instancia de la clase ShoppingCart
const myCart = new ShoppingCart();

// Actualizar el popup del carrito al iniciar
myCart.updateCartPopup();

// Seleccionar el contenedor de los productos en el DOM
let productesDom = document.querySelector(".productes");

// Añadir cada producto al DOM utilizando la plantilla definida y pasándole el carrito
productes.forEach(producte => productesDom.appendChild(template(producte, myCart)));
