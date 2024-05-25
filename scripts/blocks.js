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
            case 2: // 5 Line Up
                this.x -= this.squareWidth / 2;
                this.y -= this.squareWidth * 5 / 2;
                for (let i = 0; i < 5; i++) {
                    squares.push(new Rect(this.x, this.y + i * this.squareWidth, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 3: // First Small Step
                this.x -= this.squareWidth * 2 / 2;
                this.y -= this.squareWidth * 2 / 2;
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x, this.y + this.squareWidth, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y + this.squareWidth, this.squareWidth, this.squareWidth));
                this.color = 'rgb(236, 112, 99)';
                break;  
            case 4: // Second Small Step
                this.x -= this.squareWidth * 2 / 2;
                this.y -= this.squareWidth * 2 / 2;
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y + this.squareWidth, this.squareWidth, this.squareWidth));
                this.color = 'rgb(236, 112, 99)';
                break;  
            case 5: // Third Small Step
                this.x -= this.squareWidth * 2 / 2;
                this.y -= this.squareWidth * 2 / 2;
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y - this.squareWidth, this.squareWidth, this.squareWidth));
                this.color = 'rgb(236, 112, 99)';
                break;  
            case 6: // Fourth Small Step
                this.x -= this.squareWidth * 2 / 2;
                this.y -= this.squareWidth * 2 / 2;
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x, this.y - this.squareWidth, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y - this.squareWidth, this.squareWidth, this.squareWidth));
                this.color = 'rgb(236, 112, 99)';
                break;  
            case 7: // Small Square
                this.x -= this.squareWidth * 2 / 2;
                this.y -= this.squareWidth * 2 / 2;
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        squares.push(new Rect(this.x + i * this.squareWidth, this.y + j * this.squareWidth, this.squareWidth, this.squareWidth));
                    }
                }
                this.color = 'rgb(247, 220, 111)';
                break;
            case 8: // Mini Block
                this.x -= this.squareWidth / 2;
                this.y -= this.squareWidth / 2;
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                this.color = 'rgb(247, 220, 111)';
                break;
            case 9: // 4 Line Up
                this.x -= this.squareWidth / 2;
                this.y -= this.squareWidth * 4 / 2;
                for (let i = 0; i < 4; i++) {
                    squares.push(new Rect(this.x, this.y + i * this.squareWidth, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(165, 105, 189)';
                break;
            case 10: // 5 Line Left
                this.x -= this.squareWidth * 5 / 2;
                this.y -= this.squareWidth / 2;
                for (let i = 0; i < 5; i++) {
                    squares.push(new Rect(this.x + i * this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 11: // 4 Line Left
                this.x -= this.squareWidth * 4 / 2;
                this.y -= this.squareWidth / 2;
                for (let i = 0; i < 4; i++) {
                    squares.push(new Rect(this.x + i * this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(165, 105, 189)';
                break;
            case 12: // Part Square Up
                this.x -= this.squareWidth * 2 / 2;
                this.y -= this.squareWidth * 3 / 2;
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 3; j++) {
                        squares.push(new Rect(this.x + i * this.squareWidth, this.y + j * this.squareWidth, this.squareWidth, this.squareWidth));
                    }
                }
                this.color = 'rgb(236, 112, 99)';
                break;
            case 13: // Part Square Left
                this.x -= this.squareWidth * 3 / 2;
                this.y -= this.squareWidth * 2 / 2;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        squares.push(new Rect(this.x + i * this.squareWidth, this.y + j * this.squareWidth, this.squareWidth, this.squareWidth));
                    }
                }
                this.color = 'rgb(236, 112, 99)';
                break;
            case 14: // 2 Line Up
                this.x -= this.squareWidth / 2;
                this.y -= this.squareWidth * 2 / 2;
                for (let i = 0; i < 2; i++) {
                    squares.push(new Rect(this.x, this.y + i * this.squareWidth, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 15: // First Big Step
                this.x -= this.squareWidth * 3 / 2;
                this.y -= this.squareWidth * 3 / 2;
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                for (let i = 1; i < 3; i++) {
                    squares.push(new Rect(this.x + i * this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                    squares.push(new Rect(this.x, this.y + i * this.squareWidth, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(82, 190, 128)';
                break;
            case 16: // Second Big Step
                this.x -= this.squareWidth * 3 / 2;
                this.y -= this.squareWidth * 3 / 2;
                squares.push(new Rect(this.x, this.y + this.squareWidth, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y + 2 * this.squareWidth, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + 2 * this.squareWidth, this.y + 2 * this.squareWidth, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x, this.y + 2 * this.squareWidth, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                this.color = 'rgb(82, 190, 128)';
                break;
            case 17: // Third Big Step
                this.x -= this.squareWidth * 3 / 2;
                this.y -= this.squareWidth * 3 / 2;
                for (let i = 0; i < 2; i++) {
                    squares.push(new Rect(this.x + i * this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                    squares.push(new Rect(this.x + 2 * this.squareWidth, this.y + i * this.squareWidth, this.squareWidth, this.squareWidth));
                }
                squares.push(new Rect(this.x + 2 * this.squareWidth, this.y + 2 * this.squareWidth, this.squareWidth, this.squareWidth));
                this.color = 'rgb(82, 190, 128)';
                break;
            case 18: // Fourth Big Step
                this.x -= this.squareWidth * 3 / 2;
                this.y -= this.squareWidth * 3 / 2;
                squares.push(new Rect(this.x, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x, this.y + this.squareWidth, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x + 2 * this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                squares.push(new Rect(this.x, this.y + 2 * this.squareWidth, this.squareWidth, this.squareWidth));
                this.color = 'rgb(82, 190, 128)';
                break;
            case 19: // 3 Line Up
                this.x -= this.squareWidth / 2;
                this.y -= this.squareWidth * 3 / 2;
                for (let i = 0; i < 3; i++) {
                    squares.push(new Rect(this.x, this.y + i * this.squareWidth, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 20: // 3 Line Left
                this.x -= this.squareWidth * 3 / 2;
                this.y -= this.squareWidth / 2;
                for (let i = 0; i < 3; i++) {
                    squares.push(new Rect(this.x + i * this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 21: // 2 Line Left
                this.x -= this.squareWidth * 2 / 2;
                this.y -= this.squareWidth / 2;
                for (let i = 0; i < 2; i++) {
                    squares.push(new Rect(this.x + i * this.squareWidth, this.y, this.squareWidth, this.squareWidth));
                }
                this.color = 'rgb(103, 165, 206)';
                break;

        }
        return squares;
    }
    select(row, col) {
        if (row < 0 || col < 0) {
            this.selectedTiles = null
            return;
        }
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
            case 4: // Second Small Step
                if (row + 1 > 9 || col + 1 > 9) {
                    selectedTiles = null;
                    return;
                }
                selectedTiles.push([row, col]);
                selectedTiles.push([row, col + 1]);
                selectedTiles.push([row + 1, col + 1]);
                break;
            case 5: // Third Small Step
                if (row - 1 < 0 || col + 1 > 9) {
                    selectedTiles = null;
                    return;
                }
                selectedTiles.push([row, col]);
                selectedTiles.push([row, col + 1]);
                selectedTiles.push([row - 1, col + 1]);
                break;
            case 6: // Fourth Small Step
                if (row - 1 < 0 || col + 1 > 9) {
                    selectedTiles = null;
                    return;
                }
                selectedTiles.push([row, col]);
                selectedTiles.push([row - 1, col]);
                selectedTiles.push([row - 1, col + 1]);
                break;
            case 7: // Small Block
                if (row + 1 > 9 || col + 1 > 9) {
                    selectedTiles = null;
                    return;
                }
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        selectedTiles.push([row + i, col + j]);
                    }
                }
                break;
            case 8: // Mini Block
                if (row > 9 || col > 9) {
                    selectedTiles = null;
                    return;
                }
                selectedTiles.push([row, col]);
                break;
            case 9: // 4 Line Up
                for (let i = 0; i < 4; i++) {
                    if (row + i > 9) {
                        selectedTiles = null;
                        return;
                    }
                    selectedTiles.push([row + i, col]);
                }
                break;
            case 10: // 5 Line Left
                for (let i = 0; i < 5; i++) {
                    if (col + i > 9) {
                        selectedTiles = null;
                        return;
                    }
                    selectedTiles.push([row, col + i]);
                }
                break;
            case 11: // 4 Line Left
                for (let i = 0; i < 4; i++) {
                    if (col + i > 9) {
                        selectedTiles = null;
                        return;
                    }
                    selectedTiles.push([row, col + i]);
                }
                break;
            case 12: // Part Square Up
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        if (row + i > 9 || col + j > 9) {
                            selectedTiles = null;
                            return;
                        }
                        selectedTiles.push([row + i, col + j]);
                    }
                }
                break;
            case 13: // Part Square Up
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (row + i > 9 || col + j > 9) {
                            selectedTiles = null;
                            return;
                        }
                        selectedTiles.push([row + i, col + j]);
                    }
                }
                break;
            case 14: // 2 Line Up
                for (let i = 0; i < 2; i++) {
                    if (row + i > 9) {
                        selectedTiles = null;
                        return;
                    }
                    selectedTiles.push([row + i, col]);
                }
                break;
            case 15: // First Big Step
                if (row > 7 || col > 7) {
                    selectedTiles = null;
                    return;
                }
                selectedTiles.push([row, col]);
                for (let i = 1; i < 3; i++) {
                    selectedTiles.push([row + i, col]);
                    selectedTiles.push([row, col + i]);
                }
                break;
            case 16: // Second Big Step
                if (row > 7 || col < 2) {
                    selectedTiles = null;
                    return;
                }
                selectedTiles.push([row, col]);
                for (let i = 1; i < 3; i++) {
                    selectedTiles.push([row - i, col]);
                    selectedTiles.push([row, col + i]);
                }
                break;
            case 17: // Third Big Step
                if (row > 7 || col > 7) {
                    selectedTiles = null;
                    return;
                
                }
                selectedTiles.push([row, col]);
                selectedTiles.push([row, col + 1]);
                selectedTiles.push([row, col + 2]);
                selectedTiles.push([row + 1, col + 2]);
                selectedTiles.push([row + 2, col + 2]);
                break;
            case 18: // Fourth Big Step
                if (row > 7 || col > 7) {
                    selectedTiles = null;
                    return;
                }
                selectedTiles.push([row, col]);
                selectedTiles.push([row, col + 1]);
                selectedTiles.push([row, col + 2]);
                selectedTiles.push([row + 1, col]);
                selectedTiles.push([row + 2, col]);
                break;
            case 19: // 3 Line Up
                for (let i = 0; i < 3; i++) {
                    if (row + i > 9) {
                        selectedTiles = null;
                        return;
                    }
                    selectedTiles.push([row + i, col]);
                }
                break;
            case 20: // 3 Line Left
                for (let i = 0; i < 3; i++) {
                    if (col + i > 9) {
                        selectedTiles = null;
                        return;
                    }
                    selectedTiles.push([row, col + i]);
                }
                break;
            case 21: // 2 Line Left
                for (let i = 0; i < 2; i++) {
                    if (col + i > 9) {
                        selectedTiles = null;
                        return;
                    }
                    selectedTiles.push([row, col + i]);
                }
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