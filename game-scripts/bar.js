import { Block } from './blocks.js';

export class Bar {
    constructor() {
        this.blocks = this.generateBlocks();
    }
    generateBlocks() {
        let blocks = [];
        for (let x = 100; x < 600; x += 200) {
            blocks.push(new Block(x, Math.floor(Math.random() * 21 + 1)));
        }
        return blocks;
    }
    update() {
        if (this.blocks.length === 0) { 
            this.blocks = this.generateBlocks();
        }
    }
    draw(context) {
        for (let block of this.blocks) {
            if (block) block.draw(context);
        }
    }
}