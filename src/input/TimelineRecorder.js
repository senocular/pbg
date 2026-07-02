export class TimelineRecorder {
    recording = [];
    eventsController = new AbortController();
    startTime = 0;

    start(controller) {
        this.stop();
        this.clear();
        this.startTime = this.getClockTime();
        const { signal } = this.eventsController;

        controller.addEventListener(
            "active-change",
            (event) => {
                const { button, active } = event.detail;
                this.recording.push({
                    id: button,
                    active,
                    timestamp: Math.round(this.getClockTime() - this.startTime),
                });
            },
            { signal },
        );
    }

    stop() {
        this.eventsController.abort();
        this.eventsController = new AbortController();
    }

    clear() {
        this.recording = [];
    }

    getClockTime() {
        return performance.now();
    }
}
