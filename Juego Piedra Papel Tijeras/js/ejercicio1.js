
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


const combinacionGanadora = (combo) => {  
    if (combo.includes("Piedra")) {
        if (combo.includes("Papel")) return "Papel";
        else if (combo.includes("Tijeras")) return "Piedra";
    } else if (combo.includes("Papel")) {
        if (combo.includes("Tijeras")) return "Tijeras";
        else if (combo.includes("Piedra")) return "Papel";
    }        
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
    while (INDICADORES.continuaJugando) {
        const eleccionHumano = await esperarEleccionHumano();

        if (eleccionHumano === "X") {
            INDICADORES.continuaJugando = false;
            break;
        }

        INDICADORES.jugadas.humano  = INDICADORES.OPCIONES[parseInt(eleccionHumano) - 1];
        
        INDICADORES.jugadas.maquina= INDICADORES.OPCIONES[ INDICADORES.generadorJugadaAuto() - 1];

        await mostrarAnimacion();


        
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
        }
        

        document.getElementById("resultado").innerHTML = INDICADORES.jugadas.resultadoTexto() ;
        console.log("INDICADIRES",INDICADORES)
        INDICADORES.partidasJugadas++;
        document.getElementById("partidasJugadas").innerText = `Partidas jugadas: ${INDICADORES.partidasJugadas}`;
        document.getElementById("ganadasHumano").innerText = `Partidas ganadas por ti: ${INDICADORES.ganadasHumano}`;
        document.getElementById("ganadasMaquina").innerText = `Partidas ganadas por la máquina: ${INDICADORES.ganadasMaquina}`;
        document.getElementById("empate").innerText = `Empates: ${INDICADORES.empate}`;
    }

    alert('Fin del juego');
};

jugar();
