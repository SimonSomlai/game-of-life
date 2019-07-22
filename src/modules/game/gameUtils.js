import {SQUARES} from "../shared/constants";

export const getNextGenerations = grid => {
  return grid.map((column, x) => {
    return column.map((position, y) => {
      const isAlive = !!position;
      return getNextGenerationForPosition(grid, isAlive, x, y);
    });
  });
};

export const getNextGenerationForPosition = (grid, isAlive, x, y) => {
  const liveNeighbours = getLiveNeighbours(grid, x, y);
  switch (true) {
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    case isAlive && liveNeighbours < 2: {
      return 0;
    }
    // Any live cell with two or three live neighbours lives on to the next generation.
    case isAlive && (liveNeighbours === 2 || liveNeighbours === 3): {
      return 1;
    }
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    case isAlive && liveNeighbours > 3: {
      return 0;
    }
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    case !isAlive && liveNeighbours === 3: {
      return 1;
    }
    default: {
      // In all other cases, return current state
      return isAlive ? 1 : 0;
    }
  }
};

// eslint-disable-next-line no-extend-native
Number.prototype.mod = function(n) {
  return ((this % n) + n) % n;
};

export const getLiveNeighbours = (grid, x, y) => {
  const neighbours = [
    [-1, -1], // Top left
    [0, -1], // Top center
    [1, -1], // Top right
    [1, 1], // Bottom right
    [0, 1], // Bottom center
    [-1, 1], // Bottom left
    [1, 0], // Right center
    [-1, 0], // Left center
  ];

  const liveNeighbours = neighbours.reduce((total, coordinates) => {
    const [xOffset, yOffset] = coordinates;
    const neighbourX = (x + xOffset).mod(SQUARES);
    const neighbourY = (y + yOffset).mod(SQUARES);
    const isLiveNeighbour = !!grid[neighbourX][neighbourY];
    if (isLiveNeighbour) total += 1;
    return total;
  }, 0);

  return liveNeighbours;
};

// Generates a SQUARES x SQUARES 2D array with random state
export const getDefaultGameState = squares => {
  const grid = [];
  for (let column = 0; column < squares; column++) {
    grid[column] = [];
    for (let position = 0; position < squares; position++) {
      grid[column][position] = getRandom();
    }
  }
  return grid;
};

export const getRandom = () => Math.round(Math.random());

export const updateGrid = (grid, x, y) => {
  const isAlive = !!grid[x][y];
  const newGrid = grid.map(column => column.slice());
  newGrid[x][y] = isAlive ? 0 : 1;
  return newGrid;
};
