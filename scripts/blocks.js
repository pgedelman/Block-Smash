import { Rect, Point } from './rect.js';

const backgroundColor = 'rgb(72, 137, 204)';

export class Block {
    constructor(y, type) {
        this.type = type;
        this.color = 'rgb(0, 0, 0)';
        this.x = 662;
        this.y = y;
        this.originX = 662;
        this.originY = y;
        this.draggable = true;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.squareWidth = 20;
        this.squares = this.makeSquares(type);
        this.indexPoint = new Point(this.squares[0].x + this.squares[0].w / 2, this.squares[0].y + this.squares[0].h / 2);
        this.selectedTiles = null;
    }
    makeSquares(type) {
        let squares = [];
        switch (type) {
            case 1: // Big Square
                this.x -= this.squareWidth * 3 / 2;
                this.y -= this.squareWidth * 3 / 2;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        squares.push(new Rect(this.x + i * this.squareWidth, this.y + j * this.squareWidth, this.squareWidth, this.squareWidth));
                    }
                }
                this.color = 'rgb(247, 220, 111)';
                break;
            case 2: // Big Line
                this.x -= this.squareWidth / 2;
                this.y -= this.squareWidth * 5 / 2;
                for (let i = 0; i < 5; i++) {
                    squares.push(new Rect(this.x, this.y + i * this.squareWidth, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(133, 193, 233)';
                break;
            case 3: // First Small Step
                this.x -= this.squareWidth * 2 / 2;
                this.y -= this.squareWidth * 2 / 2;
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x, this.y + this.squareWidth, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y + this.squareWidth, this.squareWidth, this.squareWidth));
                this.color = 'rgb(236, 112, 99)';
                break;  
        }
        return squares;
    }
    select(row, col) {
        let selectedTiles = [];
        switch (this.type) {
            case 1: // Big Square
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (row + i > 9 || col + j > 9) {
                            selectedTiles = null;
                            return;
                        }
                        selectedTiles.push([row + i, col + j]);
                    }
                }
                break;
            case 2: // Big Line
                for (let i = 0; i < 5; i++) {
                    if (row + i > 9) {
                        selectedTiles = null;
                        return;
                    }
                    selectedTiles.push([row + i, col]);
                }
                break;
            case 3: // First Small Step
                if (row + 1 > 9 || col + 1 > 9) {
                    selectedTiles = null;
                    return;
                }
                selectedTiles.push([row, col]);
                selectedTiles.push([row + 1, col]);
                selectedTiles.push([row + 1, col + 1]);
                break;
        }
        this.selectedTiles = selectedTiles;
    }
    reset() {
        this.x = this.originX;
        this.y = this.originY;
        this.offsetX = 0;
        this.offsetY = 0;
        this.squareWidth = 20;
        this.squares = this.makeSquares(this.type);
    }
    update() {
        this.squares = this.makeSquares(this.type);
        this.indexPoint = new Point(this.squares[0].x + this.squares[0].w / 2, this.squares[0].y + this.squares[0].h / 2);
        const dx = this.x - this.squares[0].x;
        const dy = this.y - this.squares[0].y;
        for (let square of this.squares) {
            square.x += dx;
            square.y += dy;
        }
    }
    draw(context) {
        context.fillStyle = backgroundColor;
        for (let square of this.squares) {
            context.fillRect(square.x, square.y, square.w, square.h);
        }
        context.fillStyle = this.color;
        for (let square of this.squares)  {
            context.fillRect(square.x + square.w * .02, square.y + square.h * .02, square.w * .96, square.h * .96);
        }
    }
}