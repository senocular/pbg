export class ControllerInput {
    eventsController = new AbortController();

    isActive(buttonId) {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads?.[0];
        if (!gamepad) {
            return false;
        }

        const button = gamepad.buttons[buttonId];
        if (!button) {
            return false;
        }

        return button.pressed;
    }

    start() {
        this.stop();

        // TODO: Remove these event handlers if unnecessary. We poll for the gamepad
        // every game loop so there doesn't seem to be a need to know when a controller
        // is or is not available unless we want to signal to the user that is the case.
        const connect = (event) => {
            console.log("Gamepad connected from index %d: %s", event.gamepad.index, event.gamepad.id);
        };

        const disconnect = (event) => {
            console.log("Gamepad disconnected from index %d: %s", event.gamepad.index, event.gamepad.id);
        };

        const { signal } = this.eventsController;
        window.addEventListener("gamepadconnected", connect, { signal });
        window.addEventListener("gamepaddisconnected", disconnect, { signal });
    }

    stop() {
        this.eventsController.abort();
        this.eventsController = new AbortController();
    }
}
