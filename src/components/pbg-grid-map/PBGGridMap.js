import { loadHTMLTemplate } from "../../utils/loadHTMLTemplate.js";

const template = await loadHTMLTemplate(import.meta.resolve("./PBGGridMap.html"));

export class PBGGridMap extends HTMLElement {
    cells = [];

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.getElementById("cells").addEventListener("click", (event) => {
            const cell = event.target.closest(".cell");
            if (!cell) {
                return;
            }

            this.dispatchEvent(
                new CustomEvent("cell-click", {
                    detail: { cell },
                }),
            );
        });
        this.render();
    }

    render() {
        const cellsFrag = document.createDocumentFragment();

        const style = getComputedStyle(this);
        const width = +style.getPropertyValue("--grid-width");
        const height = +style.getPropertyValue("--grid-height");
        const cellSize = parseInt(style.getPropertyValue("--cell-size"), 10);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = document.createElement("div");
                cell.classList = "cell";
                cell.dataset.x = x;
                cell.dataset.y = y;
                cellsFrag.appendChild(cell);
            }
        }

        const cells = this.shadowRoot.getElementById("cells");
        cells.replaceChildren(cellsFrag);
        this.cells = Array.from(cells.children);
    }
}

customElements.define("pbg-grid-map", PBGGridMap);
