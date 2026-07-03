import { mod } from "../../utils/mod.js";

const DEFAULT_OPTIONS = {
    wrap: true,
};

export class SelectAndHighlight {
    index = 0;
    targets;
    options;
    highlightClass;

    constructor(targets, highlightClass, options = {}) {
        this.targets = targets;
        this.highlightClass = highlightClass;
        this.options = { ...DEFAULT_OPTIONS, ...options };
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
