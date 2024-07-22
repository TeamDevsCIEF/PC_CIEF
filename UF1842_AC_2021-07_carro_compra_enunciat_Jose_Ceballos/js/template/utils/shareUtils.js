import {eventEmitter} from "../../eventos/eventEmitter.js"; // Importamos un manejador de eventos para comunicar cambios entre diferentes partes de la aplicación.

// Función para disminuir la cantidad basada en el tipo de medida (unidad o kilogramo).
const decrement_Input = ({ count_input, obj, item }) => {
    let current = count_input.value; // Obtenemos el valor actual del input.   
    if (current > 0) { // Si el valor del input es mayor a 0, procedemos a implementar la lógica de decremento.
        switch (obj.measurement) {
            case "unit":
                current = parseInt(current) - 1; // Disminuimos la cantidad en una unidad.
                break;
            case "kg":
                current = (parseFloat(current) - parseFloat(0.01)).toFixed(2); // Disminuimos la cantidad en 0.01 kg.
                break;
            default:
                console.log("Error en la medida"); // Mostramos un error si la medida no es reconocida.
        }
    }
    item[obj.id].cantidad = current; // Actualizamos la cantidad en el ítem del carrito.
};

// Función para aumentar la cantidad basada en el tipo de medida (unidad o kilogramo).
const increment_Input = ({count_input,obj,item}) => {
    let current;
    switch (obj.measurement) {
        case "unit":
            current = parseInt(count_input.value) + 1; // Aumentamos la cantidad en una unidad.
            break;
        case "kg":
            current = (parseFloat(count_input.value) + parseFloat(0.01)).toFixed(2); // Aumentamos la cantidad en 0.01 kg.
            break;
        default:
            console.log("Error en la medida"); // Mostramos un error si la medida no es reconocida.
    }
    item[obj.id].cantidad = current; // Actualizamos la cantidad en el ítem del carrito.
};

// Función para actualizar la cantidad cuando se pierde el foco del campo de entrada.        
const increment_InputBlur = ({count_input,obj,item}) => { 
    let current = count_input.value; // Obtenemos el valor actual del input.
    if (current > 0) { // Si el valor del input es mayor a 0, procedemos a implementar la logica de decremento.
        switch (obj.measurement) {
            case "unit":
                item[obj.id].cantidad = Math.ceil(count_input.value); // Redondeamos la cantidad a la unidad más cercana.
                eventEmitter.emit(`updateInputOfTemplate`, item); // Emitimos un evento para notificar el cambio de cantidad.
                break;
            case "kg":
                item[obj.id].cantidad = parseFloat(count_input.value).toFixed(2); // Mantenemos la cantidad con dos decimales.
                eventEmitter.emit(`updateInputOfTemplate`, item); // Emitimos un evento para notificar el cambio de cantidad.
                break;
            default:
                console.log("Error en la medida"); // Mostramos un error si la medida no es reconocida.
        }
    } else {
        item[obj.id].cantidad = 0; // Si el valor es negativo actualizamos el valor a cero.
        eventEmitter.emit(`updateInputOfTemplate`, item); // Emitimos un evento para notificar el cambio de cantidad.
    }
};


export {decrement_Input,increment_Input,increment_InputBlur}