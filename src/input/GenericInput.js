export class GenericInput {
    activeIds = new Map();

    isActive(id) {
        return this.activeIds.get(id) ?? false;
    }

    setActive(id, active) {
        this.activeIds.set(id, active);
    }
}
