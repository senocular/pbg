const controller = document.querySelector("pbg-controller");
const text = document.querySelector("textarea");
const clearTextBtn = document.getElementById("clear-text-btn");

const eventLines = [];
const MAX_EVENT_LINES = 25;

controller.addEventListener("active-change", (event) => {
    const { button, active } = event.detail;
    if (!active) {
        return;
    }

    eventLines.unshift(button);
    if (eventLines.length > MAX_EVENT_LINES) {
        eventLines.length = MAX_EVENT_LINES;
    }

    text.value = eventLines.join("\n");
});

clearTextBtn.onclick = () => {
    eventLines.length = 0;
    text.value = "";
};
