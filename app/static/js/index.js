"use strict";

import * as solutionCard from "./solutionCard.js";

const sourceTextArea = document.getElementById("source");
const astList = document.getElementById("ast-layout");
const vtableList = document.getElementById("vtable-layout");
const buttons = {
    editSource: document.getElementById("edit-source"),
    loadSource: document.getElementById("load-source"),
    editSolution: document.getElementById("edit-solution"),
    checkSolution: document.getElementById("check-solution"),
    showSolution: document.getElementById("show-solution")
};

const buttonGroups = {
    editSource: document.getElementById("edit-source-buttons"),
    editSolution: document.getElementById("edit-solution-buttons"),
    showSolution: document.getElementById("show-solution-buttons")
}

function hide(el) {
    el.classList.add("d-none");
}

function show(el) {
    el.classList.remove("d-none");
}

const tutor = {
    state: "EditSource",
    solution: {},
    editSource: function() {
        this.state = "EditSource";
        sourceTextArea.disabled = false;
        hide(buttonGroups.editSolution);
        hide(buttonGroups.showSolution);
        show(buttonGroups.editSource);
    },
    inputSolution: function() {
        this.state = "InputSolution";
        sourceTextArea.disabled = true;
        hide(buttonGroups.editSource);
        hide(buttonGroups.showSolution);
        show(buttonGroups.editSolution);
    },
    showResult: function() {
        this.state = "SolutionResult";
        hide(buttonGroups.editSolution);
        hide(buttonGroups.editSource);
        show(buttonGroups.showSolution);
    },
    clearSolution: function() {
        astList.textContent = "";
        vtableList.textContent = "";
    }
}

function getValue(entry) {
    if(entry.kind === "offset")
        return `off(${entry.val})`;
    else if(entry.kind === "vptr")
        return `vptr(${entry.val})`;
    else
        return entry.val;
}

buttons.editSource.addEventListener("click", () => {
    tutor.editSource();
    tutor.clearSolution();
});
buttons.loadSource.addEventListener("click", () => {
    fetch('http://127.0.0.1:5000/solution', {
        method: 'POST',
        body: sourceTextArea.value
    })
    .then(res => res.json())
    .then(sol => {
        if("error" in sol)
            console.log(sol["error"]); // TODO: Pop-Up
        else {
            tutor.inputSolution();
            tutor.solution = sol;
            for (let className in sol)
                vtableList.appendChild(solutionCard.create({ className: className }));
        }
    });
    //astList.appendChild(solutionCard.create({ className: "A" }));
});
buttons.editSolution.addEventListener("click", () => {
    for(let card of astList.children) {
        card.clearResult();
    }
    for(let card of vtableList.children) {
        card.clearResult();
    }
    tutor.inputSolution();
});
buttons.checkSolution.addEventListener("click", () => {
    for(let card of astList.children) {
        card.showResult(card
            .getEntries()
            .map((entry) => {
                return {valid: false, text: entry, feedback: "Expected vptr"}
            }))
    }
    for(let card of vtableList.children) {
        const entries = card
            .getEntries()
            .map((str) => {
                let match;
                if(str.match(/\s*RTTI\s*/))
                    return {kind: "RTTI", val: "RTTI"};
                else if(match = str.match(/\s*off\s*\((\d+)\)\s*/))
                    return {kind: "offset", val: match[1]};
                else if(match = str.match(/\s*vptr\s*\((\S+)\)\s*/))
                    return {kind: "vptr", val: match[1]};
                else if(match = str.match(/\s*(\S+)\s*(\S+)\s*/)) // TODO: FIX val space
                    return {kind: "entry", val: match[1] + " " + match[2]};
                else
                    return {kind: "illegal", val: str};
            });
        const sol = [];
        const solEntries = tutor.solution[card.getClassName()];
        let i;
        for(i = 0; i < solEntries.length; i++) {
            let solEntry = solEntries[i];
            if(i >= entries.length) {
                sol.push({valid: false, text: "", feedback: "Missing entry"});
                continue;
            }
            let entry = entries[i];
            if(entry.kind === "illegal")
                sol.push({valid: false, text: entry.val, feedback: "Illegal entry"});
            else if(entry.kind !== solEntry.kind)
                sol.push({valid: false, text: entry.val, feedback: `Wrong kind of entry. Expected ${solEntry.kind} but was ${entry.kind}`});
            else if(entry.val !== solEntry.val)
                sol.push({valid: false, text: entry.val, feedback: `Wrong entry value. Expected ${solEntry.val} but was ${entry.val}`});
            else
                sol.push({valid: true, text: getValue(entry)});
        }
        // check if too many entries
        if(entries.length > i)
            for(; i < entries.length; i++)
                sol.push({valid: false, text: "", feedback: "Too many entries"});
        card.showResult(sol);
    }
    tutor.showResult();
});
buttons.showSolution.addEventListener("click", () => {
    /*for(let card of astList.children) {
        card.clearResult();
        card.showResult([{valid: true, text: "vptr"}]);
    }*/
    for(let card of vtableList.children) {
        card.clearResult();
        const cardSolution = tutor.solution[card.getClassName()];
        for(let entry of cardSolution) {
            card.showResult([{valid: true, text: getValue(entry)}]);
        }
    }
    tutor.showResult();
});