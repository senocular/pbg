import "../../components/pbg-controller/PBGController.js";
import { clamp } from "../../utils/clamp.js";
import { mod } from "../../utils/mod.js";
import { SelectAndHighlight } from "./SelectAndHighlight.js";
import { updatePlayerPosition } from "./shared.js";

/*
Variation C:
- Player shoots at direction player is facing with "A"
- Direction player is facing is changed with dpad while in cover or while shooting
- Player can change position to other bunkers
- Hold down "B" to select bunker with dpad to move to, release to move
*/

const player = document.getElementById("player");
const controller = document.querySelector("pbg-controller");
const friendlyBunkers = Array.from(document.querySelectorAll(".bunker.friendly"));

const positionSelect = new SelectAndHighlight(friendlyBunkers, "move-here");
const AIM_STEPS = 15;
const MAX_AIM_VALUE = 180 / AIM_STEPS;
let aimValue = 3;

function positionPlayer() {
    const aimDir = aimValue > MAX_AIM_VALUE / 2 ? -1 : 1;
    updatePlayerPosition(positionSelect, null, aimDir);
}

function updateAim(dir) {
    aimValue = clamp(aimValue + dir, 0, MAX_AIM_VALUE);
    const aimAngle = -aimValue * AIM_STEPS;
    player.style.setProperty("--aim-angle", `${aimAngle}deg`);
    positionPlayer();
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
                player.classList.add("pew-pew");
            } else {
                player.classList.remove("pew-pew");
            }
            positionPlayer();
            break;
        }

        case "dpad-left": {
            if (active) {
                if (actives.get("face-east")) {
                    positionSelect.move(-1);
                } else {
                    updateAim(1);
                }
            }
            break;
        }

        case "dpad-right": {
            if (active) {
                if (actives.get("face-east")) {
                    positionSelect.move(1);
                } else {
                    updateAim(-1);
                }
            }
            break;
        }
    }
}

export const variationC = {
    init() {
        controller.addEventListener("active-change", changeHandler);
        updateAim(0);
    },
    cleanup() {
        controller.removeEventListener("active-change", changeHandler);
        player.classList.remove("pew-pew");
        player.style.removeProperty("--aim-angle");
        positionSelect.reset();
    },
};
