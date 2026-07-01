import { keyboardMappings } from "../../components/pbg-controller/keyboardMappings.js";
import "../../components/pbg-controller/PBGController.js";

const kbdMappingSelect = document.getElementById("kbd-mapping-select");
const controller = document.querySelector("pbg-controller");
const text = document.querySelector("textarea");

function populateMappings() {
    kbdMappingSelect.replaceChildren(
        ...Object.keys(keyboardMappings).map((name) => {
            const option = document.createElement("option");
            option.textContent = name;
            return option;
        }),
    );
}

kbdMappingSelect.onchange = () => {
    controller.applyKeyboardMapping(kbdMappingSelect.value);
};

const lines = [];
const MAX_LINES = 30;

controller.addEventListener("active-change", (event) => {
    const { button, isActive } = event.detail;
    if (!isActive) {
        return;
    }

    lines.unshift(button);
    if (lines.length > MAX_LINES) {
        lines.length = MAX_LINES;
    }

    text.value = lines.join("\n");
});

populateMappings();
