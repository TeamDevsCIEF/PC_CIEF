let a=["Jose","juan","pedro"]
for(i in a){    

    document.querySelector("body").innerHTML+=`<h2>Nombre: <h4>${a[i]}</h4></h2>`
}

document.querySelector("body").className="verde"