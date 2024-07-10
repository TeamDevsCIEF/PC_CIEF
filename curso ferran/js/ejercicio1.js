let edad=prompt("Cual es tu edad?")

if(edad>=18 && edad<100){
    alert("Eres Mayor de edad")
} 
else if(!parseInt(edad) || (edad<0 || edad>100)){
    alert("edad con error")
}
else{
    alert("No eres Mayor de edad")

}