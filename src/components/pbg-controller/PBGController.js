import { ActiveButtonTracker } from "../../input/ActiveButtonTracker.js";
import { ControllerInput } from "../../input/ControllerInput.js";
import { KeyboardInput } from "../../input/KeyboardInput.js";
import { loadHTMLTemplate } from "../../utils/loadHTMLTemplate.js";
import { keyboardMappings } from "./keyboardMappings.js";

const template = await loadHTMLTemplate(import.meta.resolve("./PBGController.html"));

export const labelMappings = {
    ArrowUp: "↑",
    ArrowLeft: "←",
    ArrowRight: "→",
    ArrowDown: "↓",
    Shift: "⇧",
    " ": "␣",
};

class PBGController extends HTMLElement {
    controllerInput = new ControllerInput();
    keyboardInput = new KeyboardInput();
    activeButtonTracker;
    frameLoopId;

    /**
     * @type {Map<string, HTMLButtonElement>}
     */
    buttonsByName;

    /**
     * @type {Set<string>}
     */
    activeButtonNames = new Set();

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));
        this.activeButtonTracker = new ActiveButtonTracker(shadow.getElementById("kbd"));
        const buttons = /** @type {HTMLButtonElement[]} */ (Array.from(shadow.querySelectorAll("button")));
        this.buttonsByName = new Map(buttons.map((button) => [button.name, button]));
    }

    isActive(buttonName) {
        return this.activeButtonNames.has(buttonName);
    }

    applyKeyboardMapping(name) {
        const mapping = keyboardMappings[name];
        if (!name) {
            throw new Error(`Unrecognized keyboard mapping name: "${name}"`);
        }

        for (const button of this.buttonsByName.values()) {
            const key = mapping[button.name];
            if (!key) {
                console.warn(`Keyboard mapping "${name}" missing key for button "${button.name}"`);
                continue;
            }

            button.dataset.kbdKey = key;
            button.textContent = labelMappings[key] ?? String(key).toUpperCase();
        }
    }

    start() {
        this.activeButtonTracker.start();
        this.controllerInput.start();
        this.keyboardInput.start();

        const onFrame = () => {
            for (const button of this.buttonsByName.values()) {
                const { padId, kbdKey } = button.dataset;

                const oldIsActive = this.activeButtonNames.has(button.name);
                const newIsActive =
                    this.activeButtonTracker.isActive(button) ||
                    this.controllerInput.isActive(padId) ||
                    this.keyboardInput.isKeyDown(kbdKey);

                if (oldIsActive === newIsActive) {
                    continue;
                }

                if (newIsActive) {
                    this.activeButtonNames.add(button.name);
                    button.classList.add("active");
                } else {
                    this.activeButtonNames.delete(button.name);
                    button.classList.remove("active");
                }

                this.dispatchEvent(
                    new CustomEvent("active-change", {
                        detail: {
                            button: button.name,
                            isActive: newIsActive,
                        },
                    }),
                );
            }

            this.frameLoopId = requestAnimationFrame(onFrame);
        };

        onFrame();
    }

    stop() {
        cancelAnimationFrame(this.frameLoopId);
        this.activeButtonTracker.stop();
        this.controllerInput.stop();
        this.keyboardInput.stop();
    }

    connectedCallback() {
        this.start();
    }

    disconnectedCallback() {
        this.stop();
    }
}

customElements.define("pbg-controller", PBGController);
