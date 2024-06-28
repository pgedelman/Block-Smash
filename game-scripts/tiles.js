import { Rect } from "./rect.js";

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

export class Grid {
    constructor() {
        this.tiles = [];
        for (let i = 0; i < 10; i++) {
            let place = [];
            for (let j = 0; j < 10; j++) {
                place.push(new Tile(i, j, new Rect(j * 60, i * 60, 60, 60)));
            }
            this.tiles.push(place);
        }
    }
    smashTiles() {
        let points = 0;
        let gettingSmashed = [];
        for (let i in this.tiles) {
            let fullRowSmashed = true;
            for (let j in this.tiles[i]) {
                if (!this.tiles[i][j].occupied) {
                    fullRowSmashed = false;
                }
            }
            if (fullRowSmashed) gettingSmashed.push(this.tiles[i]);
        }
        for (let i in this.tiles) {
            let fullColSmashed = true;
            for (let j in this.tiles[i]) {
                if (!this.tiles[j][i].occupied) {
                    fullColSmashed = false;
                }
            }
            if (fullColSmashed) {
                let smashedCol = [];
                for (let j in this.tiles[i]) {
                    smashedCol.push(this.tiles[j][i]);
                }       
                gettingSmashed.push(smashedCol);
            }
        }
        for (let group of gettingSmashed) {
            for (let tile of group) {
                tile.smash();
            }
        }
        if (gettingSmashed.length > 0) {
            points += 10 * Math.pow(gettingSmashed.length, 2) - 10 * gettingSmashed.length + 15;
        }
        return points;
    }
    unselectGrid() {
        for (let row of this.tiles) {
            for (let tile of row) {
                tile.rect.selected = false;
            }
        }
    }
    draw(context) {
        for (let row of this.tiles) {
            for (let tile of row) {
                tile.draw(context);
            }
        }
    }
}