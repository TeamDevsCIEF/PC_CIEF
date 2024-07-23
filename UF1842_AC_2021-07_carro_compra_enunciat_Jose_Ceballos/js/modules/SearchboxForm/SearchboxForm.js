// Importamos los productos desde un archivo llamado api.js
import { productes } from "../../api.js";

// Importamos un sistema de eventos para gestionar la comunicación entre componentes
import { eventEmitter } from "../../eventos/eventEmitter.js";

// Definimos una nueva clase llamada SearchboxForm, que extiende de HTMLElement, para crear un componente personalizado
class SearchboxForm extends HTMLElement {
    constructor() {
        super(); // Llama al constructor de HTMLElement
        this.attachShadow({ mode: 'open' }); // Adjunta un Shadow DOM al elemento, que permite encapsular su estructura y estilos
        this.palabras = productes.map(producto => producto.producto); // Extrae una lista de nombres de productos
        this.index = 0; // Índice para rastrear la posición actual en la lista de nombres de productos
        this.intervalId = null; // Identificador del intervalo para actualizar el texto
    }

    // Método llamado cuando el elemento se agrega al DOM
    connectedCallback() { 
        this.loadContent(); // Carga el contenido del componente
    }

    // Método asíncrono para cargar el contenido HTML y CSS del componente
    async loadContent() {
        // Crea y adjunta un enlace al archivo CSS para los estilos del componente
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', './js/modules/SearchboxForm/SearchboxForm.css');
        this.shadowRoot.appendChild(linkElem);

        try {
            // Hace una solicitud para obtener el archivo HTML del componente
            const response = await fetch('./js/modules/SearchboxForm/SearchboxForm.html');
            if (response.ok) {
                const html = await response.text(); // Obtiene el texto HTML
                const wrapper = document.createElement('div'); // Crea un contenedor
                wrapper.innerHTML = html; // Inserta el HTML en el contenedor
                this.shadowRoot.appendChild(wrapper); // Añade el contenedor al Shadow DOM
                this.searchLabelSpan = this.shadowRoot.querySelector('.searchboxForm__label span'); // Selecciona el elemento donde se mostrará el nombre del producto
                this.initEvents(); // Inicializa los eventos del componente
            } else { 
                console.error('Error loading searchboxForm.html:', response.statusText); // Muestra un error si la carga falla
            }
        } catch (error) { 
            console.error('Error fetching searchboxForm.html:', error); // Muestra un error si la solicitud falla
        }
    }

    // Método para inicializar los eventos del componente
    initEvents() {
        this.updateLabel(); // Actualiza el texto inicialmente
        this.intervalId = setInterval(() => this.updateLabel(), 3500); // Configura un intervalo para actualizar el texto cada 3.5 segundos

        const input = this.shadowRoot.querySelector('.SearchBox__input'); // Selecciona el campo de entrada
        const searchboxForm = this.shadowRoot.querySelector('.searchboxForm'); // Selecciona el formulario de búsqueda

        // Agrega un evento para cuando el campo de entrada recibe el foco
        input.addEventListener('focus', () => {
            console.log('Input enfocado'); // Mensaje en la consola
            clearInterval(this.intervalId); // Detiene la actualización del texto
        });

        // Agrega un evento para cuando el campo de entrada pierde el foco
        input.addEventListener('focusout', (event) => {
            console.log('Input desenfocado'); // Mensaje en la consola
            const relatedTarget = event.relatedTarget; // Elemento que recibe el foco
            const historyElement = this.shadowRoot.querySelector('#history-element'); // Elemento de historial de búsqueda
            // Si el foco no está en el formulario de búsqueda ni en el historial, reinicia la actualización del texto
            if (!searchboxForm.contains(relatedTarget) && (!historyElement || !historyElement.contains(relatedTarget))) {
                this.updateLabel(); // Actualiza el texto
                this.intervalId = setInterval(() => this.updateLabel(), 5000); // Reinicia el intervalo para actualizar el texto cada 5 segundos
            }
        });

        // Agrega un evento para cuando el usuario escribe en el campo de entrada
        input.addEventListener('input', async () => {
            clearInterval(this.intervalId); // Detiene la actualización del texto
            if (input.value) {
                this.filterProducts(input.value); // Filtra los productos basándose en la entrada del usuario
            } else {
                this.updateLabel(); // Actualiza el texto
                this.intervalId = setInterval(() => this.updateLabel(), 5000); // Reinicia el intervalo para actualizar el texto
                eventEmitter.emit("filterProduct", ""); // Emite un evento para filtrar los productos (sin filtro)
            }
        });
    }

    // Método llamado cuando el elemento se elimina del DOM
    disconnectedCallback() { 
        clearInterval(this.intervalId); // Detiene la actualización del texto
    }

    // Método para actualizar el texto mostrado con el nombre del siguiente producto
    updateLabel() {
        this.searchLabelSpan.style.opacity = 0; // Oculta el texto actual
        setTimeout(() => {
            this.searchLabelSpan.textContent = this.palabras[this.index]; // Cambia el texto al siguiente producto
            this.searchLabelSpan.style.opacity = 1; // Muestra el nuevo texto
            this.index = (this.index + 1) % this.palabras.length; // Actualiza el índice para el próximo producto
        }, 250); // Retraso de 250ms para el cambio de texto
    }

    // Método para emitir un evento que filtra los productos basándose en la palabra dada
    filterProducts(word = "") {
        eventEmitter.emit("filterProduct", word); // Emite el evento con la palabra de búsqueda
    }
}

// Define el nuevo elemento personalizado en el DOM con el nombre 'my-searchboxform'
customElements.define('my-searchboxform', SearchboxForm);

// Exporta la clase para que pueda ser utilizada en otros módulos
export default SearchboxForm;
