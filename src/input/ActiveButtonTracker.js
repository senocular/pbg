export class ActiveButtonTracker {
    eventsController = new AbortController();

    /**
     * @type {HTMLElement}
     */
    element;

    /**
     * @type {Map<HTMLButtonElement, Set<number>>}
     */
    buttonsActive = new Map();

    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
    }

    isActive(button = this.element) {
        let activePointerIds = this.buttonsActive.get(button);
        if (!activePointerIds) {
            return false;
        }
        return activePointerIds.size > 0;
    }

    start() {
        this.stop();

        /**
         * @param {PointerEvent} event
         */
        const addHandler = (event) => {
            const targetButton = /** @type {HTMLButtonElement | null} */ (event.target.closest("button"));
            if (!targetButton) {
                return;
            }
            const lockButton = event.shiftKey;
            const id = event.pointerId;

            let activePointerIds = this.buttonsActive.get(targetButton);
            if (!activePointerIds) {
                activePointerIds = new Set();
                this.buttonsActive.set(targetButton, activePointerIds);
            }

            const adjustedId = lockButton ? -id : id;
            activePointerIds.add(adjustedId);
        };

        /**
         * @param {PointerEvent} event
         */
        const removeHandler = (event) => {
            const target = event.composedPath().at(0);
            const targetButton = /** @type {HTMLButtonElement | null} */ (target?.closest("button") ?? null);
            const id = event.pointerId;
            const lockButton = event.shiftKey;

            for (const [button, activePointerIds] of this.buttonsActive) {
                activePointerIds.delete(id);
                if (!lockButton && button === targetButton) {
                    activePointerIds.delete(-id);
                }
            }
        };

        const { signal } = this.eventsController;
        this.element.addEventListener("pointerdown", addHandler, { signal });
        window.addEventListener("pointerup", removeHandler, { signal });
        window.addEventListener("pointercancel", removeHandler, { signal });
    }

    stop() {
        this.eventsController.abort();
        this.eventsController = new AbortController();
    }
}
