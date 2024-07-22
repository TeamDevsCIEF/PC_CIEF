//Esta clase la he definido para centralizar la ejecucion de diferentes metodos recibidos de los modulos que se suscriban.
class EventEmitter {
    constructor() {
        // definir la variable eventos
        this.events = {};
    }

    // Suscribir a un evento específico .on("nombre del event", "Funcion a ejecutar")
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    // Desuscribir de un evento específico
    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    // Emitir un evento específico 
    emit(event, data) {
        console.log("Evento recibido",event)
        console.log("this.events",this.events)
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(data));
    }
}

const eventEmitter = new EventEmitter();

export {EventEmitter,eventEmitter};