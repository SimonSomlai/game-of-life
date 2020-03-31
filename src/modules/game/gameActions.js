export const actionTypes = {
  SET_GRID: "game/SET_GRID",
  SET_PATTERN: "game/SET_PATTERN",
};

export const setGrid = newGrid => {
  return {
    type: actionTypes.SET_GRID,
    payload: {
      grid: newGrid,
    },
  };
};

export const setPattern = coordinates => {
  return {
    type: actionTypes.SET_PATTERN,
    payload: {
      pattern: coordinates,
    },
  };
};

export const actions = {
  setGrid,
  setPattern,
};
