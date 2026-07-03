import { mod } from "../../utils/mod.js";

export class SelectAndHighlight {
    index = 0;
    targets;
    highlightClass;

    constructor(targets, highlightClass) {
        this.targets = targets;
        this.highlightClass = highlightClass;
    }

    getTarget() {
        return this.targets[this.index];
    }

    show() {
        this.getTarget().classList.add(this.highlightClass);
    }

    hide() {
        this.getTarget().classList.remove(this.highlightClass);
    }

    move(dir) {
        this.hide();
        this.index += dir;
        this.index = mod(this.index, this.targets.length);
        this.show();
    }

    reset() {
        this.hide();
        this.index = 0;
    }
}
