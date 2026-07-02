import { keyboardMappings } from "../../components/pbg-controller/keyboardMappings.js";
import "../../components/pbg-controller/PBGController.js";

const options = document.getElementById("options");
const kbdMappingSelect = document.getElementById("kbd-mapping-select");
const layoutFaceCheck = document.getElementById("layout-face-check");
const layoutShoulderCheck = document.getElementById("layout-shoulder-check");
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
    kbdMappingSelect.blur();
};

layoutFaceCheck.onchange = () => {
    controller.classList.toggle("layout-4-face-buttons", layoutFaceCheck.checked);
};

layoutShoulderCheck.onchange = () => {
    controller.classList.toggle("layout-4-shoulder-buttons", layoutShoulderCheck.checked);
};

options.onchange = (event) => {
    event.target.blur();
};

const lines = [];
const MAX_LINES = 25;

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
