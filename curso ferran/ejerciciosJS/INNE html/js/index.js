let usuario="Jab";
let productoComprado=0;
const DESCUENTO=0.1;
let precioDescuento;
const PRODUCTOS=[{
    producto:"Pantalón",
    precio:10,
    talla:"m",
    imagen:"pantalon.jpg"
  },{
    producto:"Gorra",
    precio:5,
    talla:"s",
    imagen:"gorra.jpg"
  }
];

let section= (producto,precio,talla,imagen)=>`
<section class="caja">
  <div>
    ${producto}
    ${precio} €
  </div>
  <div>
    Talla: ${talla}
  </div>
  <img src="img/${imagen}" alt="${producto}">
</section>`

let body=(content)=>`
<h1>${usuario}</h1>
   ${content}t} 
  `
let bodyContent="";
for(let productos of PRODUCTOS){
  bodyContent=bodyContent+section(productos.producto,productos.precio,productos.talla,productos.imagen)

}
document.querySelector('body').innerHTML = body(bodyContent);