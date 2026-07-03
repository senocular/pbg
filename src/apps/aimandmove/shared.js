const player = document.getElementById("player");
const controller = document.querySelector("pbg-controller");

export function updatePlayerPosition(positionSelect, aimSelect) {
    const BUNKER_SIZE = 40;
    const POP_OUT_DIST = 25;

    const playerBunker = positionSelect.getTarget();
    const actives = controller.buttonsActive;
    let aimPopOutOffset = actives.get("face-south") ? POP_OUT_DIST : 0;

    if (aimPopOutOffset) {
        const aimBunker = aimSelect.getTarget();
        if (aimBunker.offsetLeft < playerBunker.offsetLeft) {
            aimPopOutOffset *= -1;
        }
    }

    player.style.left = `${playerBunker.offsetLeft + aimPopOutOffset}px`;
    player.style.top = `${playerBunker.offsetTop + BUNKER_SIZE}px`;
}
