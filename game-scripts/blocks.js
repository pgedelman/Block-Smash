import { Rect, Point } from './rect.js';

const backgroundColor = 'rgb(72, 137, 204)';
const maxPlacements = {1: 64, 2: 60, 3: 81, 4: 81, 5: 81, 6: 81, 7: 81, 8: 100, 9: 70, 10: 60, 11: 70, 12: 72, 13: 72, 14: 90, 15: 64, 16: 64, 17: 64, 18: 64, 19: 80, 20: 80, 21: 90};

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
        [this.structure, this.structureX, this.structureY] = this.makeStructure();
        this.squares = this.updateSquares();
        this.indexPoint = new Point(this.squares[0].x + this.squares[0].w / 2, this.squares[0].y + this.squares[0].h / 2);
        this.selectedTiles = null;
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
                this.color = 'rgb(247, 220, 111)';
                break;
            case 2: // 5 Line Up
                for (let i = 0; i < 5; i++) {
                    structure.push([0, i]);
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 3: // First Small Step
                structure.push([0, 0], [0, 1], [1, 1]);
                this.color = 'rgb(236, 112, 99)';
                break;  
            case 4: // Second Small Step
                structure.push([0, 0], [1, 0], [1, 1]);
                this.color = 'rgb(236, 112, 99)';
                break;  
            case 5: // Third Small Step
                structure.push([0, 1], [1, 1], [1, 0]);
                this.color = 'rgb(236, 112, 99)';
                break;  
            case 6: // Fourth Small Step
                structure.push([0, 0], [0, 1], [1, 0]);
                this.color = 'rgb(236, 112, 99)';
                break;  
            case 7: // Small Square
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        structure.push([i, j]);
                    }
                }
                this.color = 'rgb(247, 220, 111)';
                break;
            case 8: // Mini Block
                structure.push([0, 0]);
                this.color = 'rgb(247, 220, 111)';
                break;
            case 9: // 4 Line Up
                for (let i = 0; i < 4; i++) {
                    structure.push([0, i]);
                }
                this.color = 'rgb(165, 105, 189)';
                break;
            case 10: // 5 Line Left
                for (let i = 0; i < 5; i++) {
                    structure.push([i, 0]);
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 11: // 4 Line Left
                for (let i = 0; i < 4; i++) {
                    structure.push([i, 0]);
                }
                this.color = 'rgb(165, 105, 189)';
                break;
            case 12: // Part Square Up
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 3; j++) {
                        structure.push([i, j]);
                    }
                }
                this.color = 'rgb(236, 112, 99)';
                break;
            case 13: // Part Square Left
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        structure.push([i, j]);
                    }
                }
                this.color = 'rgb(236, 112, 99)';
                break;
            case 14: // 2 Line Up
                for (let i = 0; i < 2; i++) {
                    structure.push([0, i]);
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 15: // First Big Step
                structure.push([0, 0]);
                for (let i = 1; i < 3; i++) {
                    structure.push([i, 0], [0, i]);
                }
                this.color = 'rgb(82, 190, 128)';
                break;
            case 16: // Second Big Step
                structure.push([0, 0], [0, 1], [1, 2], [2, 2], [0, 2]);
                this.color = 'rgb(82, 190, 128)';
                break;
            case 17: // Third Big Step
                for (let i = 0; i < 2; i++) {
                    structure.push([i, 0], [2, i]);
                }
                structure.push([2, 2]);
                this.color = 'rgb(82, 190, 128)';
                break;
            case 18: // Fourth Big Step
                structure.push([0, 2], [1, 2], [2, 0], [2, 1], [2, 2]);
                this.color = 'rgb(82, 190, 128)';
                break;
            case 19: // 3 Line Up
                for (let i = 0; i < 3; i++) {
                    structure.push([0, i]);
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 20: // 3 Line Left
                for (let i = 0; i < 3; i++) {
                    structure.push([i, 0]);
                }
                this.color = 'rgb(103, 165, 206)';
                break;
            case 21: // 2 Line Left
                for (let i = 0; i < 2; i++) {
                    structure.push([i, 0]);
                }
                this.color = 'rgb(103, 165, 206)';
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
    select(row, col) {
        if (row < 0 || col < 0) {
            this.selectedTiles = null
            return;
        }
        let selectedTiles = [];
        for (let i of this.structure) {
            selectedTiles.push([row + i[1], col + i[0]])
        }
        for (let i of selectedTiles) {
            if (i[0] > 9 || i[0] < 0 || i[1] > 9 || i[1] < 0) {
                this.selectedTiles = null;
                return;
            }
        }
        return selectedTiles;
    }
    reset() {
        this.squareWidth = 20;
        this.x = this.originX - this.squareWidth * (this.structureY + 1) / 2;
        this.y = this.originY - this.squareWidth * (this.structureX + 1) / 2;
        this.offsetX = 0;
        this.offsetY = 0;
        this.squares = this.updateSquares();
    }
    findValidPlacement(grid) {
        let validPlacement = [];
        let n = grid.length;
        let m = grid[0].length;
        let i = 0;
        for (let row = 0; row + this.structureX < n; row++) {
            for (let col = 0; col + this.structureY < m; col++) {
                if (!grid[row][col].occupied) {
                    let validOption = [row, col];
                    for (let s of this.structure) {
                        if (grid[row + s[1]][col + s[0]].occupied) {
                            validOption = [-1, -1];
                            break;
                        }
                    }
                    validPlacement[i] = validOption;
                } else validPlacement[i] = [-1, -1];
                i++;
            }
        }
        return validPlacement;
    }
    updateSquares() {
        let squares = [];
        for (let s of this.structure) {
            squares.push(new Rect(this.x + s[0] * this.squareWidth, this.y + s[1] * this.squareWidth, this.squareWidth, this.squareWidth))
        }
        return squares;
    }
    update() {
        this.squares = this.updateSquares();
        if (this.type === 5) {
            this.indexPoint = new Point(this.squares[0].x + this.squareWidth / 2, this.squares[0].y - this.squareWidth * 3 / 2);
        } else if (this.type === 18) {
            this.indexPoint = new Point(this.squares[0].x + this.squareWidth / 2, this.squares[0].y - this.squareWidth * 7 / 2);
        } else this.indexPoint = new Point(this.squares[0].x + this.squareWidth / 2, this.squares[0].y + this.squareWidth / 2);
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