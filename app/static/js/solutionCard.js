import * as entryNode from "./entry.js";

const solutionCardTemplate = document.getElementById("solution-card");

class SolutionCard extends HTMLUListElement {
    #textarea;
    constructor() {
        super();
        this.classList.add("list-group");
        this.classList.add("mb-1");
        const clone = solutionCardTemplate.content.cloneNode(true);
        this.appendChild(clone);
        this.#textarea = this.children[1].children[0];
    }

    getEntries() {
        return this.#textarea
            .value
            .split("\n")
            .filter(str => str.match(/\s*\S+\s*/)) // TODO: remove whitespace
    }

    setClassName(className) {
        this.className = className;
        this.children[0].textContent = className;
    }

    getClassName() {
        return this.className;
    }

    #hideInput() {
        this.#textarea
            .classList
            .add("d-none");
    }

    #showInput() {
        this.#textarea
            .classList
            .remove("d-none");
    }

    showResult(result) {
        this.#hideInput();
        for(let entry of result) {
            this.children[1].appendChild(entryNode.create(entry));
        }
    }

    clearResult() {
        this.#showInput();
        let entry = this.#textarea.nextElementSibling;
        while(entry) {
            let prev = entry;
            entry = entry.nextElementSibling;
            prev.remove();
        }
    }
}
customElements.define("solution-card", SolutionCard, { extends: "ul" });

export function create(options) {
    const card = document.createElement("ul", { is: "solution-card"});
    card.setClassName(options.className);
    return card;
}