import { Rect } from './rect.js';
import { Bar } from './bar.js';
import { Grid } from './tiles.js';
import { LostScreen } from './lost.js';

const backgroundColor = 'rgb(106, 131, 175)';

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.rect = new Rect(0, 0, width, height);
        this.blockBar = new Bar();
        this.tileGrid = new Grid(0, 0, height, height);
        this.score = 0;
        this.isOver = false;
        this.lostScreen = null;
        this.info = {}
        this.analyzeGameInfo(); 
    }
    analyzeGameInfo() {
        let num_moves = 0;
        let moves = {};
        for (let block of this.blockBar.blocks) {
            if (block) {
                block.validPlaces = block.findValidPlacement(this.tileGrid.tiles);
                moves[block.type] = block.validPlaces;
                for (let i of block.validPlaces) {
                    num_moves += i[0] !== -1;
                }
            }
        }
        let grid = [];
        for (let row of this.tileGrid.tiles) {
            for (let tile of row) {
                if (tile.occupied) grid.push(0);
                else grid.push(1);
            }
        }
        this.info = {
            score: this.score,
            tileGrid: grid,
            num_moves: num_moves,
            moves: moves,
        };
    }
    update() {
        this.blockBar.update();
        this.score += this.tileGrid.smashTiles();
        if (this.info.num_moves === 0) {
            this.isOver = true;
            this.lostScreen = new LostScreen(this.score, this.width, this.height);
        }
    }
    draw(context) {
        context.fillStyle = backgroundColor;
        context.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        this.tileGrid.draw(context);
        this.blockBar.draw(context);
        if (this.isOver) {
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
            if (this.tileGrid.selectedTiles) {
                for (let row of this.tileGrid.tiles) {
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
            this.tileGrid.selectedTiles = null;
            this.blockBeingDragged = null;
            this.tileGrid.unselectGrid();
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
                for (let row of this.tileGrid.tiles) {
                    for (let tile of row) {
                        tile.selected = false;
                        if (tile.rect.contains(point.x, point.y) && !tile.occupied) {
                            selectedTiles.push(tile);
                        }
                    }
                }
            }
            if (this.blockBeingDragged.squares.length === selectedTiles.length) {
                this.tileGrid.selectedTiles = selectedTiles;
                for (let tile of selectedTiles) {
                    tile.selected = true;
                }
            } else {
                this.tileGrid.selectedTiles = null;
            }
        }
    }
}

export class AIGame extends Game {
    constructor(width, height) {
        super(width, height);
    }
    placeBlock(blockType, placement) {
        let stagedBlock = null;
        let blockIndex = 0;
        for (let block of this.blockBar.blocks) {
            if (block.type === blockType) {
                block = block;
                break;
            }
            blockIndex++;
        }
        for (let s of stagedBlock.structure) {
            this.tileGrid.tiles[stagedBlock.validPlaces[placement][0] + s[1]][stagedBlock.validPlaces[placement][1] + s[0]].occupyTile(stagedBlock.color);
        }
        this.blockBar.blocks.splice(blockIndex, 1);
        this.update();
    }
}