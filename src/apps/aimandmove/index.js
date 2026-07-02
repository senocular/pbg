import "../../components/pbg-controller/PBGController.js";

const controller = document.querySelector("pbg-controller");
const enemyBunkers = Array.from(document.querySelectorAll(".bunker.enemy"));
const friendlyBunkers = Array.from(document.querySelectorAll(".bunker.friendly"));

let playerPositionIndex = 0;
let playerAimIndex = 0;
const BUNKER_SIZE = 40;

function mod(n, d) {
    return ((n % d) + d) % d;
}

function movePositionHighlight(dir) {
    hidePositionHighlight();
    playerPositionIndex += dir;
    playerPositionIndex = mod(playerPositionIndex, friendlyBunkers.length);
    showPositionHighlight();
}

function moveAimHighlight(dir) {
    hideAimHighlight();
    playerAimIndex += dir;
    playerAimIndex = mod(playerAimIndex, enemyBunkers.length);
    showAimHighlight();
}

function showPositionHighlight() {
    const highlightBunker = friendlyBunkers[playerPositionIndex];
    highlightBunker.classList.add("highlight");
}

function hidePositionHighlight() {
    const highlightBunker = friendlyBunkers[playerPositionIndex];
    highlightBunker.classList.remove("highlight");
}

function showAimHighlight() {
    const highlightBunker = enemyBunkers[playerAimIndex];
    highlightBunker.classList.add("highlight");
}

function hideAimHighlight() {
    const highlightBunker = enemyBunkers[playerAimIndex];
    highlightBunker.classList.remove("highlight");
}

function updatePlayerPosition() {
    const playerBunker = friendlyBunkers[playerPositionIndex];
    const actives = controller.buttonsActive;
    let aimPopOutOffset = actives.get("face-south") ? 40 : 0;

    if (aimPopOutOffset) {
        const aimBunker = enemyBunkers[playerAimIndex];
        if (aimBunker.offsetLeft < playerBunker.offsetLeft) {
            aimPopOutOffset *= -1;
        }
    }

    player.style.left = `${playerBunker.offsetLeft + aimPopOutOffset}px`;
    player.style.top = `${playerBunker.offsetTop + BUNKER_SIZE}px`;
}

controller.addEventListener("active-change", (event) => {
    const { button, active } = event.detail;
    const actives = controller.buttonsActive;

    switch (button) {
        case "face-east": {
            if (active) {
                showPositionHighlight();
            } else {
                hidePositionHighlight();
                updatePlayerPosition();
            }
            break;
        }
        case "face-south": {
            if (active) {
                showAimHighlight();
                updatePlayerPosition();
            } else {
                hideAimHighlight();
                updatePlayerPosition();
            }
            break;
        }
        case "dpad-left": {
            if (active) {
                if (actives.get("face-east")) {
                    movePositionHighlight(-1);
                } else if (actives.get("face-south")) {
                    moveAimHighlight(-1);
                    updatePlayerPosition();
                }
            }
            break;
        }
        case "dpad-right": {
            if (active) {
                if (actives.get("face-east")) {
                    movePositionHighlight(1);
                } else if (actives.get("face-south")) {
                    moveAimHighlight(1);
                    updatePlayerPosition();
                }
            }
            break;
        }
    }
});

updatePlayerPosition();
