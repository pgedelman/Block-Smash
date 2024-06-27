import { Block } from './blocks.js';
import { Tile } from './tiles.js';

export class Analysis {
    constructor(grid, blocks) {
        this.grid = grid;
        this.blocks = blocks;
    }
    findValidPlacement() {
        let validPlacement = [0,[],[],[]];
        let n = this.grid.length;
        let m = this.grid[0].length;
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < m; col++) {
                if (!this.grid[row][col].occupied) {
                    for (let block of this.blocks) {
                        let validOption = true;
                        let validPlace = [];
                        for (let s of block.structure) {
                            if (row + s[1] <= 9 && row + s[1] >= 0 && col + s[0] <= 9 && col + s[0] >= 0 && !this.grid[row + s[1]][col + s[0]].occupied) {
                                validPlace.push([row + s[1], col + s[0]]);
                            } else {
                                validOption = false;
                                break;
                            }
                        }
                        if (validOption) {
                            validPlacement[block.order].push(validPlace);
                            validPlacement[0] += validPlace.length;
                        }
                    }
                }
            }
        }
        return validPlacement;
    }
}