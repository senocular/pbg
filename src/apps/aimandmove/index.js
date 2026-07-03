import { variationA } from "./variationA.js";
import { variationB } from "./variationB.js";

const variationSelect = document.getElementById("variation-select");

const variations = {
    variationA,
    variationB,
};

let currVariation;

variationSelect.onchange = () => {
    currVariation.cleanup();
    currVariation = variations[variationSelect.value];
    currVariation.init();
    variationSelect.blur();
};

function populateVariationsSelect() {
    for (const variation of Object.keys(variations)) {
        const option = document.createElement("option");
        option.textContent = variation;
        variationSelect.appendChild(option);
    }
}

function getParamsVariationKey() {
    const params = new URLSearchParams(location.search);
    const paramsVariationName = params.get("variation");

    if (!paramsVariationName) {
        return null;
    }
    const variationKey = "variation" + paramsVariationName;

    if (!Object.hasOwn(variations, variationKey)) {
        return null;
    }

    return variationKey;
}

function init() {
    populateVariationsSelect();
    const variationKey = getParamsVariationKey() || Object.keys(variations)[0];
    currVariation = variations[variationKey];
    variationSelect.value = variationKey;
    currVariation.init();
}

init();
