const iconDesigner = document.getElementById("icon-designer");
const blockPreview = document.getElementById("block-preview");
const swatchesList = document.getElementById("swatches-list");

export function setDesignerBlockProperties(properties) {
    if ("shape" in properties) {
        document.getElementById("shape-select").value = properties.shape || "square";
    }
    if ("backgroundColor" in properties) {
        document.getElementById("bg-color").value = properties.backgroundColor || "#ffffff";
    }
    if ("text" in properties) {
        document.getElementById("content-text").value = properties.text || "";
    }
    if ("textColor" in properties) {
        document.getElementById("text-color").value = properties.textColor || "#ffffff";
    }

    updatePreview();
}

export function getDesignerBlockProperties() {
    return {
        shape: document.getElementById("shape-select").value,
        backgroundColor: document.getElementById("bg-color").value,
        text: document.getElementById("content-text").value,
        textColor: document.getElementById("text-color").value,
    };
}

export function getDesignerTool() {
    const selectedTool = document.querySelector('[name="tool"]:checked');
    return selectedTool?.value ?? "select";
}

function setDesignerTool(name) {
    const toSelectTool = document.querySelector(`[name="tool"][value="${name}"]`);
    toSelectTool.checked = true;
}

function updatePreview() {
    blockPreview.setProperties(getDesignerBlockProperties());
}

iconDesigner.oninput = (event) => {
    updatePreview();
};

customElements.whenDefined("pbg-grid-block").then(() => {
    updatePreview();
});

swatchesList.onclick = (event) => {
    const block = event.target.closest("pbg-grid-block");
    if (!block) {
        return;
    }

    setDesignerBlockProperties(block.getProperties());
    setDesignerTool("place");
};

globalThis.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "p": {
            setDesignerTool("place");
            break;
        }
        case "e": {
            setDesignerTool("erase");
            break;
        }
        case "s": {
            setDesignerTool("select");
            break;
        }
    }
});
