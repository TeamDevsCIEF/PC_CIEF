let caja=document.querySelector(".caja");
let boton1=document.querySelector(".boton1");
let number=1;
const hidden= (target)=>{
    target.className+= " hidden";
}

const crearBotones=(target)=>{
    target.innerHTML=`
        <button class="Añadir">Empezar</button>
        <button class="Reiniciar">Empezar</button>
        <h1></h1>
    `
    let botonAñadir=target.querySelector(".Añadir");
    let botonReiniciar=target.querySelector(".Reiniciar");
    botonReiniciar.addEventListener("click",()=>{
        number=1;
        h1.innerHTML=number
    });
    let h1=target.querySelector("h1");
    h1.innerHTML=number;
    botonAñadir.addEventListener("click",()=>{h1.innerHTML=++number}); 
}



boton1.addEventListener("click",() =>crearBotones(caja));

