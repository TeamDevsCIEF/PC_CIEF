// Valor a modificar
let nota=4;


let divResultado= document.querySelector("div.resultado");
let divNota= document.querySelector("div.nota");

divResultado.innerHTML=(nota >=5 && nota <=10)? "¡¡Has APROBADO!!":"Has suspendido";
divResultado.className=(nota >=5 && nota <=10)? "resultado aprobado":"resultado suspendido";

divNota.innerHTML=(nota <0 || nota>10) ? "No te flipes" : (nota>=9) ? "Excelente" : (nota>=7) ? "Notable": (nota>=5) ? "Aprobado" : "Suspendido";
/*
A mostrar en el <div class="resultado">
Si es de 5 a 10: "¡¡Has APROBADO!!"(color "green")
o sinó: "Has suspendido" (color "red")

A mostrar en el <div class="nota">
De 9 en adelante:       "Excelente"
De 7 a menos de 9:      "Notable"
De 5 hasta menos de 7:  "Aprobado"
Menos de 5:             "Suspendido"
Menos de 0 o más de 10: "No te flipes"
*/

/* Usar sólo TERNARIOS
(...) ? :
*/