import { ActiveButtonTracker } from "../../input/ActiveButtonTracker.js";
import { ControllerInput } from "../../input/ControllerInput.js";
import { GenericInput } from "../../input/GenericInput.js";
import { KeyboardInput } from "../../input/KeyboardInput.js";
import { loadHTMLTemplate } from "../../utils/loadHTMLTemplate.js";
import { keyboardMappings } from "./keyboardMappings.js";

const template = await loadHTMLTemplate(import.meta.resolve("./PBGController.html"));

export const buttonLabelMappings = {
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
    manualInput = new GenericInput();
    activeButtonTracker;

    /**
     * @type {number}
     */
    frameLoopId = -1;

    /**
     * @type {Map<string, HTMLButtonElement>}
     */
    buttonsByName;

    /**
     * @type {Map<string, boolean>}
     */
    buttonsActive;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(template.content.cloneNode(true));
        this.activeButtonTracker = new ActiveButtonTracker(shadow.getElementById("kbd"));
        const buttons = /** @type {HTMLButtonElement[]} */ (Array.from(shadow.querySelectorAll("button")));
        this.buttonsByName = new Map(buttons.map((button) => [button.name, button]));
        this.buttonsActive = new Map(buttons.map((button) => [button.name, false]));
    }

    isActive(buttonName) {
        return this.buttonsActive.get(buttonName) ?? false;
    }

    setActive(buttonName, active) {
        this.manualInput.setActive(buttonName, active);
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
            button.textContent = buttonLabelMappings[key] ?? String(key).toUpperCase();
        }
    }

    start() {
        cancelAnimationFrame(this.frameLoopId);
        this.activeButtonTracker.start();
        this.controllerInput.start();
        this.keyboardInput.start();

        const onFrame = () => {
            const events = [];
            for (const button of this.buttonsByName.values()) {
                const { padId, kbdKey } = button.dataset;

                const oldIsActive = this.buttonsActive.get(button.name) ?? false;
                const newIsActive =
                    this.activeButtonTracker.isActive(button) ||
                    this.controllerInput.isActive(padId) ||
                    this.keyboardInput.isKeyDown(kbdKey) ||
                    this.manualInput.isActive(button.name);

                if (oldIsActive === newIsActive) {
                    continue;
                }

                if (newIsActive) {
                    button.classList.add("active");
                } else {
                    button.classList.remove("active");
                }

                this.buttonsActive.set(button.name, newIsActive);

                events.push(
                    new CustomEvent("active-change", {
                        detail: {
                            button: button.name,
                            active: newIsActive,
                        },
                    }),
                );
            }

            for (const event of events) {
                this.dispatchEvent(event);
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
