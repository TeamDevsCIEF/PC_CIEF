let nombre = document.querySelector("#nombre");
let boton = document.querySelector(".boton");
let resultadoBox = document.querySelector(".resultado");
let resultadoBoxCreated=false;

const limpiarInput=() => {
    nombre.value = "";
};
const focusInput=() => {
    nombre.focus();
};
const primeraLetraMayusculaInput=() => {
    return nombre.value.charAt(0).toUpperCase() + nombre.value.slice(1);
};
const depurarInputValue=() => {
    nombre.value = nombre.value.trim();
    if(nombre.value === ""){
        alert("Debes introducir un nombre");
        return;
    }
    
    crearOption(primeraLetraMayusculaInput());
    limpiarInput();
    focusInput();
};

const crearOption=(value)=>{
    if(!resultadoBoxCreated){
        resultadoBox.innerHTML = 
        `<select id="select">

        </select>`;
        resultadoBoxCreated = true;
    }

    let select = document.querySelector("#select");
    let option = `<option value="">${value}</option>`;
    select.innerHTML += option;    
};

boton.addEventListener("click",depurarInputValue);
