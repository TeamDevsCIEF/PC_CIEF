import {productes} from "../../api.js";
class SearchboxForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.palabras = productes.map(producto=> producto.producto);
        this.index = 0;
        this.intervalId = null;
    }
    connectedCallback() { this.loadContent(); }
    async loadContent() {


        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', './js/modules/SearchboxForm/SearchboxForm.css');
        this.shadowRoot.appendChild(linkElem);
        try {
            const response = await fetch('./js/modules/SearchboxForm/SearchboxForm.html');
            if (response.ok) {
                const html = await response.text();
                const wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                this.shadowRoot.appendChild(wrapper);
                this.searchLabelSpan = this.shadowRoot.querySelector('.searchboxForm__label span');
                this.initEvents();
            } else { console.error('Error loading searchboxForm.html:', response.statusText); }
        } catch (error) { console.error('Error fetching searchboxForm.html:', error); }
        }

    initEvents() {
        this.updateLabel();
        this.intervalId = setInterval(() => this.updateLabel(), 5000);

        const input = this.shadowRoot.querySelector('.SearchBox__input');
        const searchboxForm = this.shadowRoot.querySelector('.searchboxForm');

        input.addEventListener('focus', () => {
            console.log('Input enfocado');
            clearInterval(this.intervalId);
            
        });
        input.addEventListener('focusout', (event) => {
            console.log('Input desenfocado');
            const relatedTarget = event.relatedTarget;
            const historyElement = this.shadowRoot.querySelector('#history-element');
            if (!searchboxForm.contains(relatedTarget) && (!historyElement || !historyElement.contains(relatedTarget))) {
                this.updateLabel();
                this.intervalId = setInterval(() => this.updateLabel(), 5000);
                this.hideHistory();
            }
        });

        input.addEventListener('input', async () => {
            clearInterval(this.intervalId);
            if (input.value) {
                await this.updateSuggestions2(input.value);
            } else {
                this.updateLabel();
                this.intervalId = setInterval(() => this.updateLabel(), 5000);
            }
        });
    }

    disconnectedCallback() { clearInterval(this.intervalId); }

    updateLabel() {
        this.searchLabelSpan.style.opacity = 0;
        setTimeout(() => {
            this.searchLabelSpan.textContent = this.palabras[this.index];
            this.searchLabelSpan.style.opacity = 1;
            this.index = (this.index + 1) % this.palabras.length;
        }, 300);
    }

    
}

customElements.define('my-searchboxform', SearchboxForm);
export default SearchboxForm;
