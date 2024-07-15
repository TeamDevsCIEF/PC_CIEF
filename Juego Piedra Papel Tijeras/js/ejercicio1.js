<<<<<<< HEAD

const INDICADORES={
    OPCIONES : ["Piedra", "Papel", "Tijeras"],
    generadorJugadaAuto:() => Math.floor(Math.random() * 3 + 1),
    ganadasHumano:0,
    ganadasMaquina:0,
    partidasJugadas:0,
    empate:0,
    continuaJugando:true,
    jugadas: {
        maquina:"" ,
        humano:"",
        resultado:"",
        resultadoTexto: function()
            { 
                return`Tu jugada: ${this.humano}, Jugada de la máquina: ${this.maquina}. ${this.resultado}`
            }
    }
};

=======
const obj ={
    OPCIONES: ["Piedra", "Papel", "Tijeras"],
    ganadasHumano: 0, ganadasMaquina : 0, partidasJugadas : 0, empate : 0,
    continuaJugando : true,}
>>>>>>> 961fe29c83b3ae2f98f183413fdbe2ff511223c8

const combinacionGanadora = (combo) => {  
    if (combo.includes("Piedra")) {
        if (combo.includes("Papel")) return "Papel";
        else if (combo.includes("Tijeras")) return "Piedra";
    } else if (combo.includes("Papel")) {
        if (combo.includes("Tijeras")) return "Tijeras";
        else if (combo.includes("Piedra")) return "Papel";
<<<<<<< HEAD
    }        
=======
    }
>>>>>>> 961fe29c83b3ae2f98f183413fdbe2ff511223c8
};

const esperarEleccionHumano = () => {
    return new Promise((resolve) => {
        const piedra = document.getElementById("piedra");
        const papel = document.getElementById("papel");
        const tijeras = document.getElementById("tijeras");
        const finish = document.getElementById("finish");

        piedra.addEventListener("click", () => resolve("1"));
        papel.addEventListener("click", () => resolve("2"));
        tijeras.addEventListener("click", () => resolve("3"));
        finish.addEventListener("click", () => resolve("X"));
    });
};

const mostrarAnimacion = () => {
    return new Promise((resolve) => {
        const manoHumano = document.getElementById("manoHumano");
        const manoMaquina = document.getElementById("manoMaquina");
        const opciones= document.querySelector(".opciones")
        const manosContainer= document.querySelector("#manosContainer")

        opciones.className="hidden"
        manosContainer.className=""
        manoHumano.className = `turno${INDICADORES.jugadas.humano}`;
        manoMaquina.className = `turno${INDICADORES.jugadas.maquina}`;

        setTimeout(() => {
            manoHumano.className = `${INDICADORES.jugadas.humano}`;
            manoMaquina.className = `${INDICADORES.jugadas.maquina}`;
        }, 2000);  

        setTimeout(() => {
            manoHumano.className = "";
            manoMaquina.className = "";
            opciones.className="opciones"
            manosContainer.className="hidden"

            resolve();
        }, 4000); 
    });
};

const jugar = async () => {
<<<<<<< HEAD
    while (INDICADORES.continuaJugando) {
        const eleccionHumano = await esperarEleccionHumano();

        if (eleccionHumano === "X") {
            INDICADORES.continuaJugando = false;
            break;
        }

        INDICADORES.jugadas.humano  = INDICADORES.OPCIONES[parseInt(eleccionHumano) - 1];
        
        INDICADORES.jugadas.maquina= INDICADORES.OPCIONES[ INDICADORES.generadorJugadaAuto() - 1];
=======
    while (obj.continuaJugando) {
        const eleccionHumano = await esperarEleccionHumano();

        if (eleccionHumano === "X") {
            obj.continuaJugando = false;
            break;
        }

        let jugadaHumano = obj.OPCIONES[parseInt(eleccionHumano) - 1];
        const generadorJugadaAuto = () => Math.floor(Math.random() * 3 + 1);
        let jugadaMaquina = obj.OPCIONES[generadorJugadaAuto() - 1];
>>>>>>> 961fe29c83b3ae2f98f183413fdbe2ff511223c8

        await mostrarAnimacion();

<<<<<<< HEAD

        
        if (INDICADORES.jugadas.humano !== INDICADORES.jugadas.maquina) {
            if (combinacionGanadora([INDICADORES.jugadas.humano, INDICADORES.jugadas.maquina]) === INDICADORES.jugadas.humano) {
                INDICADORES.jugadas.resultado = "<span class='win'>¡Ganaste!</span>";
                INDICADORES.ganadasHumano++;
            } else {
                INDICADORES.jugadas.resultado = "<span class='lose'>¡Perdiste!</span>";
                INDICADORES.ganadasMaquina++;
            }
        } else {
            INDICADORES.jugadas.resultado = "<span class='empate'>Empate!</span>";
            INDICADORES.empate++;
=======
        let resultadoTexto = `Tu jugada: ${jugadaHumano}, Jugada de la máquina: ${jugadaMaquina}. `;
        if (jugadaHumano !== jugadaMaquina) {
            if (combinacionGanadora([jugadaHumano, jugadaMaquina]) === jugadaHumano) {
                resultadoTexto += "¡Ganaste!";
                obj.ganadasHumano++;
            } else {
                resultadoTexto += "¡Perdiste!";
                obj.ganadasMaquina++;
            }
        } else {
            resultadoTexto += "Empate";
            obj.empate++;
>>>>>>> 961fe29c83b3ae2f98f183413fdbe2ff511223c8
        }
        

<<<<<<< HEAD
        document.getElementById("resultado").innerHTML = INDICADORES.jugadas.resultadoTexto() ;
        console.log("INDICADIRES",INDICADORES)
        INDICADORES.partidasJugadas++;
        document.getElementById("partidasJugadas").innerText = `Partidas jugadas: ${INDICADORES.partidasJugadas}`;
        document.getElementById("ganadasHumano").innerText = `Partidas ganadas por ti: ${INDICADORES.ganadasHumano}`;
        document.getElementById("ganadasMaquina").innerText = `Partidas ganadas por la máquina: ${INDICADORES.ganadasMaquina}`;
        document.getElementById("empate").innerText = `Empates: ${INDICADORES.empate}`;
=======
        document.getElementById("resultado").innerText = resultadoTexto;
        obj.partidasJugadas++;
        document.getElementById("partidasJugadas").innerText = `Partidas jugadas: ${obj.partidasJugadas}`;
        document.getElementById("ganadasHumano").innerText = `Partidas ganadas por ti: ${obj.ganadasHumano}`;
        document.getElementById("ganadasMaquina").innerText = `Partidas ganadas por la máquina: ${obj.ganadasMaquina}`;
        document.getElementById("empate").innerText = `Empates: ${obj.empate}`;
>>>>>>> 961fe29c83b3ae2f98f183413fdbe2ff511223c8
    }

    alert('Fin del juego');
};

jugar();
