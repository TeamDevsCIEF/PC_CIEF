const OPCIONES = ["Piedra", "Papel", "Tijeras"];
let ganadasHumano = 0, ganadasMaquina = 0, partidasJugadas = 0, empate = 0;
let continuaJugando = true;

const combinacionGanadora = (combo) => {  
    let comboGanador = "";
    if (combo.includes("Piedra")) {
        if (combo.includes("Papel")) comboGanador = "Papel";
        else if (combo.includes("Tijeras")) comboGanador = "Piedra";
    } else if (combo.includes("Papel")) {
        if (combo.includes("Tijeras")) comboGanador = "Tijeras";
        else if (combo.includes("Piedra")) comboGanador = "Papel";
    }        
    return comboGanador;
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
    while (continuaJugando) {
        const eleccionHumano = await esperarEleccionHumano();

        if (eleccionHumano === "X") {
            continuaJugando = false;
            break;
        }

        let jugadaHumano = OPCIONES[parseInt(eleccionHumano) - 1];
        const generadorJugadaAuto = () => Math.floor(Math.random() * 3 + 1);
        let jugadaMaquina = OPCIONES[generadorJugadaAuto() - 1];

        await mostrarAnimacion(jugadaHumano, jugadaMaquina);

        let resultadoTexto = `Tu jugada: ${jugadaHumano}, Jugada de la máquina: ${jugadaMaquina}. `;
        if (jugadaHumano !== jugadaMaquina) {
            if (combinacionGanadora([jugadaHumano, jugadaMaquina]) === jugadaHumano) {
                resultadoTexto += "¡Ganaste!";
                ganadasHumano++;
            } else {
                resultadoTexto += "¡Perdiste!";
                ganadasMaquina++;
            }
        } else {
            resultadoTexto += "Empate";
            empate++;
        }

        document.getElementById("resultado").innerText = resultadoTexto;
        partidasJugadas++;
        document.getElementById("partidasJugadas").innerText = `Partidas jugadas: ${partidasJugadas}`;
        document.getElementById("ganadasHumano").innerText = `Partidas ganadas por ti: ${ganadasHumano}`;
        document.getElementById("ganadasMaquina").innerText = `Partidas ganadas por la máquina: ${ganadasMaquina}`;
        document.getElementById("empate").innerText = `Empates: ${empate}`;
    }

    alert('Fin del juego');
};

jugar();
