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
            this.bar = new Bar(new Rect(600, 0, 125, canvas.height));
            this.grid = [];
            for (let i = 0; i < 10; i++) {
                let place = [];
                for (let j = 0; j < 10; j++) {
                    place.push(new Tile(new Rect(j * 60, i * 60, 60, 60)));
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
    }

    const game = new Game(canvas.width, canvas.height);
    console.log(game);

    canvas.addEventListener('mousedown', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
        for (let block of game.bar.blocks) {
            if (block.draggable) {
                for (let square of block.squares) {
                    if (square.contains(x, y)) {
                        game.draggingBlock = block;
                        block.dragging = true;
                        block.offsetX = x - block.x;
                        block.offsetY = y - block.y;
                        break;
                    }
                }
            }
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (game.draggingBlock) {
            game.draggingBlock.dragging = false;
            game.draggingBlock.draggable = false;
            game.draggingBlock = null;
        }
    });

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let hoverChanged = false;

        if (game.draggingBlock) {
            game.draggingBlock.squareWidth = 60;
            game.draggingBlock.x = x - game.draggingBlock.offsetX;
            game.draggingBlock.y = y - game.draggingBlock.offsetY;
            game.draggingBlock.update();
            console.log(game);
        }

        for (let row of game.grid) {
            for (let tile of row) {
                const wasHovered = tile.rect.hovered;
                tile.rect.hovered = tile.rect.contains(x, y);
                if (tile.rect.hovered !== wasHovered) {
                    hoverChanged = true;
                }
            }
        }
    });

    function animate() {
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});