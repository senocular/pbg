import { keyboardMappings } from "../../components/pbg-controller/keyboardMappings.js";

const options = document.getElementById("options");
const kbdMappingSelect = document.getElementById("kbd-mapping-select");
const layoutFaceCheck = document.getElementById("layout-face-check");
const layoutShoulderCheck = document.getElementById("layout-shoulder-check");
const controller = document.querySelector("pbg-controller");

function populateKeyboardMappings() {
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

populateKeyboardMappings();
