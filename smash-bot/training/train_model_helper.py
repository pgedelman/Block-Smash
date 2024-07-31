import random
import copy
def emptyGrid():
    grid = []
    for i in range(10):
        grid.append([0 for j in range(10)])
    return grid

structures = [[[0, 0], [0, 1], [0, 2],[1, 0], [1, 1], [1, 2],[2, 0], [2, 1], [2, 2]],[ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],[ [0, 0], [0, 1], [1, 1]],[ [0, 0], [1, 0], [1, 1]],[ [0, 1], [1, 1], [1, 0]],[ [0, 0], [0, 1], [1, 0]],[ [0, 0], [0, 1],[1, 0], [1, 1]],[[0, 0]],[[0, 0], [0, 1], [0, 2], [0, 3]],[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],[[0, 0], [1, 0], [2, 0], [3, 0]],[[0, 0], [0, 1], [0, 2],[1, 0], [1, 1], [1, 2]],[[0, 0], [0, 1],[1, 0], [1, 1],[2, 0], [2, 1]],[ [0, 0], [0, 1]],[[0, 0],[1, 0], [2, 0], [0, 1], [0, 2]],[[0, 0], [0, 1], [1, 2], [2, 2], [0, 2]],[[0, 0], [1, 0], [2, 0],[2, 1], [2, 2]],[ [0, 2], [1, 2], [2, 0], [2, 1], [2, 2]],[[0, 0], [0, 1], [0, 2]],[[0, 0], [1, 0], [2, 0]],[[0, 0], [1, 0]]]


def getBlocks():
    blocks = []
    random_blocks = random.choices(range(len(structures)), k=3)
    for i in random_blocks:
        blocks.append(structures[i])
    print(blocks)

def getData(grid, blocks):
    data = []


def find_moveset(grid, blocks):
    moveset = []
    n = len(grid)
    m = len(grid[0])
    memoization = {}

    def grid_to_string(grid):
        return ';'.join([''.join(map(str, row)) for row in grid])

    def find_moveset_helper(example_grid, blocks, index, move_path):
        grid_string = grid_to_string(example_grid)
        key = f"{grid_string}-{index}"

        if key in memoization:
            already_done = memoization[key]
            for result in already_done:
                moveset.append(copy.deepcopy(move_path) + copy.deepcopy(result))
            return

        if index == len(blocks) and len(move_path) == len(blocks):
            surface_area, small_holes, big_holes = find_sa_and_holes(example_grid)
            score = 0
            move_path = [move for move in move_path if isinstance(move, list) or (score := score + move)]
            result = [[copy.deepcopy(move_path), [surface_area, small_holes, big_holes, score]]]
            moveset.extend(result)
            memoization[key] = result
            return

        current_results = []

        for i in range(index, len(blocks)):
            max_x, max_y = 0, 0
            for s in blocks[i]:
                max_x = max(max_x, s[1])
                max_y = max(max_y, s[0])
            for row in range(n - max_x):
                for col in range(m - max_y):
                    if example_grid[row][col] == 0 and all(example_grid[row + s[1]][col + s[0]] == 0 for s in blocks[i]):
                        smashed_grid, score = smash_example_grid(example_grid, blocks[i], row, col)
                        move_path.append([[blocks[i], row, col], score + len(blocks[i])])
                        find_moveset_helper(smashed_grid, blocks, i + 1, move_path)
                        move_path.pop()

        current_results.append(move_path.copy())
        memoization[key] = current_results

    find_moveset_helper(grid, blocks, 0, [])
    if len(moveset) > 150000:
        moveset = [moveset[i] for i in range(len(moveset)) if i % 5 == 0]
    
    return moveset

def find_sa_and_holes(grid):
        n = len(grid)
        m = len(grid[0])
        surface_area = 0
        small_holes = 0
        big_holes = 0
        big_hole_indexes = [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]
        for i in range(n):
            for j in range(m):
                if grid[i][j] == 1:
                    if i - 1 >= 0 and grid[i - 1][j] == 0:
                        surface_area += 1
                    if i + 1 < n and grid[i + 1][j] == 0:
                        surface_area += 1
                    if j - 1 >= 0 and grid[i][j - 1] == 0:
                        surface_area += 1
                    if j + 1 < m and grid[i][j + 1] == 0:
                        surface_area += 1
                else:
                    if (i - 1 < 0 or grid[i - 1][j] == 1) and (i + 1 >= n or grid[i + 1][j] == 1) and (j - 1 < 0 or grid[i][j - 1] == 1) and (j + 1 >= m or grid[i][j + 1] == 1):
                        small_holes += 1
                    if i + 2 < n and j + 2 < m:
                        if all(grid[i + index[0]][j + index[1]] == 0 for index in big_hole_indexes):
                            big_holes += 1
        return surface_area, small_holes, big_holes

def smash_example_grid(grid, structure, row, col):
    example_grid = [row[:] for row in grid]
    for s in structure:
        example_grid[row + s[1]][col + s[0]] = 1
    score = 0
    getting_smashed = []
    groups_smashed = 0
    for i in range(len(example_grid)):
        full_row_smashed = all(tile == 1 for tile in example_grid[i])
        if full_row_smashed:
            groups_smashed += 1
            for j in range(len(example_grid[i])):
                getting_smashed.append((i, j))
    for j in range(len(example_grid[0])):
        full_col_smashed = all(example_grid[i][j] == 1 for i in range(len(example_grid)))
        if full_col_smashed:
            groups_smashed += 1
            for i in range(len(example_grid)):
                getting_smashed.append((i, j))
    for (r, c) in getting_smashed:
        example_grid[r][c] = 0
    if getting_smashed:
        score += 10 * (groups_smashed ** 2) - 10 * groups_smashed + 15
    return example_grid, score

grid = [[0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

blocks = [[[0, 0], [0, 1], [0, 2]],[[0, 0], [1, 0], [2, 0]],[[0, 0], [1, 0]]]

MP = [[[[[0, 0], [0, 1], [0, 2]], 0, 0], 1838], [[[[0, 0], [1, 0], [2, 0]], 9, 7], 3], [[[[0, 0], [1, 0]], 5, 1], 2]]

score = 0
def mp_filter(v):
    global score
    if isinstance(v, list):
        return True
    else:
        score += v

move_path = filter(mp_filter, sum(MP, []))

for i in find_moveset(grid, blocks):
    print(i)
print(score)