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
    let moveset = [];
    let exampleGrid = grid.map(row => row.map(tile => tile.occupied ? 1 : 0));
    const n = exampleGrid.length;
    const m = exampleGrid[0].length;
    const memoization = new Map();

    function gridToString(grid) {
        return grid.map(row => row.join('')).join(';');
    }

    function findMovesetHelper(exampleGrid, blocks, index, movePath) {
        const gridString = gridToString(exampleGrid);
        const key = `${gridString}-${index}`;

        if (memoization.has(key)) {
            const alreadyDone = memoization.get(key);
            alreadyDone.forEach(result => moveset.push([...movePath, ...result]));
            return;
        }

        if (index === blocks.length && movePath.length === blocks.length) {
            const [surfaceArea, smallHoles, bigHoles] = findSAandHoles(exampleGrid);
            let score = 0;
            movePath = movePath.flat().filter((move) => {
                if (Array.isArray(move)) {
                    return true;
                } else {
                    score += move;
                    return false;
                }
            });
            const result = [[[...movePath], [surfaceArea, smallHoles, bigHoles, score]]];
            moveset.push(...result);
            memoization.set(key, result);
            return;
        }

        const currentResults = [];

        for (let i = index; i < blocks.length; i++) {
            for (let row = 0; row + blocks[i].structureX < n; row++) {
                for (let col = 0; col + blocks[i].structureY < m; col++) {
                    if (exampleGrid[row][col] === 0 && blocks[i].structure.every((s) => exampleGrid[row + s[1]][col + s[0]] === 0)) {
                        let [smashedGrid, score] = smashExampleGrid(exampleGrid, blocks[i].structure, row, col);
                        movePath.push([[blocks[i].type, row, col], score + blocks[i].squares.length]);
                        findMovesetHelper(smashedGrid, blocks, i + 1, movePath);
                        movePath.pop();
                    }
                }
            }
        }
        currentResults.push([...movePath]);
        memoization.set(key, currentResults);
    }
    findMovesetHelper(exampleGrid, blocks, 0, []);
    if (moveset.length > 150000) {
        moveset = moveset.filter((_, index) => index % 5 === 0);
    }
    return moveset;
}

function smashExampleGrid(grid, structure, row, col) {
    let exampleGrid = [];
    let groupsSmashed = 0;
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
            groupsSmashed++;
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
            groupsSmashed++;
            for (let j in exampleGrid[i]) {
                gettingSmashed.push([j, i]);
            }       
        }
    }
    for (let [row, col] of gettingSmashed) {
        exampleGrid[row][col] = 0;
    }
    if (gettingSmashed.length > 0) {
        score += 10 * Math.pow(groupsSmashed, 2) - 10 * groupsSmashed + 15;
    }
    return [exampleGrid, score];
}

function findSAandHoles(grid) {
    const n = grid.length;
    const m = grid[0].length;
    let surfaceArea = 0;
    let smallHoles = 0;
    let bigHoles = 0;
    const bigHoleIndexes = [[0, 0], [0, 1], [0, 2],
                            [1, 0], [1, 1], [1, 2],
                            [2, 0], [2, 1], [2, 2]];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (grid[i][j] === 1) {
                if (i - 1 > 0 && grid[i-1][j] === 0) surfaceArea++;
                if (i + 1 < n && grid[i+1][j] === 0) surfaceArea++;
                if (j - 1 > 0 && grid[i][j-1] === 0) surfaceArea++;
                if (j + 1 < m && grid[i][j+1] === 0) surfaceArea++;
            } else {
                if ((i - 1 < 0 || grid[i-1][j] === 1) && (i + 1 >= n || grid[i+1][j] === 1)
                 && (j - 1 < 0 || grid[i][j-1] === 1) && (j + 1 >= m || grid[i][j+1] === 1)) smallHoles++;
                if (i + 2 < n && j + 2 < m) bigHoles += bigHoleIndexes.every((index) => grid[i+index[0]][j+index[1]] === 0);
            }
        }
    }
    return [surfaceArea, smallHoles, bigHoles];
}