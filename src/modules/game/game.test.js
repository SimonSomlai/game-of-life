import {
  getNextGenerations,
  getNextGenerationForPosition,
  getLiveNeighbours,
  createGrid,
  getRandom,
} from "./gameUtils";

const grid = [
  [0, 1, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 1, 0, 1],
  [0, 1, 0, 1, 0],
];

const expectedNextGenerations = [
  [1, 0, 1, 0, 0],
  [0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1],
  [0, 1, 1, 0, 1],
  [0, 1, 0, 1, 1],
];

test("It calculates next generations correctly", () => {
  const nextGenerations = getNextGenerations(grid);
  expect(nextGenerations).toEqual(expectedNextGenerations);
});

test("It counts neighbours correctly", () => {
  const amount1 = getLiveNeighbours(grid, 2, 2);
  expect(amount1).toBe(1);

  const amount2 = getLiveNeighbours(grid, 0, 0);
  expect(amount2).toBe(3);

  const amount3 = getLiveNeighbours(grid, 4, 4);
  expect(amount3).toBe(3);

  const amount4 = getLiveNeighbours(grid, 1, 3);
  expect(amount4).toBe(2);
});

test("It calculates underpopulation correctly", () => {
  const isAlive = grid[1][0];
  const nextGeneration = getNextGenerationForPosition(grid, isAlive, 1, 0);
  expect(nextGeneration).toBe(0);
});

test("It calculates overpopulation correctly", () => {
  const isAlive = grid[1][3];
  const nextGeneration = getNextGenerationForPosition(grid, isAlive, 1, 3);
  expect(nextGeneration).toBe(0);
});

test("It calculates reproduction correctly", () => {
  const isAlive = grid[0][1];
  const nextGeneration = getNextGenerationForPosition(grid, isAlive, 0, 1);
  expect(nextGeneration).toBe(0);
});

test("It calculates survival correctly", () => {
  const isAlive = grid[3][3];
  const nextGeneration = getNextGenerationForPosition(grid, isAlive, 3, 3);
  expect(nextGeneration).toBe(isAlive);
});

test("It calculates default correctly", () => {
  const isAlive = grid[1][0];
  const nextGeneration = getNextGenerationForPosition(grid, isAlive, 1, 0);
  expect(nextGeneration).toBe(isAlive);
});

test("It generates the right amount rows & columns", () => {
  const grid10 = createGrid(10);
  expect(grid10).toHaveLength(10);
  expect(grid10[6]).toHaveLength(10);

  const grid50 = createGrid(50);
  expect(grid50).toHaveLength(50);
  expect(grid50[43]).toHaveLength(50);
});

test("It generates a random number between 0 & 1", () => {
  const randomSelection = [];
  for (let i of Array(50).keys()) {
    randomSelection[i] = getRandom();
  }

  randomSelection.forEach(number => {
    expect(number).toBeGreaterThanOrEqual(0); // inclusive
    expect(number).toBeLessThan(2); // exclusive
  });
});
