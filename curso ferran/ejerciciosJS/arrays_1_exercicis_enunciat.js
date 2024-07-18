// Se te proponen una serie de ejercicios para practicar
// los arrays y el bucle for.

// Para resolver NO hay que utilizar ninguna funciÃ³n matemÃ¡tica
// Crea el cÃ³digo necesario para resolver los requerimientos

// Dado este array:
let arrayNumeros1 = [-7,4, 5, 3, 8, 2, 7, 1, 6]
let arrayNumeros2 = [-3,4, 2, 7, 1, 6]
// o cualquier otro array solo con nÃºmeros

// 1) Mostrar por consola la suma de todos los valores
let suma_arrayNumeros1=0;
let suma_arrayNumeros2=0;

arrayNumeros1.forEach(n=>suma_arrayNumeros1+=n)
arrayNumeros2.forEach(n=>suma_arrayNumeros2+=n)

console.log("suma_arrayNumeros1",suma_arrayNumeros1)
console.log("suma_arrayNumeros2",suma_arrayNumeros2)

// 2) Mostrar por consola el promedio
let promedio_arrayNumeros1=suma_arrayNumeros1/arrayNumeros1.length;
let promedio_arrayNumeros2=suma_arrayNumeros2/arrayNumeros2.length;
console.log("promedio_arrayNumeros1",promedio_arrayNumeros1)
console.log("promedio_arrayNumeros1",promedio_arrayNumeros2)


// 3) Encontrar los valores mÃ¡ximo y mÃ­nimo
const f_max_array=(array)=>{ 
    let max_array;
    array.forEach(n=>{
        if(max_array===undefined){
            max_array=n;
        }else{
            n>max_array ? max_array=n:null;}})
    return  max_array;  
    }
const f_min_array=(array)=>{ 
    let min_array;
    array.forEach(n=>{
        if(min_array===undefined){
            min_array=n;
        }else{
            n<min_array? min_array=n:null;}})
    return  min_array;  
    }
    

console.log(`El max_arrayNumeros1 = ${f_max_array(arrayNumeros1)} y el min_arrayNumeros1 = ${f_min_array(arrayNumeros1)}`)
console.log(`El max_arrayNumeros2 = ${f_max_array(arrayNumeros2)} y el min_arrayNumeros2 = ${f_min_array(arrayNumeros2)}`)

// 4) Sumar los valores con Ã­ndice par y restar los impares
const f_par_impar= (array=[]) => {   
    let sum_par=0;
    let sum_impar=0;
    array.forEach((n,i)=>{
        if(i%2===0){sum_par+=n}
        else{sum_impar+=n}
    })
    let resultado= sum_par-sum_impar;
    resultado=resultado<0?resultado*-1:resultado;

    return {sum_par,sum_impar,resultado}
}
const parImparArray1=f_par_impar(arrayNumeros1)
const parImparArray2=f_par_impar(arrayNumeros2)

console.log(`La suma del array1 ${arrayNumeros1} es ${parImparArray1.resultado}:\n sumas de los pares es=${parImparArray1.sum_par}\nsumas de los impares es=${parImparArray1.sum_impar}`)
console.log(`\nLa suma del array2 ${arrayNumeros2} es ${parImparArray2.resultado}:\n sumas de los pares es=${parImparArray2.sum_par}\nsumas de los impares es=${parImparArray2.sum_impar}`)
// Hay que mostrar por consola cada resultado

// Dado estos arrays:
let arrayNombres1 = ["Fede", "Anna", "Pepe", "Carles", "Nico", "Ricardo", "Sara", "Pol", "Daniel"]
let arrayNombres2 = ["Clint", "Robert", "James", "Anne", "Ingrid", "John", "Patricia", "Marie"]

// 5) Crea una funciÃ³n para encontrar el elemento con0 el texto mÃ¡s largo de los dos arrays (no de cada array)
// y guardarlo en la variable varTextoMasLargo
// Si hay mÃ¡s de un valor, guardarlos en el array arrayTextosMasLargos.

const f_textoMasLargo=(array=[])=>{
    let maxText=""
    let minText; 
    
    const comparar = (array)=>{
        let max_text="";
        let min_text;
        array.forEach(z=>{
            if(z.length > max_text.length){
                max_text=z; 
            }
            if(min_text===undefined){
                minText=x;
            }else if(z.length < min_text.length){
                min_text=z;
            }
        })
        return {min_text,max_text}
    }
    const min=(t1,t2)=> t2.length<t1.length? t2:t1;
    const max=(t1,t2)=> t2.length>t1.length? t2:t1;


    array.forEach(x=>{
        let temp_max_text="";
        let temp_min_text;
        x.forEach(z=>{
            let mn,mx=comparar(z);
            temp_min_text=min(temp_min_text,mn)  
            temp_max_text=max(temp_max_text,mx)
        })
            
    })

}

    return maxText;
}
console.log(`El texto mas largo es ${f_textoMasLargo([arrayNombres1,arrayNombres2])}`)

// 6) Lo mismo para el texto mÃ¡s corto.


// 7) ObtÃ©n un array llamado longitudNombres que tenga como elementos las longitudes de los textos
// incluidos en cualquiera de los arrays anteriores. Por tanto debes mostrar : [ 8, 5, 4, etc.


// 8) Crea un array llamado arrayNombresConI que incluya solo los nombres que contengan la letra i


// Dado este array:
let arrayMixto = [ "Marie", 24, "Pol", 18, "Judith", 22, "Eva", 28 ]

// 9) Debes obtener otro array llamado arrayBidimensional que sea asÃ­:
// [ ["Marie", 24 ], ["Pol", 18], ["Judith", 22 ], [ "Eva", 28] ]


// 10) A partir de un array como el que has obtenido en el ejercicio 9,
// debes resolver los ejercios 1, 2, 3 y 4