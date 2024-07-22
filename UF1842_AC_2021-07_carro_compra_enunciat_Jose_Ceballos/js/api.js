// Lista de productos disponibles
const productes=[
    {
        "id":"1",
        "img":{"src":"img/aranja.png",// Ruta de la imagen del producto
            "alt":"Aranja"},// Texto alternativo de la imagen del producto
            "producto":"Pomelo", // Nombre del producto
            "price":"2.50", // Precio del producto
            "currency":"€",  // Moneda del precio
            "measurement":"kg"}, // Unidad de medida del producto
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
];

// Objeto para almacenar los elementos en el carrito, inicialmente vacío
const cartItems = {};

// Exportar los productos y los elementos del carrito para que puedan ser utilizados en otros archivos
export {productes,cartItems};