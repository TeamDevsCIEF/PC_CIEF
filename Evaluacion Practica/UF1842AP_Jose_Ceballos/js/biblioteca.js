// MINI BIBLIOTECA

const biblioteca = 
    JSON.parse(localStorage.getItem('biblioteca')) || // Recuperamos del localStorage la biblioteca, en caso de no existir la c
    [
        { titulo: "Guerra y Paz", autor: "Lev Tolstoi", categoria: "drama", idioma: "español", epoca: "s.XIX" },
        { titulo: "Anna Karenina", autor: "Lev Tolstoi", categoria: "drama", idioma: "català", epoca: "s.XIX" },
        { titulo: "L'Odisea", autor: "Homero", categoria: "drama", idioma: "català", epoca: "clásica" },
        { titulo: "Antologia de la poesia medieval catalana", autor: "Diversos", categoria: "poesia", idioma: "català", epoca: "clásica" },
        { titulo: "La Ilíada", autor: "Homero", categoria: "drama", idioma: "español", epoca: "clásica" },
        { titulo: "Poema del Mio Cid", autor: "Anónimo", categoria: "poesia", idioma: "español", epoca: "clásica" },
        { titulo: "Veinte mil leguas de viaje submarino", autor: "Jules Verne", categoria: "aventuras", idioma: "español", epoca: "s.XIX" },
        { titulo: "De la Terra a la Lluna", autor: "Jules Verne", categoria: "aventuras", idioma: "català", epoca: "s.XIX" },
        { titulo: "Cinco semanas en globo", autor: "Jules Verne", categoria: "aventuras", idioma: "español", epoca: "s.XIX" },
        { titulo: "Robinson Crusoe", autor: "Daniel Defoe", categoria: "aventuras", idioma: "català", epoca: "clásica" },
        { titulo: "Germinal", autor: 'Émile Zola', categoria: "drama", idioma: "español", epoca: "s.XIX" },
        { titulo: "Notre Dame de Paris", autor: 'Victor Hugo', categoria: "drama", idioma: "català", epoca: "s.XIX" },
        { titulo: "Los Miserables", autor: 'Victor Hugo', categoria: "drama", idioma: "español", epoca: "s.XIX" },
        { titulo: "Yo, robot", autor: "Isaac Asimov", categoria: "ciencia-ficción", idioma: "español", epoca: "s.XX" },
        { titulo: "Fundació", autor: "Isaac Asimov", categoria: "ciencia-ficción", idioma: "català", epoca: "s.XX" },
        { titulo: "Ciberiada", autor: "Stanislaw Lem", categoria: "ciencia-ficción", idioma: "español", epoca: "s.XX" },
        { titulo: "Solaris", autor: "Stanislaw Lem", categoria: "ciencia-ficción", idioma: "català", epoca: "s.XX" },
        { titulo: "El hombre bicentenario", autor: "Isaac Asimov", categoria: "ciencia-ficción", idioma: "español", epoca: "s.XX" },
        { titulo: "Tokio Blues", autor: "Haruki Murakami", categoria: "drama", idioma: "español", epoca: "s.XX" },
        { titulo: "Romancero Gitano", autor: "Federico García Lorca", categoria: "poesia", idioma: "español", epoca: "s.XX" },
        { titulo: "Los aventuras de Sherlock Holmes", autor: 'Arthur Conan Doyle', categoria: "misterio", idioma: "español", epoca: "s.XIX" },
        { titulo: "Rebelió a la granja", autor: 'George Orwell', categoria: "drama", idioma: "català", epoca: "s.XX" },
        { titulo: "La Divina Comedia", autor: "Dante Alighieri", categoria: "drama", idioma: "español", epoca: "clásica" },
        { titulo: "Fahrenheit 451", autor: "Ray Bradbury", categoria: "ciencia-ficción", idioma: "català", epoca: "s.XX" },
        { titulo: "Cròniques Marcianes", autor: "Ray Bradbury", categoria: "ciencia-ficción", idioma: "català", epoca: "s.XX" },
    ]

const sortedbiblioteca=(biblioteca)=> biblioteca.sort((a,b)=> a.titulo.localeCompare(b.titulo,"es",{numeric:true})) // Funcion alterna con items ordenados.

// Ordenar alfabèticament
// biblioteca.sort(function (a, b) {
//     return a.titulo.localeCompare(b.titulo, 'es', { numeric: true })
// });



// ==========================================================================================================
// EJERCICIO 1
// Libros disponibleS
// Mostrar la lista de obras alfabéticamente según el título, en forma de lista ordenada
const renderizarBiblioteca=(sortedbiblioteca)=>{
    const e1=document.querySelector("#listaLibros") //Recuperar el ol del DOM
    let ol=Object.assign(document.createElement('ol'), { id:"e1"  }); // Creamos un contenedor para el producto.
    e1.replaceChildren(); // Limpiar los campos anteriores
    e1.appendChild(ol)
    const e1Template=(titulo)=>{ // Plantilla de los li 
        let li=document.createElement("li")
        li.textContent=titulo;
        return li;
    }
    sortedbiblioteca.forEach(x => {ol.appendChild(e1Template(x.titulo))});// Bucle for para recorrer la biblioteca de los item ordenados y agregarlos al DOM
}
renderizarBiblioteca(sortedbiblioteca(biblioteca))// Primer llamado de la biblioteca para poder renderizar los elementops
// ==========================================================================================================
// EJERCICIO 2
// Filtrar las obras según los criterios indicados en el formulario.
// Las obras que cumplan las condiciones se mostrarán dentro del div con id salidaFiltrada
// Las obras se mostrarán según aparece en la imagen modelo1.png
// Hay que aplicar algunos estilos que ya están definidos en el css

//document.querySelectorAll(".Categorias input[type=radio]:checked"))
const formFiltrado=document.querySelectorAll("#form-filtrado > fieldset div")
let categorias="todo";
let idioma="todo";
let epoca="todo";

const filtrarTodo=()=>{// Crear funcion para filtrar
    let salidaFiltrada=document.querySelector("#salidaFiltrada")
    salidaFiltrada.replaceChildren();// Para limpiar los campos existentes

    const salidaFiltradaTemplate=(autor,titulo)=>{//Este es el template a insertar
        let p=Object.assign(document.createElement('p'), { className:"e2FiltradaAutor"  }); // Creamos un contenedor para el autor.

        p.textContent=autor;
        let span=Object.assign(document.createElement('span'), { className:"autor"  }); // Creamos un contenedor para el titulo.
        span.textContent=` : ${titulo}`;
        p.appendChild(span)
        return p; // devolvcemos un parrafo con los datos de entrada
    }


    let tempFilter=sortedbiblioteca(biblioteca).filter(f=>{ // Filtramos por categorias, epoca e idioma, y devolvemos el elemento resultante
        if(
            (f.categoria==categorias || categorias=="todo")&&
            (f.idioma==idioma || idioma=="todo")&&
            (f.epoca==epoca || epoca=="todo")){
                return f;
            }
    })
    
    
    tempFilter.forEach(item=>{
        salidaFiltrada.appendChild(salidaFiltradaTemplate(item.autor,item.titulo))// Agregamos los elementos resultantes del filtro al html
    })
}


formFiltrado.forEach((e,i)=>{// Recuperamos los inputs del usuario y a cada uno le asignamos un evento para que haga update de la variable correspondiente y llame el filtrado.
    
    if (i===0) {
        e.querySelectorAll("input[type=radio]").forEach(radio=>{
            radio.addEventListener("input",()=>{
                categorias=radio.value;
                filtrarTodo();
            })
        })
    
        }
    else if(i===1){
        e.querySelectorAll("input[type=radio]").forEach(radio=>{
            radio.addEventListener("input",()=>{
                idioma=radio.value;
                filtrarTodo();
            })
        })
    }
    else if(i===2){
        e.querySelectorAll("input[type=radio]").forEach(radio=>{
            radio.addEventListener("input",()=>{
                epoca=radio.value
                filtrarTodo();
            })
        })
    }
    })


// Agregar un evento a cada input para que al tener cambios envie su valor
    
// ==========================================================================================================
// EJERCICIO 3
// Filtrar por autor
// Selección de obras según el nombre o parte del nombre de un autor.
// Al hacer clic sobre el botón buscar se mostrarán las obras cuyos autores cumplen los requisitos.
// La salida por pantalla será en este formato:
// Isaac Asimov : Yo, robot (ciencia-ficción, idioma : español, época : s.XX)


let formAutorSubmit=document.querySelector("#form-autor > label > input[type=submit]")

const filtrarAutor=()=>{
    let formAutor=document.querySelector("#form-autor")
    let inputAutor=formAutor.querySelector("#autor")

    console.log("inputAutor.value.toLocaleLowerCase()",inputAutor.value.toLocaleLowerCase())
    let filteredAutor= sortedbiblioteca(biblioteca.filter(item=> {
        if(item.autor.toLocaleLowerCase().includes(inputAutor.value.toLocaleLowerCase())){ return item;}
    }))
    let salidaAutor=document.querySelector("#salidaAutor");
    salidaAutor.replaceChildren();

    const salidaFiltradaTemplate=(elemento)=>{//Este es el template a insertar
        let p=Object.assign(document.createElement('p'), { className:"e2FiltradaAutor"  }); // Creamos un contenedor para el autor.

        p.textContent=elemento.autor;
        let span=Object.assign(document.createElement('span'), { className:"autor"  }); // Creamos un contenedor para el titulo.
        span.textContent=` : ${elemento.titulo} (${elemento.categoria}, idioma : ${elemento.idioma}, época : ${elemento.epoca})`;
        p.appendChild(span)
        return p; // devolvcemos un parrafo con los datos de entrada
    }

    filteredAutor.length>0 ? 
        filteredAutor.forEach(elemento=>{salidaAutor.appendChild(salidaFiltradaTemplate(elemento))}):
        salidaAutor.innerHTML=`No se encontraron obras de <span class="autor">${inputAutor.value}</span>`

}

formAutorSubmit.addEventListener("click",(event)=>{
    event.preventDefault();
    filtrarAutor();

})


// Si el autor no está en la bilioteca mostrar texto de aviso

// ==========================================================================================================
// EJERCICIO 4
// Añadir obra a la biblioteca
// A partir del formulario, añadir obras a la biblioteca
// Conseguir permanencia con LocalStorage
// Una vez creada será leída en lugar de la lista inicial
// Actualizar automáticamente el listado de obras del ejercicio 1
let newObraTemplate=(titulo,autor,categoria,idioma,epoca)=>{   
    return { titulo, autor, categoria, idioma, epoca}
}


let anadirObra=()=>{
    let incluirAutor= document.querySelector("#incluir-autor").value
    let incluirTitulo= document.querySelector("#incluir-titulo").value
    let incluirCategoria= document.querySelector("#incluir-categoria").value
    let incluirIdioma= document.querySelector("#incluir-idioma").value
    let incluirEpoca= document.querySelector("#incluir-epoca").value
    
    biblioteca.push(newObraTemplate(incluirTitulo,incluirAutor,incluirCategoria,incluirIdioma,incluirEpoca))// Crear nuevo elemento en la biblioteca
    localStorage.setItem("biblioteca", JSON.stringify(biblioteca))// Actualizar el localStorage
}

botonIncluir=document.querySelector("#incluirObra > div:nth-child(7) > button")
botonIncluir.addEventListener("click",anadirObra)

// ==========================================================================================================
// EJERCICIO 5
// Quitar obra de la biblioteca
// Tienes que definir un formulario para seleccionar una obra
// de las disponibles, que será retirada de la biblioteca
// También hay que actualizar el localStorage


function eliminarOption(id){ // crear funcion para eliminar atravez del id del array de la biblioteca
    biblioteca.splice(id,1);// eliminar solo 1 elemento con el id 
    localStorage.setItem("biblioteca", JSON.stringify(biblioteca));// Guardar nuevamente el nuevo item al  storage
    createTemplateSelect();// renderizar el select
    renderizarBiblioteca(sortedbiblioteca(biblioteca))// Renderizar biblioteca
}

let createTemplateSelect=()=>{
    let quitarObraForm=document.querySelector("#quitarObra > form")
    quitarObraForm.replaceChildren()
    let select= document.createElement("select")
    
    let emptyValue=document.createElement("option");// crear un primer elemento del select
    emptyValue.textContent="Seleccione un elemento"
    select.appendChild(emptyValue);

    biblioteca.forEach((item,id)=>{
        let option=document.createElement("option")
        option.textContent=item.titulo // este sera el texto visible en el option
        option.value=id// asignar un id a cada oiption para referencia de eliminar de la biblioteca
        select.appendChild(option);
    })

    select.addEventListener("input",()=>{// crear el evento para eliminar
        eliminarOption(select.value)
        console.log("biblioteca",biblioteca)})
    quitarObraForm.appendChild(select)

}

createTemplateSelect()// Ejecutar por primera vez el select
