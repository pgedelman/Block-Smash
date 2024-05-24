import { Rect } from './rect.js';
import { Tile } from './tiles.js';
import { Bar } from './bar.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 725;
    canvas.height = 600;

    class Game {
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
        }
        draw(context) {
            for (let row of this.grid) {
                for (let tile of row) {
                    tile.draw(context);
                }
            }
            this.bar.draw(context);
        }
        mouseDown(x, y) {
            console.log(this);
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
        mouseMove(x, y) {
            // console.log("X: ", x, " | Y: ", y);
            if (this.draggingBlock) {
                this.draggingBlock.x = x - this.draggingBlock.offsetX;
                this.draggingBlock.y = y - this.draggingBlock.offsetY;
                this.draggingBlock.update();
                let containsIndexPoint = null;
                for (let row of this.grid) {
                    for (let tile of row) {
                        tile.rect.selected = false;
                        if (tile.rect.contains(this.draggingBlock.indexPoint.x, this.draggingBlock.indexPoint.y)) containsIndexPoint = tile;
                    }
                }
                if (containsIndexPoint) {
                    this.draggingBlock.select(containsIndexPoint.row, containsIndexPoint.col)
                    if (!this.draggingBlock.selectedTiles) return;
                    for (let i of this.draggingBlock.selectedTiles) {
                        this.grid[i[0]][i[1]].rect.selected = true;
                    }
                }
            }
        }
        mouseUp() {
            if (this.draggingBlock) {
                if (this.draggingBlock.selectedTiles) {
                    for (let row of this.grid) {
                        for (let tile of row)
                        if (tile.rect.selected) tile.occupyTile(this.draggingBlock.color);
                        for (let i in this.bar.blocks) {
                            if (this.bar.blocks[i].originY === this.draggingBlock.originY) {
                                this.bar.blocks.splice(i, 1);
                                break;
                            }
                        }
                    }
                    this.draggingBlock.draggable = false;
                } else {
                    this.draggingBlock.reset();
                }
                this.draggingBlock.selectedTiles = null;
                this.draggingBlock = null;
                this.unselectGrid();
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

    const game = new Game(canvas.width, canvas.height);
    console.log(game);

    canvas.addEventListener('mousedown', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        game.mouseDown(x, y);
    });

    canvas.addEventListener('mouseup', () => {
        game.mouseUp();
    });

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        game.mouseMove(x, y);
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});