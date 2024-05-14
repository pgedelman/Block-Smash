import { Rect } from './rect.js';

export class Block {
    constructor(place, type) {
        this.place = place;
        this.type = type;
        this.color = 'rgb(0, 0, 0)';
        this.x = 662;
        this.y = place;
        this.draggable = true;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.squareWidth = 20;
        this.squares = this.makeSquares(type);
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
    update() {
        this.squares = this.makeSquares(this.type);
        const dx = this.x - this.squares[0].x;
        const dy = this.y - this.squares[0].y;
        for (let square of this.squares) {
            square.x += dx;
            square.y += dy;
        }
    }
    draw(context) {
        context.fillStyle = this.color;
        for (let square of this.squares)  {
            context.fillRect(square.x, square.y, square.w, square.h);
        }
    }
}