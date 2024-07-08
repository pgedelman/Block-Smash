export function findMoves(grid, blocks) {
    let moves = {};
    let n = grid.length;
    let m = grid[0].length;
    for (let block of blocks) {
        let blockMoves = [];
        for (let row = 0; row + block.structureX < n; row++) {
            for (let col = 0; col + block.structureY < m; col++) {
                if (!grid[row][col].occupied && block.structure.every((s) => !grid[row + s[1]][col + s[0]].occupied)) {
                    blockMoves.push([row, col]);
                }
            }
        }
        moves[block.type] = blockMoves;
    }
    return moves;
}

export function findMoveset(grid, blocks) {
    const moveset = [];
    let exampleGrid = grid.map(row => row.map(tile => tile.occupied ? 1 : 0));
    const n = exampleGrid.length;
    const m = exampleGrid[0].length;
    function findMovesetHelper(exampleGrid, blocks, index, movePath) {
        if (index === blocks.length && movePath.length === blocks.length) {
            moveset.push([...movePath])
            return;
        }
        for (let i = index; i < blocks.length; i++) {
            for (let row = 0; row + blocks[i].structureX < n; row++) {
                for (let col = 0; col + blocks[i].structureY < m; col++) {
                    if (exampleGrid[row][col] === 0 && blocks[i].structure.every((s) => exampleGrid[row + s[1]][col + s[0]] === 0)) {
                        let [smashedGrid, score] = smashExampleGrid(exampleGrid, blocks[i].structure, row, col);
                        movePath.push([blocks[i].type, score, row, col]);
                        findMovesetHelper(smashedGrid, blocks, i + 1, movePath);
                        movePath.pop();
                    }
                }
            }
        }
    }
    findMovesetHelper(exampleGrid, blocks, 0, []);
    return moveset;
}

function smashExampleGrid(grid, structure, row, col) {
    let exampleGrid = [];
    for (let row in grid) {
        exampleGrid[row] = grid[row].slice();
    }
    structure.forEach((s) => {
        exampleGrid[row + s[1]][col + s[0]] = 1;
    });
    let score = 0;
    let gettingSmashed = [];
    for (let i in exampleGrid) {
        let fullRowSmashed = true;
        for (let j in exampleGrid[i]) {
            if (exampleGrid[i][j] === 0) {
                fullRowSmashed = false;
            }
        }
        if (fullRowSmashed) {
            for (let j in exampleGrid[i]) {
                gettingSmashed.push([i, j]);
            }
        }
    }
    for (let i in exampleGrid) {
        let fullColSmashed = true;
        for (let j in exampleGrid[i]) {
            if (exampleGrid[j][i] === 0) {
                fullColSmashed = false;
            }
        }
        if (fullColSmashed) {
            for (let j in exampleGrid[i]) {
                gettingSmashed.push([j, i]);
            }       
        }
    }
    for (let [row, col] of gettingSmashed) {
        exampleGrid[row][col] = 0;
    }
    if (gettingSmashed.length > 0) {
        score += 10 * Math.pow(gettingSmashed.length, 2) - 10 * gettingSmashed.length + 15;
    }
    return [exampleGrid, score];
}
