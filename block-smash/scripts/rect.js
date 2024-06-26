export class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.selected = false;
    }
    contains(x, y) {
        return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
    }
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}