import { Rect } from './rect.js';
import { Tile } from './tiles.js';
import { Bar } from './bar.js';
import { Analysis } from './analysis.js';

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.draggingBlock = null;
        this.bar = new Bar(new Rect(canvas.height, 0, canvas.width - canvas.height, canvas.height));
        this.grid = [];
        for (let i = 0; i < 10; i++) {
            let place = [];
            for (let j = 0; j < 10; j++) {
                place.push(new Tile(i, j, new Rect(j * 60, i * 60, 60, 60)));
            }
            this.grid.push(place);
        }
        this.points = 0;
        this.info = {}
    }
    draw(context) {
        for (let row of this.grid) {
            for (let tile of row) {
                tile.draw(context);
            }
        }
        this.bar.draw(context);
    }
    analyze() {
        let analysis = new Analysis(this.grid, this.bar.blocks);
        let analysisData = analysis.findValidPlacement();
        this.info = {
            points: this.points,
            num_options: analysisData[0],
            options: analysisData.slice(1),
        };
        console.log(this.info);
    }
    clickBlock(x, y) {
        console.log(x, y);
        for (let block of this.bar.blocks) {
            if (block.draggable) {
                for (let square of block.squares) {
                    if (square.contains(x, y)) {
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
                for (let row of this.grid) {
                    for (let tile of row)
                    if (tile.rect.selected) tile.occupyTile(this.draggingBlock.color);
                    for (let i in this.bar.blocks) {
                        if (this.bar.blocks[i].originY === this.draggingBlock.originY) {
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
            this.unselectGrid();
        }
        if (blockPlaced) {
            this.bar.update();
            this.analyze();
        }
    }
    dragBlock(x, y) {
        if (this.draggingBlock) {
            this.draggingBlock.x = x - this.draggingBlock.offsetX;
            this.draggingBlock.y = y - this.draggingBlock.offsetY;
            this.draggingBlock.update();
            let containsIndexPoint = null;
            for (let row of this.grid) {
                for (let tile of row) {
                    tile.rect.selected = false;
                    if (tile.rect.contains(this.draggingBlock.indexPoint.x, this.draggingBlock.indexPoint.y)) {
                        containsIndexPoint = tile;
                    }
                }
            }
            if (containsIndexPoint) {
                this.draggingBlock.select(containsIndexPoint.row, containsIndexPoint.col)
                if (!this.draggingBlock.selectedTiles) return; 
                for (let i of this.draggingBlock.selectedTiles) {
                    if (this.grid[i[0]][i[1]].occupied) {
                        this.draggingBlock.selectedTiles = null;
                        return;
                    }
                }
                for (let i of this.draggingBlock.selectedTiles) {
                    this.grid[i[0]][i[1]].rect.selected = true;
                }
            }
        }
    }
    smashTiles() {
        let gettingSmashed = [];
        for (let i in this.grid) {
            let fullRowSmashed = true;
            for (let j in this.grid[i]) {
                if (!this.grid[i][j].occupied) {
                    fullRowSmashed = false;
                }
            }
            if (fullRowSmashed) gettingSmashed.push(this.grid[i]);
        }
        for (let i in this.grid) {
            let fullColSmashed = true;
            for (let j in this.grid[i]) {
                if (!this.grid[j][i].occupied) {
                    fullColSmashed = false;
                }
            }
            if (fullColSmashed) {
                let smashedCol = [];
                for (let j in this.grid[i]) {
                    smashedCol.push(this.grid[j][i]);
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
            this.points += 10 * Math.pow(gettingSmashed.length, 2) - 10 * gettingSmashed.length + 15;
        }
    }
    unselectGrid() {
        for (let row of this.grid) {
            for (let tile of row) {
                tile.rect.selected = false;
            }
        }
    }
}

export class AIGame extends Game {
    constructor(width, height) {
        super(width, height);
    }
}