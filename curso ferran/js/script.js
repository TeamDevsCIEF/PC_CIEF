let h1 = document.querySelector('h1')
h1.onmouseover = () => {
    h1.style.backgroundColor = "yellow"
}
h1.onmouseout = () => {
    h1.style.backgroundColor = "#000"
}
h1.onclick = () => { 
    h1.style.color = "orange"
    document.querySelector("dialog").show()
}
h1.ondblclick = () => { 
    h1.style.color = "yellow"
}



// () => { código .....}
function cambiarColorFondo() {
    let texto = document.querySelector("#text").value
    document.querySelector("#text").value = ""
    console.log(texto);
    document.querySelector(".datos").innerText = texto
}

function cerrarDialogo() {
    document.querySelector("dialog").close()
}

document.querySelector("h2").addEventListener("click", () => { 
    document.querySelector("body").style.backgroundColor = "darkblue"
    document.querySelector("body").style.color = "white"
})