export class TimelinePlayer extends EventTarget {
    frameLoopId = -1;
    startTime = -1;
    pauseTime = -1;
    currRecordingIndex = 0;

    recording;
    receiver;

    constructor(recording, receiver) {
        super();
        this.recording = recording;
        this.receiver = receiver;
    }

    getPlaybackTime() {
        if (!this.isPlaying()) {
            return 0;
        }

        if (this.isPaused()) {
            return this.pauseTime - this.startTime;
        }

        return this.getClockTime() - this.startTime;
    }

    isPlaying() {
        return this.startTime !== -1;
    }

    isPaused() {
        if (!this.isPlaying()) {
            return false;
        }

        return this.pauseTime !== -1;
    }

    play() {
        this.stop();
        this.startTime = this.getClockTime();
        this.startFrameLoop();
    }

    pause() {
        if (this.isPaused() || !this.isPlaying()) {
            return;
        }

        this.stopFrameLoop();
        this.pauseTime = this.getClockTime();
    }

    resume() {
        if (!this.isPaused()) {
            return;
        }

        const timePaused = this.getClockTime() - this.pauseTime;
        this.startTime += timePaused;
        this.pauseTime = -1;
        this.startFrameLoop();
    }

    stop() {
        this.startTime = -1;
        this.pauseTime = -1;
        this.currRecordingIndex = 0;
        this.stopFrameLoop();
    }

    startFrameLoop() {
        const onFrame = () => {
            const playTime = this.getPlaybackTime();

            let cuePoint = this.recording[this.currRecordingIndex];
            while (cuePoint && cuePoint.timestamp <= playTime) {
                this.receiver.setActive(cuePoint.id, cuePoint.active);
                this.currRecordingIndex++;
                cuePoint = this.recording[this.currRecordingIndex];
            }

            if (this.currRecordingIndex < this.recording.length) {
                this.frameLoopId = requestAnimationFrame(onFrame);
            } else {
                this.stop();
                this.dispatchEvent(new Event("player-stop"));
            }
        };

        onFrame();
    }

    stopFrameLoop() {
        cancelAnimationFrame(this.frameLoopId);
    }

    getClockTime() {
        return performance.now();
    }
}
