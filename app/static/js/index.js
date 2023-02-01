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
    fetch('http://192.168.69.33:5000/solution', {
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
            for (let className in sol["vtables"])
                vtableList.appendChild(solutionCard.create({ className: className }));
            for (let className in sol["records"])
                astList.appendChild(solutionCard.create({ className: className }));
        }
    });
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

function checkBases(args, res, isVirtual) {
    const basesKey = isVirtual ? "virtual-bases" : "bases";
    const isVirtualStr = isVirtual ? "virtual-" : "";
    const solBases = Object.keys(args.solution[basesKey]);
    const recBases = Object.keys(args.record[basesKey]);
    let i;
    for(i = 0; i < solBases.length; i++) {
        let solBase = solBases[i];
        if(i >= recBases.length) {
            //res[basesKey][solBase] = {};
            res[basesKey][solBase] = checkRecord({record: {}, solution: args.solution[basesKey][solBase]});
            res[basesKey][solBase]["valid"] = false;
            res[basesKey][solBase]["feedback"] = `Missing ${isVirtualStr}base ${solBase}`;
            res[basesKey][solBase]["text"] = "";
            continue;
        }
        let recBase = recBases[i];
        if(solBase === recBase) {
            res[basesKey][recBase] = checkRecord({record: args.record[basesKey][recBase], solution: args.solution[basesKey][solBase]});
            res[basesKey][recBase]["valid"] = true;
            res[basesKey][recBase]["text"] = recBase;
        } else {
            res[basesKey][recBase] = checkRecord({record: args.record[basesKey][recBase], solution: args.solution[basesKey][solBase]});
            res[basesKey][recBase]["valid"] = false;
            res[basesKey][recBase]["feedback"] = `Expected ${isVirtualStr}base ${solBase} but was ${recBase}`;
            res[basesKey][recBase]["text"] = recBase;
        }
    }
    if(i < recBases.length) {
        for(; i < recBases.length; i++) {
            let recBase = recBases[i];
            res[basesKey][recBase] = checkRecord({record: args.record[basesKey][recBase], solution: {"hasVptr": false, "bases": {}, "members": {}, "virtual-bases": {}}});
            res[basesKey][recBase]["valid"] = false;
            res[basesKey][recBase]["feedback"] = `Did not expect ${isVirtualStr}base ${recBase}`;
            res[basesKey][recBase]["text"] = recBase;
        }
    }
    return res;
}

function checkRecord(args) {
    if(!("bases" in args.record))
        args.record.bases = {};
    if(!("virtual-bases" in args.record))
        args.record["virtual-bases"] = {};
    if(!("hasVptr" in args.record))
        args.record.hasVptr = false;
    if(!("members" in args.record))
        args.record.members = {};
    let res = structuredClone(args.record);
    res["hasVptrCorrect"] = args.record["hasVptr"] === args.solution["hasVptr"];
    
    checkBases(args, res, false);
    checkBases(args, res, true);

    const solMembers = Object.keys(args.solution["members"]);
    const recMembers = Object.keys(args.record["members"]);
    let i;
    for(i = 0; i < solMembers.length; i++) {
        let solMember = solMembers[i];
        if(i >= recMembers.length) {
            res["members"][solMember] = {};
            res["members"][solMember]["valid"] = false;
            res["members"][solMember]["feedback"] = `Missing member ${solMember}`;
            res["members"][solMember]["text"] = "";
            continue;
        }
        let recMember = recMembers[i];
        res["members"][recMember] = {};
        const recMemberType = args.record["members"][recMember];
        const solMemberType = args.solution["members"][solMember];
        if(solMember === recMember) {
            if(recMemberType === solMemberType) {
                res["members"][recMember]["valid"] = true;
                res["members"][recMember]["text"] = recMemberType + " " + recMember;
            } else {
                res["members"][recMember]["valid"] = false;
                res["members"][recMember]["feedback"] = `Expected type ${solMemberType} but was ${recMemberType}`;
                res["members"][recMember]["text"] = recMemberType + " " + recMember;
            }
        } else {
            res["members"][recMember]["valid"] = false;
            res["members"][recMember]["feedback"] = `Expected member ${solMember} but was ${recMember}`;
            res["members"][recMember]["text"] = recMemberType + " " + recMember;
        }
    }
    if(i < recMembers.length) {
        for(; i < recMembers.length; i++) {
            let recMember = recMembers[i];
            const recMemberType = args.record["members"][recMember];
            res["members"][recMember] = {};
            res["bases"][recMember]["valid"] = false;
            res["bases"][recMember]["feedback"] = `Did not expect member ${recMember}`;
            res["bases"][recMember]["text"] = recMemberType + " " + recMember;
        }
    }

    return res;
}

function checkVtable() {
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
                    return {kind: "method", val: match[1] + " " + match[2]};
                else
                    return {kind: "illegal", val: str};
            });
        const sol = [];
        const solEntries = tutor.solution["vtables"][card.getClassName()];
        let i;
        for(i = 0; i < solEntries.length; i++) {
            let solEntry = solEntries[i];
            if(i >= entries.length) {
                sol.push({valid: false, text: "", feedback: `Missing entry. Expected ${solEntry.kind}`});
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
                sol.push({valid: false, text: entry.val, feedback: "Too many entries"});
        card.showResult(sol);
    }
}

buttons.checkSolution.addEventListener("click", () => {
        try {
            for(let card of astList.children) {
                const input = JSON.parse(card.getRecordInput());
                const res = checkRecord({record: input, solution: tutor.solution["records"][card.getClassName()]});
                res["valid"] = true;
                card.showRecordResult(res);
            }
            checkVtable();
            tutor.showResult(); 
        } catch(e) {
            console.log(e); // TODO: Pop-Up
            for(let card of astList.children) {
                card.clearResult();
            }
            for(let card of vtableList.children) {
                card.clearResult();
            }
        }
});

function generateRecordSolution(res) {
    res["hasVptrCorrect"] = true;
    res["valid"] = true;
    for(let base in res["bases"]) {
        generateRecordSolution(res["bases"][base]);
        res["bases"][base]["valid"] = true;
        res["bases"][base]["text"] = base;
    }
    for(let member in res["members"])
        res["members"][member] = {valid: true, text: res["members"][member] + " " + member};
    for(let base in res["virtual-bases"]) {
        generateRecordSolution(res["virtual-bases"][base]);
        res["virtual-bases"][base]["valid"] = true;
        res["virtual-bases"][base]["text"] = base;
    }
}

buttons.showSolution.addEventListener("click", () => {
    for(let card of astList.children) {
        card.clearResult();
        let res = structuredClone(tutor.solution["records"][card.getClassName()]);
        generateRecordSolution(res);
        card.showRecordResult(res);
        tutor.showResult(); 
    }
    for(let card of vtableList.children) {
        card.clearResult();
        const cardSolution = tutor.solution["vtables"][card.getClassName()];
        for(let entry of cardSolution) {
            card.showResult([{valid: true, text: getValue(entry)}]);
        }
    }
    tutor.showResult();
});
