import { loadHTMLTemplate } from "../../utils/loadHTMLTemplate.js";

const template = await loadHTMLTemplate(import.meta.resolve("./PBGGridMap.html"));

export class PBGGridMap extends HTMLElement {
    globalController = new AbortController();
    downController = new AbortController();

    cells = [];

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.globalController = new AbortController();
        this.downController = new AbortController();
        const cells = this.shadowRoot.getElementById("cells");

        const getCell = (event) => event.target.closest(".cell");
        const dispatch = (eventName, cell) =>
            this.dispatchEvent(
                new CustomEvent(eventName, {
                    detail: { cell },
                }),
            );

        cells.addEventListener("click", (event) => {
            const cell = getCell(event);
            if (!cell) {
                return;
            }

            dispatch("cell-click", cell);
        });

        cells.addEventListener(
            "pointerdown",
            (event) => {
                this.downController.abort();
                this.downController = new AbortController();

                const cell = getCell(event);
                if (!cell) {
                    return;
                }

                event.preventDefault();

                cell.addEventListener(
                    "pointermove",
                    (event) => {
                        dispatch("cell-drag-over", cell);
                    },
                    { once: true, signal: this.downController.signal },
                );

                cells.addEventListener(
                    "pointerover",
                    (event) => {
                        const cell = getCell(event);
                        if (!cell) {
                            return;
                        }

                        dispatch("cell-drag-over", cell);
                    },
                    { signal: this.downController.signal },
                );
            },
            { signal: this.globalController.signal },
        );

        globalThis.addEventListener(
            "pointerup",
            (event) => {
                this.downController.abort();
                this.downController = new AbortController();
            },
            { signal: this.globalController.signal },
        );

        this.render();
    }

    disconnectedCallback() {
        this.globalController.abort();
        this.downController.abort();
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
