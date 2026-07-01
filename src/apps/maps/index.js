import { Grid } from "./Grid.js";
import { init } from "./map-loader.js";
import { getDesignerTool, setDesignerBlockProperties, getDesignerBlockProperties } from "./editor.js";
import "../../components/pbg-grid-map/PBGGridMap.js";
import "../../components/pbg-grid-block/PBGGridBlock.js";

const pbgGridMap = document.querySelector("pbg-grid-map");
pbgGridMap.addEventListener("cell-click", (event) => {
    const { cell } = event.detail;

    switch (getDesignerTool()) {
        case "select": {
            const block = cell.querySelector("pbg-grid-block");
            if (!block) {
                return;
            }
            const blockProperties = block.getProperties();
            setDesignerBlockProperties(blockProperties);
            break;
        }
        case "place": {
            const block = document.createElement("pbg-grid-block");
            block.setProperties(getDesignerBlockProperties());
            cell.replaceChildren(block);
            break;
        }
        case "erase": {
            cell.replaceChildren();
            break;
        }
    }
});

const gridEl = document.getElementById("playing-field");

const gridStyle = getComputedStyle(gridEl);
const gridWidth = +gridStyle.getPropertyValue("--grid-width");
const gridHeight = +gridStyle.getPropertyValue("--grid-height");
const gridCellSize = +gridStyle.getPropertyValue("--grid-cell-size");
const grid = new Grid(gridWidth, gridHeight, gridCellSize);

init(null, pbgGridMap, () => renderGridInto(grid, gridEl));

function renderGridInto(grid, element) {
    const frag = document.createDocumentFragment();
    for (const [index, block] of grid.map.entries()) {
        if (!block) {
            continue;
        }

        const [x, y] = grid.coordsFromIndex(index);
        const el = document.createElement("div");
        el.dataset.block = block;
        el.dataset.x = x;
        el.dataset.y = y;
        el.style.left = `${x * grid.cellSize}px`;
        el.style.top = `${y * grid.cellSize}px`;
        frag.appendChild(el);
    }
    element.replaceChildren(frag);
}
