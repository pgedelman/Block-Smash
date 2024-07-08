import { Rect, Point } from './rect.js';

const backgroundColor = 'rgb(106, 131, 175)';
const yellowColor = 'rgb(241, 212, 98)';
const redColor = 'rgb(236, 112, 99)';
const blueColor = 'rgb(103, 165, 206)';
const purpleColor = 'rgb(165, 105, 189)';
const greenColor = 'rgb(82, 190, 128)';

export class Block {
    constructor(y, type) {
        this.type = type;
        this.color = 'rgb(0, 0, 0)';
        this.x = 662;
        this.y = y;
        this.originX = 662;
        this.originY = y;
        this.isDraggable = true;
        this.offsetX = 0;
        this.offsetY = 0;
        this.squareWidth = 20;
        [this.structure, this.structureX, this.structureY] = this.makeStructure();
        [this.squares, this.points] = this.updateSquares();
        this.validPlaces = null;
    }
    makeStructure() {
        let structure = [];
        switch (this.type) {
            case 1: // Big Square
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        structure.push([i, j]);
                    }
                }
                this.color = yellowColor;
                break;
            case 2: // 5 Line Up
                for (let i = 0; i < 5; i++) {
                    structure.push([0, i]);
                }
                this.color = blueColor;
                break;
            case 3: // First Small Step
                structure.push([0, 0], [0, 1], [1, 1]);
                this.color = redColor;
                break;  
            case 4: // Second Small Step
                structure.push([0, 0], [1, 0], [1, 1]);
                this.color = redColor;
                break;  
            case 5: // Third Small Step
                structure.push([0, 1], [1, 1], [1, 0]);
                this.color = redColor;
                break;  
            case 6: // Fourth Small Step
                structure.push([0, 0], [0, 1], [1, 0]);
                this.color = redColor;
                break;  
            case 7: // Small Square
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        structure.push([i, j]);
                    }
                }
                this.color = yellowColor;
                break;
            case 8: // Mini Block
                structure.push([0, 0]);
                this.color = yellowColor;
                break;
            case 9: // 4 Line Up
                for (let i = 0; i < 4; i++) {
                    structure.push([0, i]);
                }
                this.color = purpleColor;
                break;
            case 10: // 5 Line Left
                for (let i = 0; i < 5; i++) {
                    structure.push([i, 0]);
                }
                this.color = blueColor;
                break;
            case 11: // 4 Line Left
                for (let i = 0; i < 4; i++) {
                    structure.push([i, 0]);
                }
                this.color = purpleColor;
                break;
            case 12: // Part Square Up
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 3; j++) {
                        structure.push([i, j]);
                    }
                }
                this.color = redColor;
                break;
            case 13: // Part Square Left
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        structure.push([i, j]);
                    }
                }
                this.color = redColor;
                break;
            case 14: // 2 Line Up
                for (let i = 0; i < 2; i++) {
                    structure.push([0, i]);
                }
                this.color = blueColor;
                break;
            case 15: // First Big Step
                structure.push([0, 0]);
                for (let i = 1; i < 3; i++) {
                    structure.push([i, 0], [0, i]);
                }
                this.color = greenColor;
                break;
            case 16: // Second Big Step
                structure.push([0, 0], [0, 1], [1, 2], [2, 2], [0, 2]);
                this.color = greenColor;
                break;
            case 17: // Third Big Step
                for (let i = 0; i < 2; i++) {
                    structure.push([i, 0], [2, i]);
                }
                structure.push([2, 2]);
                this.color = greenColor;
                break;
            case 18: // Fourth Big Step
                structure.push([0, 2], [1, 2], [2, 0], [2, 1], [2, 2]);
                this.color = greenColor;
                break;
            case 19: // 3 Line Up
                for (let i = 0; i < 3; i++) {
                    structure.push([0, i]);
                }
                this.color = blueColor;
                break;
            case 20: // 3 Line Left
                for (let i = 0; i < 3; i++) {
                    structure.push([i, 0]);
                }
                this.color = blueColor;
                break;
            case 21: // 2 Line Left
                for (let i = 0; i < 2; i++) {
                    structure.push([i, 0]);
                }
                this.color = blueColor;
                break;
        }
        let x = 0, y = 0;
        for (let s of structure) {
            x = Math.max(x, s[1]);
            y = Math.max(y, s[0]);
        }
        this.x -= this.squareWidth * (y + 1) / 2;
        this.y -= this.squareWidth * (x + 1) / 2;
        return [structure, x, y];
    }
    reset() {
        this.squareWidth = 20;
        this.x = this.originX - this.squareWidth * (this.structureY + 1) / 2;
        this.y = this.originY - this.squareWidth * (this.structureX + 1) / 2;
        this.offsetX = 0;
        this.offsetY = 0;
        [this.squares, this.points] = this.updateSquares();
    }
    updateSquares() {
        let squares = [];
        let points = [];
        for (let segment of this.structure) {
            let square = new Rect(this.x + segment[0] * this.squareWidth, this.y + segment[1] * this.squareWidth, this.squareWidth, this.squareWidth);
            squares.push(square);
            if (this.type !== 5 && this.type !== 18) points.push(new Point(square.x + this.squareWidth / 2, square.y + this.squareWidth / 2));
            else if (this.type === 5) points.push(new Point(square.x + this.squareWidth / 2, square.y - this.squareWidth / 2));
            else points.push(new Point(square.x + this.squareWidth / 2, square.y - this.squareWidth * 3 / 2));
        }
        return [squares, points];
    }
    update() {
        [this.squares, this.points] = this.updateSquares();
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