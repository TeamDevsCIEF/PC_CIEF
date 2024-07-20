// Ejercicios arrays y objetos

// 1 ) Crea un array para albergar al menos 10 números enteros aleatorios entre 1 y 20, luego rellena el array con ellos.
const arrayNEnteros=(n)=>{
    return ((n,x=[]) =>  { while(n>0){x.push(Math.floor(Math.random() * 20 + 1));--n};return x;})(n)
}

const array_10_enteros=arrayNEnteros(10);


// 2) Ahora trata de crear a partir de este array otros dos uno con los números pares y otro con los impares.
const filterParOfArray=(array)=>array.filter(x=>x%2===0);
const filterImparOfArray=(array)=>array.filter(x=>x%2!==0);

const array_pares=filterParOfArray(array_10_enteros);
const array_impares=filterImparOfArray(array_10_enteros);

console.log(array_10_enteros,"\n\n",array_pares,"\n\n",array_impares)


// 3)  Crea un array con al menos 10 elementos para guardar números enteros. 
// Usa un método para obtener la suma de los números pares y la de los números impares.

const sumarArrays=(array=[],x=0)=>{array.forEach(n=>x+=n);return x}
const array_10_enteros2=arrayNEnteros(10);
let sumaParesArray=sumarArrays(filterParOfArray(array_10_enteros2));
let sumaImparesArray=sumarArrays(filterImparOfArray(array_10_enteros2));
let sumaTotalParesImpares=sumarArrays(array_10_enteros2);

console.log("array_10_enteros2",array_10_enteros2);
console.log("sumaParesArray",sumaParesArray)
console.log("sumaImparesArray",sumaImparesArray)
console.log("sumaTotalParesImpares",sumaTotalParesImpares)


// 4) Tienes que crear un script que gestione una lista de la compra. Tienes esta lista de artículos:
let listaCompra = [
    {nombre : "patatas", comprado: true },
    {nombre : "cebollas", comprado: false },
    {nombre : "huevos", comprado: false },
    {nombre : "aceite", comprado: false },
    {nombre : "sal", comprado: true }
]
// Hay que crear una función que devuelva un array con los artículos que faltan por comprar (sólo los nombres). 


listaCompra.forEach(z=>!z.comprado?console.log(`Falta por comprar ${z.nombre}`):null)


// 5) Tienes una lista de objetos con los nombres de los miembros de una familia.
let familia = [
{nombre:'Victor', edad: 38},
{nombre:'Laura', edad: 40},
{nombre:'Clara', edad: 12} ,
{nombre:'Cesar', edad: 14}
]

// Necesitamos una función que devuelva dos objetos con el nombre y edad del miembro de mayor edad y del de menor edad.


const filtarEdadMiembros=(array=[{nombre:'', edad: 0}])=>{
    let menorEdad;
    let mayorEdad;

    array.forEach(a =>{
        if(menorEdad===undefined){menorEdad=a}
        else if(a.edad<menorEdad.edad){menorEdad=a}

        if(mayorEdad===undefined){mayorEdad=a}
        else if(a.edad>mayorEdad.edad){mayorEdad=a}
    })

    return {menorEdad,mayorEdad}

}

let {menorEdad,mayorEdad}=filtarEdadMiembros(familia);

console.log("El objeto del miembro con mayor edad es:",mayorEdad)
console.log("El objeto del miembro con menor edad es:",menorEdad)
