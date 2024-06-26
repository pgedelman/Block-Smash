import { Block } from './blocks.js';

export class Bar {
    constructor(rect) {
        this.rect = rect;
        this.blocks = this.generateBlocks();
    }
    generateBlocks() {
        let blocks = [];
        for (let i = 100; i < 600; i += 200) {
            blocks.push(new Block(i, Math.floor(Math.random() * (20 - 1 + 1) + 1), (i-100) / 200 + 1)); // Should be 22 or more
        }
        return blocks;
    }
    update() {
        if (this.blocks.length === 0) {
            this.blocks = this.generateBlocks();
        }
    }
    draw(context) {
        context.fillStyle = 'rgb(72, 137, 204)';
        context.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        for (let block of this.blocks) {
            block.draw(context);
        }
    }
}