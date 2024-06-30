import { Rect } from './rect.js';
import { Bar } from './bar.js';
import { Grid } from './tiles.js';
import { LostScreen } from './lost.js';

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.draggingBlock = null;
        this.bar = new Bar(new Rect(canvas.height, 0, canvas.width - canvas.height, canvas.height));
        this.grid = new Grid();
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
            if (this.draggingBlock.selectedTiles) {
                for (let row of this.grid.tiles) {
                    for (let tile of row)
                    if (tile.rect.selected) tile.occupyTile(this.draggingBlock.color);
                    for (let i in this.bar.blocks) {
                        if (this.bar.blocks[i] && this.bar.blocks[i].originY === this.draggingBlock.originY) {
                            this.bar.blocks.splice(i, 1);
                            this.points += this.draggingBlock.squares.length;
                            break;
                        }
                    }
                }
                this.draggingBlock.draggable = false;
                blockPlaced = true; 
            } else {
                this.draggingBlock.reset();
            }
            this.draggingBlock.selectedTiles = null;
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
            let containsIndexPoint = null;
            for (let row of this.grid.tiles) {
                for (let tile of row) {
                    tile.rect.selected = false;
                    if (tile.rect.contains(this.draggingBlock.indexPoint.x, this.draggingBlock.indexPoint.y)) {
                        containsIndexPoint = tile;
                    }
                }
            }
            if (containsIndexPoint) {
                this.draggingBlock.selectedTiles = this.draggingBlock.select(containsIndexPoint.row, containsIndexPoint.col)
                if (!this.draggingBlock.selectedTiles) return; 
                for (let i of this.draggingBlock.selectedTiles) {
                    if (this.grid.tiles[i[0]][i[1]].occupied) {
                        this.draggingBlock.selectedTiles = null;
                        return;
                    }
                }
                for (let i of this.draggingBlock.selectedTiles) {
                    this.grid.tiles[i[0]][i[1]].rect.selected = true;
                }
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