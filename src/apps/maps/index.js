import { init as initMapLoader } from "./map-loader.js";
import { getDesignerTool, setDesignerBlockProperties, getDesignerBlockProperties } from "./editor.js";
import "../../components/pbg-grid-map/PBGGridMap.js";
import "../../components/pbg-grid-block/PBGGridBlock.js";

const pbgGridMap = document.querySelector("pbg-grid-map");
function handleCellApply(event) {
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
}

pbgGridMap.addEventListener("cell-click", handleCellApply);
pbgGridMap.addEventListener("cell-drag-over", handleCellApply);

initMapLoader(null, pbgGridMap);
