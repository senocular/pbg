import { Grid } from "./Grid.js";
import { maps } from "./maps.js";

const gridEl = document.getElementById("playing-field");
const mapSelect = document.getElementById("map-select");

const gridStyle = getComputedStyle(gridEl);
const gridWidth = +gridStyle.getPropertyValue("--grid-width");
const gridHeight = +gridStyle.getPropertyValue("--grid-height");
const gridCellSize = +gridStyle.getPropertyValue("--grid-cell-size");
const grid = new Grid(gridWidth, gridHeight, gridCellSize);

function loadMap(map) {
    if (!map) {
        return;
    }

    const charToBlock = {
        o: "position",
        X: "bunker",
        e: "enemy",
        p: "player",
    };

    grid.clear();

    for (const [index, char] of map.entries()) {
        const block = charToBlock[char];
        if (!block) {
            continue;
        }
        grid.setBlock(...grid.coordsFromIndex(index), block);
    }

    grid.renderInto(gridEl);
}

function populateMapSelect() {
    for (const [name, map] of Object.entries(maps)) {
        const optionEl = document.createElement("option");
        optionEl.textContent = name;
        mapSelect.appendChild(optionEl);
    }
}

gridEl.onclick = (event) => {
    const position = event.target.closest('[data-block="position"]');
    if (!position) {
        return;
    }

    gridEl.querySelectorAll(".active").forEach((el) => el.classList.remove("active"));
    position.classList.add("active");
};

mapSelect.onchange = (event) => {
    loadMap(maps[mapSelect.value]);
};

populateMapSelect();
loadMap(Object.values(maps)[0]);
