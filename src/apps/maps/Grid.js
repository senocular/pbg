export class Grid {
    map = [];
    width = 1;
    height = 1;
    cellSize = 1;

    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
    }

    indexFromCoords(x, y) {
        return y * this.width + x;
    }

    coordsFromIndex(index) {
        const y = Math.floor(index / this.width);
        const x = index - y * this.width;
        return [x, y];
    }

    setBlock(x, y, block) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        const index = this.indexFromCoords(x, y);
        this.map[index] = block;
    }

    getBlock(x, y) {
        const index = this.indexFromCoords(x, y);
        return this.map[index];
    }

    clear() {
        this.map.length = 0;
    }
}
