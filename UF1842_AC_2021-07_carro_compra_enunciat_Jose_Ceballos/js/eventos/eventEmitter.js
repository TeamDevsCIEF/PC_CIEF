// Esta clase la he definido para centralizar la ejecución de diferentes métodos recibidos de los módulos que se suscriban.
class EventEmitter {
    constructor() {
        // Esta variable eventos es para almacenar las funciones asociadas a cada evento.
        this.events = {};
    }

    // Suscribir una función a un evento específico. 
    // .on("nombre del evento", "Función a ejecutar cuando el evento ocurra")
    on(event, listener) {
        // Si no hay funciones asociadas a este evento, crear un array vacío.
        if (!this.events[event]) {
            this.events[event] = [];
        }
        // Agregar la nueva función al array de funciones del evento.
        this.events[event].push(listener);
    }

    // Desuscribir una función de un evento específico.
    // .off("nombre del evento", "Función a eliminar")
    off(event, listenerToRemove) {
        // Si no hay funciones asociadas a este evento, salir.
        if (!this.events[event]) return;
        // Filtrar las funciones y eliminar la que queremos quitar.
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    // Emitir (disparar) un evento específico con datos opcionales.
    // .emit("nombre del evento", "Datos que se pasan a las funciones suscritas")
    emit(event, data) {
        // Si no hay funciones asociadas a este evento, salir.
        if (!this.events[event]) return;
        // Ejecutar cada función asociada al evento, pasando los datos.
        this.events[event].forEach(listener => listener(data));
    }
}

// Crear una instancia de la clase EventEmitter.
const eventEmitter = new EventEmitter();

// Exportar la instancia para que puedan ser usadas global.
export {eventEmitter};
