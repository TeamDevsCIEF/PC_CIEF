const obj ={
    OPCIONES: ["Piedra", "Papel", "Tijeras"],
    ganadasHumano: 0, ganadasMaquina : 0, partidasJugadas : 0, empate : 0,
    continuaJugando : true,}

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

const mostrarAnimacion = (jugadaHumano, jugadaMaquina) => {
    return new Promise((resolve) => {
        const manoHumano = document.getElementById("manoHumano");
        const manoMaquina = document.getElementById("manoMaquina");
        const opciones= document.querySelector(".opciones")
        const manosContainer= document.querySelector("#manosContainer")

        opciones.className="hidden"
        manosContainer.className=""
        manoHumano.className = `turno${jugadaHumano}`;
        manoMaquina.className = `turno${jugadaMaquina}`;

        setTimeout(() => {
            manoHumano.className = `${jugadaHumano}`;
            manoMaquina.className = `${jugadaMaquina}`;
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
    while (obj.continuaJugando) {
        const eleccionHumano = await esperarEleccionHumano();

        if (eleccionHumano === "X") {
            obj.continuaJugando = false;
            break;
        }

        let jugadaHumano = obj.OPCIONES[parseInt(eleccionHumano) - 1];
        const generadorJugadaAuto = () => Math.floor(Math.random() * 3 + 1);
        let jugadaMaquina = obj.OPCIONES[generadorJugadaAuto() - 1];

        await mostrarAnimacion(jugadaHumano, jugadaMaquina);

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
        }

        document.getElementById("resultado").innerText = resultadoTexto;
        obj.partidasJugadas++;
        document.getElementById("partidasJugadas").innerText = `Partidas jugadas: ${obj.partidasJugadas}`;
        document.getElementById("ganadasHumano").innerText = `Partidas ganadas por ti: ${obj.ganadasHumano}`;
        document.getElementById("ganadasMaquina").innerText = `Partidas ganadas por la máquina: ${obj.ganadasMaquina}`;
        document.getElementById("empate").innerText = `Empates: ${obj.empate}`;
    }

    alert('Fin del juego');
};

jugar();
