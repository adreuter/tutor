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

    getRecordInput() {
        return "{"+this.#textarea.value+"}";
    }

    setClassName(className) {
        this.clName = className;
        this.children[0].textContent = className;
    }

    getClassName() {
        return this.clName;
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

    setClassEntry(entry) {
        this.children[0].innerHTML = "";
        this.children[0].appendChild(entry);
    }

    #appendBasesResult(result, basesKey) {
        for(let baseName in result[basesKey]) {
            let base = result[basesKey][baseName];
            let baseCard;
            if(base.valid) {
                baseCard = create({"className": baseName, "type": "secondary"});
                baseCard.setClassEntry(entryNode.create(base));
                baseCard.showRecordResult(base);
            } else {
                baseCard = create({"className": baseName, "type": "danger"});
                baseCard.setClassEntry(entryNode.create(base));
                baseCard.showRecordResult(base);
            }
            this.children[1].appendChild(baseCard);
        }
    }

    showRecordResult(result) {
        this.#hideInput();
        if(!result["hasVptrCorrect"])
            if(result["hasVptr"])
                this.children[1].appendChild(entryNode.create({valid: false, text: "vptr", feedback: "Class does not have a vptr"}));
            else
                this.children[1].appendChild(entryNode.create({valid: false, text: "", feedback: "Expected a vptr"}));
        else if(result["hasVptr"])
                this.children[1].appendChild(entryNode.create({valid: true, text: "vptr"}));
        this.#appendBasesResult(result, "bases");
        for(let memberName in result["members"]) {
            this.children[1].appendChild(entryNode.create(result["members"][memberName]));
        }
        this.#appendBasesResult(result, "virtual-bases");
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
    if(!("type" in options)) {
        options["type"] = "secondary";
    }
    card.children[0].classList.add(`list-group-item-${options["type"]}`);

    return card;
}