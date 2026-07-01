export class KeyboardInput {
    eventsController = new AbortController();

    keysDown = new Set();
    keyCodesDown = new Set();

    isKeyDown(key) {
        return this.keysDown.has(key);
    }

    isKeyCodeDown(key) {
        return this.keyCodesDown.has(key);
    }

    start() {
        this.stop();

        const addKey = (event) => {
            this.keysDown.add(event.key);
            this.keyCodesDown.add(event.code);
        };

        const removeKey = (event) => {
            this.keysDown.delete(event.key);
            this.keyCodesDown.delete(event.code);
        };

        const { signal } = this.eventsController;
        window.addEventListener("keydown", addKey, { signal });
        window.addEventListener("keyup", removeKey, { signal });
    }

    stop() {
        this.eventsController.abort();
        this.eventsController = new AbortController();
    }
}
