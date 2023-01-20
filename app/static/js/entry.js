const invalidEntryTemplate = document.getElementById("entry-invalid");
const validEntryTemplate = document.getElementById("entry-valid");

export function create(options) {
    let node;
    if(options.valid) {
        node = validEntryTemplate.content.cloneNode(true);
        node.children[0].value = options.text;
    } else {
        node = invalidEntryTemplate.content.cloneNode(true);
        node.children[0].value = options.text;
        node.children[1].textContent = options.feedback;
    }
    return node;
}