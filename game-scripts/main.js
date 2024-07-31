import { Rect } from './rect.js';
import { Bar } from './bar.js';
import { Grid } from './tiles.js';
import { LostScreen } from './lost.js';
import { findMoves, findMoveset } from './move.js';

const backgroundColor = 'rgb(106, 131, 175)';

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.rect = new Rect(0, 0, width, height);
        this.blockBar = new Bar();
        this.grid = new Grid(0, 0, height, height);
        this.score = 0;
        this.numberOfMoves = 100;
        this.lostScreen = null;
    }
    blockPlaced() {
        this.score += this.grid.smashTiles();
    }
    update() {
        this.blockBar.update();
        this.blockPlaced();
        if (this.numberOfMoves === 0) {
            this.lostScreen = new LostScreen(this.score, this.width, this.height);
        }
    }
    draw(context) {
        context.fillStyle = backgroundColor;
        context.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        this.grid.draw(context);
        this.blockBar.draw(context);
        if (this.lostScreen) {
            this.lostScreen.draw(context, this.width / 2, this.height /2);
        }
    }
}

export class PlayerGame extends Game {
    constructor(width, height) {
        super(width, height);
        this.blockBeingDragged = null;
    }
    clickBlock(x, y) {
        console.log(x, y);
        for (let block of this.blockBar.blocks) {
            if (block && block.isDraggable) {
                for (let square of block.squares) {
                    if (square.contains(x, y)) {
                        console.log(block.type);
                        this.blockBeingDragged = block;
                        this.blockBeingDragged.squareWidth = 60;
                        block.offsetX = x - block.x;
                        block.offsetY = y - block.y;
                        break;
                    }
                }
            }
        }
    }
    unclickBlock() {
        let blockPlaced = false;
        if (this.blockBeingDragged) {
            if (this.grid.selectedTiles) {
                for (let row of this.grid.tiles) {
                    for (let tile of row)
                    if (tile.selected) tile.occupyTile(this.blockBeingDragged.color);
                }
                this.blockBar.blocks.splice(this.blockBar.blocks.indexOf(this.blockBeingDragged), 1);
                this.score += this.blockBeingDragged.squares.length;
                this.blockBeingDragged.isDraggable = false;
                blockPlaced = true; 
            } else {
                this.blockBeingDragged.reset();
            }
            this.grid.selectedTiles = null;
            this.blockBeingDragged = null;
            this.grid.unselectGrid();
        }
        if (blockPlaced) {
            this.update();
        }
    }
    dragBlock(x, y) {
        if (this.blockBeingDragged) {
            this.blockBeingDragged.x = x - this.blockBeingDragged.offsetX;
            this.blockBeingDragged.y = y - this.blockBeingDragged.offsetY;
            this.blockBeingDragged.update();
            let selectedTiles = [];
            for (let point of this.blockBeingDragged.points) {
                for (let row of this.grid.tiles) {
                    for (let tile of row) {
                        tile.selected = false;
                        if (tile.rect.contains(point.x, point.y) && !tile.occupied) {
                            selectedTiles.push(tile);
                        }
                    }
                }
            }
            if (this.blockBeingDragged.squares.length === selectedTiles.length) {
                this.grid.selectedTiles = selectedTiles;
                for (let tile of selectedTiles) {
                    tile.selected = true;
                }
            } else {
                this.grid.selectedTiles = null;
            }
        }
    }
    blockPlaced() {
        super.blockPlaced();
        this.numberOfMoves = Object.values(findMoves(this.grid.tiles, this.blockBar.blocks)).flat().length;
    }
}

export class AIGame extends Game {
    constructor(width, height) {
        super(width, height);
        this.moveset = null;
        this.info = {};
        this.infoReady = false;
    }
    placeBlock(moveMetrics) {
        const metrics = moveMetrics.join(',');
        const movesetObject = this.moveset.reduce((obj, [value, key]) => {
            obj[key] = value;
            return obj;
        }, {});
        const move = movesetObject[metrics];
        console.log(move);
        if (!Array.isArray(move) || move.length !== 2) {
            console.log(this.moveset, metrics, movesetObject);
        }
        for (const intermediateMove of move) {
            for (const block of this.blockBar.blocks) {
                if (intermediateMove[0] === block.type) {
                    for (let s of block.structure) {
                        const tile = this.grid.tiles[intermediateMove[1] + s[1]][intermediateMove[2] + s[0]];
                        if (tile.occupied) throw `Tile at [${intermediateMove[1] + s[1]}][${intermediateMove[2] + s[0]}] occupied, blockType: ${block.type}, Move: ${move}`;
                        else tile.occupyTile(block.color);
                    }
                    super.blockPlaced();
                    break;
                }
            }
        }
        this.blockBar.blocks = [];
        this.update();
    }
    blockPlaced() {
        super.blockPlaced();
        this.organizeGameInfo();
        this.numberOfMoves = this.moveset.length;
    }
    organizeGameInfo() {
        this.moveset = findMoveset(this.grid.tiles, this.blockBar.blocks);
        console.log(this.moveset);
        this.info.metrics = this.moveset;
        this.info.numberOfMoves = this.moveset.length;
        this.info.score = this.score;
        this.infoReady = true;
    }
}