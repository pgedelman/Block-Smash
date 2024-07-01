import { Rect } from './rect.js';
import { Bar } from './bar.js';
import { Grid } from './tiles.js';
import { LostScreen } from './lost.js';

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.draggingBlock = null;
        this.bar = new Bar(new Rect(height, 0, width - height, height));
        this.grid = new Grid(0, 0, height, height);
        this.points = 0;
        this.info = {}
        this.analyze();
        this.lost = null;
    }
    analyze() {
        let num_options = 0;
        let options = {};
        for (let block of this.bar.blocks) {
            if (block) {
                block.validPlaces = block.findValidPlacement(this.grid.tiles);
                options[block.type] = block.validPlaces;
                for (let i of block.validPlaces) {
                    num_options += i[0] !== -1;
                }
            }
        }
        let grid = [];
        for (let row of this.grid.tiles) {
            for (let tile of row) {
                if (tile.occupied) grid.push(0);
                else grid.push(1);
            }
        }
        this.info = {
            points: this.points,
            grid: grid,
            num_options: num_options,
            options: options,
        };
        if (this.info.num_options === 0) {
            this.lost = new LostScreen(this.points, this.width, this.height);
        }
        console.log(this.info);
    }
    clickBlock(x, y) {
        console.log(x, y);
        for (let block of this.bar.blocks) {
            if (block && block.draggable) {
                for (let square of block.squares) {
                    if (square.contains(x, y)) {
                        console.log(block.type);
                        this.draggingBlock = block;
                        this.draggingBlock.squareWidth = 60;
                        block.dragging = true;
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
        if (this.draggingBlock) {
            if (this.grid.selectedTiles) {
                for (let row of this.grid.tiles) {
                    for (let tile of row)
                    if (tile.rect.selected) tile.occupyTile(this.draggingBlock.color);
                }
                this.bar.blocks.splice(this.bar.blocks.indexOf(this.draggingBlock), 1);
                this.points += this.draggingBlock.squares.length;
                this.draggingBlock.draggable = false;
                blockPlaced = true; 
            } else {
                this.draggingBlock.reset();
            }
            this.grid.selectedTiles = null;
            this.draggingBlock = null;
            this.grid.unselectGrid();
        }
        if (blockPlaced) {
            this.update();
        }
    }
    dragBlock(x, y) {
        if (this.draggingBlock) {
            this.draggingBlock.x = x - this.draggingBlock.offsetX;
            this.draggingBlock.y = y - this.draggingBlock.offsetY;
            this.draggingBlock.update();
            let selectedTiles = [];
            for (let point of this.draggingBlock.points) {
                for (let row of this.grid.tiles) {
                    for (let tile of row) {
                        tile.rect.selected = false;
                        if (tile.rect.contains(point.x, point.y) && !tile.occupied) {
                            selectedTiles.push(tile);
                        }
                    }
                }
            }
            if (this.draggingBlock.squares.length === selectedTiles.length) {
                this.grid.selectedTiles = selectedTiles;
                for (let tile of selectedTiles) {
                    tile.rect.selected = true;
                }
            } else {
                this.grid.selectedTiles = null;
            }
        }
    }
    update() {
        this.bar.update();
        this.points += this.grid.smashTiles();
        this.analyze();
    }
    draw(context) {
        this.grid.draw(context);
        this.bar.draw(context);
        if (this.lost) {
            this.lost.draw(context, this.width / 2, this.height /2);
        }
    }
}

export class AIGame extends Game {
    constructor(width, height) {
        super(width, height);
    }
    placeBlock(blockType, placement) {
        let block = null;
        let blockIndex = 0;
        for (let i of this.bar.blocks) {
            if (i.type === blockType) {
                block = i;
                break;
            }
            blockIndex++;
        }
        for (let s of block.structure) {
            this.grid.tiles[block.validPlaces[placement][0] + s[1]][block.validPlaces[placement][1] + s[0]].occupyTile(block.color);
        }
        this.bar.blocks.splice(blockIndex, 1);
        this.update();
    }
}