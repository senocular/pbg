import { loadHTMLTemplate } from "../../utils/loadHTMLTemplate.js";

const template = await loadHTMLTemplate(import.meta.resolve("./PBGGridBlock.html"));

export class PBGGridBlock extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));
    }

    getProperties() {
        const style = getComputedStyle(this);
        return {
            shape: this.dataset.shape || "square",
            backgroundColor: style.getPropertyValue("--bg-color"),
            text: this.dataset.text,
            textColor: style.getPropertyValue("--text-color"),
        };
    }

    setProperties(properties) {
        if ("shape" in properties) {
            this.dataset.shape = properties.shape;
        }
        if ("backgroundColor" in properties) {
            this.style.setProperty("--bg-color", properties.backgroundColor);
        }
        if ("text" in properties) {
            this.dataset.text = properties.text;
        }
        if ("textColor" in properties) {
            this.style.setProperty("--text-color", properties.textColor);
        }
    }
}

customElements.define("pbg-grid-block", PBGGridBlock);
