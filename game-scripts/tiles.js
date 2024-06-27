const backgroundColor = 'rgb(72, 137, 204)';
const tileColor = 'rgb(175, 207, 240)';
const selectedColor = 'rgb(134, 179, 224)';

export class Tile {
    constructor(row, col, rect) {
        this.row = row;
        this.col = col;
        this.occupied = false;
        this.color = tileColor;
        this.rect = rect;
    }
    occupyTile(color) {
        this.color = color;
        this.occupied = true;
    }
    smash() {
        this.color = tileColor;
        this.occupied = false;
    }
    draw(context) {
        context.fillStyle = backgroundColor;
        context.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        if (this.rect.selected) context.fillStyle = selectedColor;
        else context.fillStyle = this.color;
        context.fillRect(this.rect.x + this.rect.w * .02, this.rect.y + this.rect.h * .02, 
            this.rect.w * .96, this.rect.h * .96);
    }
}