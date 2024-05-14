import { Rect } from './rect.js';

const backgroundColor = 'rgb(72, 137, 204)';
const tileColor = 'rgb(144, 192, 241)';
const hoveredColor = 'rgb(134, 179, 224)';

export class Tile {
    constructor(rect) {
        this.rect = rect;
    }
    update() {

    }
    draw(context) {
        context.fillStyle = backgroundColor;
        context.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        if (this.rect.hovered) context.fillStyle = hoveredColor;
        else context.fillStyle = tileColor;
        context.fillRect(this.rect.x + this.rect.w * .02, this.rect.y + this.rect.h * .02, 
            this.rect.w * .96, this.rect.h * .96);
    }
}