import "../../components/pbg-controller/PBGController.js";
import { mod } from "../../utils/mod.js";
import { SelectAndHighlight } from "./SelectAndHighlight.js";
import { updatePlayerPosition } from "./shared.js";

/*
Variation B:
- Player shoots at selected bunker with "A"
- Bunker can be selected with dpad while in cover or while shooting
- Player can change position to other bunkers
- Hold down "B" to select bunker with dpad to move to, release to move
*/

const controller = document.querySelector("pbg-controller");
const enemyBunkers = Array.from(document.querySelectorAll(".bunker.enemy"));
const friendlyBunkers = Array.from(document.querySelectorAll(".bunker.friendly"));

const aimSelect = new SelectAndHighlight(enemyBunkers, "aim");
const pewSelect = new SelectAndHighlight(enemyBunkers, "pew-pew");
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
                aimSelect.hide();
            } else {
                positionSelect.hide();
                aimSelect.show();
                positionPlayer();
            }
            break;
        }

        case "face-south": {
            if (active) {
                pewSelect.show();
                aimSelect.hide();
            } else {
                aimSelect.show();
                pewSelect.hide();
            }
            positionPlayer();
            break;
        }

        case "dpad-left": {
            if (active) {
                if (actives.get("face-east")) {
                    positionSelect.move(-1);
                } else {
                    aimSelect.move(-1);
                    pewSelect.move(-1);
                    if (!actives.get("face-south")) {
                        pewSelect.hide();
                    }
                    positionPlayer();
                }
            }
            break;
        }

        case "dpad-right": {
            if (active) {
                if (actives.get("face-east")) {
                    positionSelect.move(1);
                } else {
                    aimSelect.move(1);
                    pewSelect.move(1);
                    if (!actives.get("face-south")) {
                        pewSelect.hide();
                    }
                    positionPlayer();
                }
            }
            break;
        }
    }
}

export const variationB = {
    init() {
        controller.addEventListener("active-change", changeHandler);
        aimSelect.show();
        positionPlayer();
    },
    cleanup() {
        controller.removeEventListener("active-change", changeHandler);
        aimSelect.reset();
        pewSelect.reset();
        positionSelect.reset();
    },
};
