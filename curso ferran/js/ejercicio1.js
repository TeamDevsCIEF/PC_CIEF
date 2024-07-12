/*
1- Tener claros los requerimientos (Reglas del Juego)
2- Dividir el proyecto en partes
    2.1  solucionar la logica una partida
    2.2  solucionar las posibles entradas de informacion erroneas por parte del usuario
    2.3  permitir jugar varias veces (ma´+rcador)
    2.4 trasladar el juego a una pagina web (GUI)
    2.5 publicar el juego
3- empezar por la mas basica
4-  
*/


// NORMAS DEL JUEGO

// Jugaremos contra la máquina

// Hay tres posibilidades:
// cada una puede ganar, perder o empatar con las otra de las demás
// P.e.: piedra gana a tijeras, pierde con papel y empata con piedra

let nombreJugador = ""

let menu = `
OPCIONES DEL JUEGO
==================
Debes elegir una opción:

1. Piedra
2. Papel
3. Tijeras
X. Finaliza el juego

Cualquier otra opción reinicia el juego
`
const OPCIONES=["Piedra","Papel","Tijeras"]

const COMBINACIONES={
    "PiedraPapel":"Papel",
    "PiedraTijeras":"Piedra",
    "PiedraPiedra":null,
    "PapelPiedra":"Papel",
    "PapelTijeras":"Tijeras",
    "PapelPapel":null,
    "TijerasPiedra":"Piedra",
    "TijerasPapel":"Tijeras",
    "TijerasTijeras":null,
}

let eleccionHumano = 1
let jugadaHumano= OPCIONES[eleccionHumano-1]


//if(parseInt(eleccionHumano) || eleccionHumano==="X"){}

const generadorJugadaAuto=()=> Math.floor(Math.random()*3+1)
let jugadaMaquina=OPCIONES[generadorJugadaAuto]

let combinacionGanadora=(combo)=> {  
    let comboGanador="";
    console.log(combo.includes("Piedra") && combo.includes("Papel"))
    switch(combo){
        case combo.includes("Piedra") && combo.includes("Papel"):{comboGanador= "Papel" 
            
        }
    }
return comboGanador;
}

console.log(combinacionGanadora(["Piedra","Papel"]))
if(eleccionHumano===generadorJugadaAuto){
 console.log("empate")   
}
else if(true){
    console.log("Haz pperdido")
}


 