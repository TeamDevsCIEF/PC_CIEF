// Datos de trabajo

const flores = JSON.parse(localStorage.getItem('flores')) || [
    { nombre: "rosa", color: "rojo", floracion: "primavera", stock: true },
    { nombre: "ciclamen", color: "blanco", floracion: "invierno", stock: true },
    { nombre: "jazmín", color: "blanco", floracion: "verano", stock: true },
    { nombre: "nenúfar", color: "blanco", floracion: "verano", stock: false },
    { nombre: "hortensia", color: "azul", floracion: "verano", stock: false },
    { nombre: "crisantemo", color: "blanco", floracion: "otoño", stock: false },
    { nombre: "cerezo", color: "blanco", floracion: "primavera", stock: false },
    { nombre: "clavel", color: "rojo", floracion: "verano", stock: true },
    { nombre: "geranio", color: "rojo", floracion: "verano", stock: false },
  ];
  
  // EJERCICIO 1
  
  function mostrarFlores() {
      const htmlEjercicio1 = document.getElementById("ejercicio1");
  
      flores.sort((a, b) => {
        // console.log(a.nombre, b.nombre)
        return a.nombre.localeCompare(b.nombre, "es-ES", { numeric: true });
      });
      
      // console.table(flores);
      // Modelo;
      // Flor: rosa, de color rojo, florece en primavera y tenemos stock
      
      let listaFlores = "<ul>";
      let floresLista = "";
      flores.forEach((flor) => {
        floresLista += `<li>Flor: ${flor.nombre}, de color ${
          flor.color
        }, florece en ${flor.floracion} y ${
          flor.stock ? "" : "no"
        } tenemos stock</li>`;
      });
      listaFlores += "</ul>";
      
      htmlEjercicio1.innerHTML = floresLista;
  
  }
  
  mostrarFlores();
  
  // EJERCICIO 2
  const htmlEjercicio2 = document.getElementById("ejercicio2");
  
  listaFlores = "<ul>";
  floresLista = "";
  flores.forEach((flor) => {
    if (flor.color === "blanco" && flor.floracion === "verano") {
      floresLista += `<li>Flor: ${flor.nombre}, de color ${
        flor.color
      }, florece en ${flor.floracion} y ${
        flor.stock ? "" : "no"
      } tenemos stock</li>`;
    }
  });
  listaFlores += "</ul>";
  
  if (floresLista.length === 0)
    floresLista = "Actualmente no hay flores con estas características";
  
  htmlEjercicio2.innerHTML = floresLista;
  
  // EJERCICIO 3
  const htmlEjercicio3 = document.getElementById("ejercicio3");
  
  let formSelection = document.getElementById("form_selection");
  
  formSelection.addEventListener("change", (event) => {
    event.preventDefault();
  
    let color = document.querySelector('input[name="color"]:checked').value;
    let floracion = document.querySelector(
      'input[name="floracion"]:checked'
    ).value;
    let stock = document.querySelector('input[name="stock"]:checked').value;
  
    //   console.log(color, floracion, stock);
    stock = stock === "true";
    //    console.log(stock);
  
    listaFlores = "<ul>";
    floresLista = "";
    flores.forEach((flor) => {
      if (
        flor.color === color &&
        flor.floracion === floracion &&
        flor.stock == stock
      ) {
        floresLista += `<li>Flor: ${flor.nombre}, de color ${
          flor.color
        }, florece en ${flor.floracion} y ${
          flor.stock ? "" : "no"
        } tenemos stock</li>`;
      }
    });
    listaFlores += "</ul>";
  
    if (floresLista.length === 0)
      floresLista = "Actualmente no hay flores con estas características";
  
    htmlEjercicio3.innerHTML = floresLista;
  });
  
  // EJERCICIO 4
  const htmlEjercicio4 = document.getElementById("ejercicio4");
  
  let selectName = document.getElementById("select_name");
  
  selectName.addEventListener("submit", (event) => {
    event.preventDefault();
  
    // console.log(selectName[0].value);
    let nombre = selectName[0].value.trim();
  
    let respuesta = "";
    if (nombre.length === 0) respuesta = "Hace falta escribir un nombre";
    else {
      listaFlores = "<ul>";
      
      for (flor of flores) {
        if (flor.nombre === nombre) {
          respuesta += `<li>Flor: ${flor.nombre}, de color ${
            flor.color
          }, florece en ${flor.floracion} y ${
            flor.stock ? "" : "no"
          } tenemos stock</li>`;
        }
      }
      respuesta += "</ul>";
    }
  
    htmlEjercicio4.innerHTML = respuesta;
  });
  
  // EJERCICIO 5
  
  const addFlower = document.getElementById("add_flower");
  
  addFlower.addEventListener("submit", (event) => {
      event.preventDefault();
  
      let nombre = (addFlower[0].value);
      let color = (addFlower[1].value);
      let floracion = (addFlower[2].value);
      let stock = document.querySelector('input[name="stock2"]:checked').value;
      stock = stock === "true" 
      console.log(stock);
      
      let nuevaFlor = { nombre, color, floracion, stock  }
      console.table(nuevaFlor);
  
  
      flores.push(nuevaFlor);
      console.log(flores);
  
      mostrarFlores()
      localStorage.setItem("flores", JSON.stringify(flores))
  }) 
  