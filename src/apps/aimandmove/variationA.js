import "../../components/pbg-controller/PBGController.js";
import { mod } from "../../utils/mod.js";
import { SelectAndHighlight } from "./SelectAndHighlight.js";
import { updatePlayerPosition } from "./shared.js";

const controller = document.querySelector("pbg-controller");
const enemyBunkers = Array.from(document.querySelectorAll(".bunker.enemy"));
const friendlyBunkers = Array.from(document.querySelectorAll(".bunker.friendly"));

const aimSelect = new SelectAndHighlight(enemyBunkers, "pew-pew");
const positionSelect = new SelectAndHighlight(friendlyBunkers, "move-here");

function positionPlayer() {
    updatePlayerPosition(positionSelect, aimSelect);
}

function changeHandler(event) {
    const { button, active } = event.detail;
    const actives = controller.buttonsActive;

    switch (button) {
        case "face-east": {
            if (active) {
                positionSelect.show();
            } else {
                positionSelect.hide();
                positionPlayer();
            }
            break;
        }

        case "face-south": {
            if (active) {
                aimSelect.show();
            } else {
                aimSelect.hide();
            }
            positionPlayer();
            break;
        }

        case "dpad-left": {
            if (active) {
                if (actives.get("face-east")) {
                    positionSelect.move(-1);
                } else if (actives.get("face-south")) {
                    aimSelect.move(-1);
                    positionPlayer();
                }
            }
            break;
        }

        case "dpad-right": {
            if (active) {
                if (actives.get("face-east")) {
                    positionSelect.move(1);
                } else if (actives.get("face-south")) {
                    aimSelect.move(1);
                    positionPlayer();
                }
            }
            break;
        }
    }
}

export const variationA = {
    init() {
        controller.addEventListener("active-change", changeHandler);
        positionPlayer();
    },
    cleanup() {
        controller.removeEventListener("active-change", changeHandler);
        aimSelect.reset();
        positionSelect.reset();
    },
};
