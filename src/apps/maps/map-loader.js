import { maps } from "./maps.js";

const mapSelect = document.getElementById("map-select");

function loadMap(map, grid) {
    if (!map) {
        map = Object.values(maps)[0];
    }

    const charToProperties = {
        o: {
            shape: "circle",
            backgroundColor: "#ffffff",
            text: "",
            textColor: "",
        },
        X: {
            shape: "square",
            backgroundColor: "#993300",
            text: "",
            textColor: "",
        },
        e: {
            shape: "circle",
            backgroundColor: "#ff0000",
            text: "E",
            textColor: "#ffffff",
        },
        p: {
            shape: "circle",
            backgroundColor: "#33cd32",
            text: "P",
            textColor: "#ffffff",
        },
    };

    for (const [index, char] of map.entries()) {
        const cell = grid.cells[index];
        if (!cell) {
            throw new Error(`No cell available at index "${index}" when loading map`);
        }

        const props = charToProperties[char];
        if (!props) {
            cell.replaceChildren();
        } else {
            const block = document.createElement("pbg-grid-block");
            block.setProperties(props);
            cell.replaceChildren(block);
        }
    }
}

function populateMapSelect() {
    for (const [name, map] of Object.entries(maps)) {
        const optionEl = document.createElement("option");
        optionEl.textContent = name;
        mapSelect.appendChild(optionEl);
    }
}

export function init(map, grid, onRender) {
    populateMapSelect();
    loadMap(map, grid);
    onRender();

    mapSelect.onchange = (event) => {
        loadMap(maps[mapSelect.value], grid);
        onRender();
    };
}
