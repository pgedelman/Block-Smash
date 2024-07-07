export class LostScreen {
    constructor(score){
        this.message = 'You Lost';
        this.score = 'Score: ' + score.toString();
    }
    update() {
        if (this.blocks.length === 0) {
            this.blocks = this.generateBlocks();
        }
    }
    draw(context, x, y) {
        context.fillStyle = 'rgb(0, 0, 0)';
        context.font = '6rem Arial';
        context.textAlign = "center";
        context.fillText(this.message, x, y);
        context.fillText(this.score, x, y + 100);
    }
}