// Dado este array:
let arrayNumeros1 = [4, 5, 3, 8, 2, 7, 1, 6]

// Sin utilizar ningun metodo de la clase Math hay que :
// 1) Crea una función para mostrar por consola la suma de todos los valores
const sumaArray=(array,n=0)=> {array.forEach(nn=>n+=nn);return n;};

// 2) Crea una función para mostrar por consola el promedio

const promedio_array= (array=[])=> (sumaArray(array)/array.length);
// 3) Crea una función para encontrar los valores maximo y mi­nimo
const maxAndminArray=(array)=>{ 
    let max_array;
    let min;
    array.forEach(n=>{
        if(max_array===undefined){max_array=n;}
        else{n>max_array ? max_array=n:null;}})
    return  max_array;  
}


// 4) Crea una función para sumar los valores con i­ndice par y restar los de indice impar




// Dado estos arrays:
let arrayNombres1 = ["Fede", "Anna", "Pepe", "Carles", "Nico", "Ricardo", "Sara", "Pol", "Daniel"]
let arrayNombres2 = ["Clint", "Robert", "James", "Anne", "Ingrid", "John", "Patricia", "Marie"]

// 5) Crea una funcion para encontrar el elemento con el texto mas largo de los dos arrays (no de cada array)
// y guardarlo en la variable varTextoMasLargo
// Si hay mas de un valor, guardarlos en el array arrayTextosMasLargos.


// 6) Lo mismo para el texto mas corto.


// 7) Obten un array llamado longitudNombres que tenga como elementos las longitudes de los textos
// incluidos en cualquiera de los arrays anteriores. Por tanto debes mostrar : [ 8, 5, 4, etc.]


// 8) Crea un array llamado arrayNombresConI que incluya solo los nombres que contengan la letra i


// Dado este array:
let arrayMixto = [ "Marie", 24, "Pol", 18, "Judith", 22, "Eva", 28 ]

// 9) Debes obtener otro array llamado arrayBidimensional que sea asÃ­:
// [ ["Marie", 24 ], ["Pol", 18], ["Judith", 22 ], [ "Eva", 28] ]


// 10) A partir de un array como el que has obtenido en el ejercicio 9,
// debes resolver los ejercios 1, 2, 3 y 4