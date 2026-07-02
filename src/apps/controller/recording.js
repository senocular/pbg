import { TimelinePlayer } from "../../input/TimelinePlayer.js";
import { TimelineRecorder } from "../../input/TimelineRecorder.js";

const controller = document.querySelector("pbg-controller");
const startBtn = document.getElementById("record-start-btn");
const stopBtn = document.getElementById("record-stop-btn");
const playBtn = document.getElementById("record-play-btn");
const pauseBtn = document.getElementById("record-pause-btn");

const recorder = new TimelineRecorder();
let player;

function createPlayer() {
    player = new TimelinePlayer(recorder.recording, controller);
    player.addEventListener("player-stop", () => {
        playBtn.classList.remove("active");
    });
}

startBtn.onclick = () => {
    recorder.start(controller);
    startBtn.classList.add("active");
};

stopBtn.onclick = () => {
    createPlayer();
    recorder.stop();
    startBtn.classList.remove("active");
};

playBtn.onclick = () => {
    playBtn.classList.add("active");
    if (player.isPaused()) {
        player.resume();
    } else {
        player.play();
    }
};

pauseBtn.onclick = () => {
    player.pause();
    playBtn.classList.remove("active");
};

createPlayer();
