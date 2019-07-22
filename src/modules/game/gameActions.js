export const actionTypes = {
  SET_GRID: "game/SET_GRID",
};

export const setGrid = newGrid => {
  return {
    type: actionTypes.SET_GRID,
    payload: {
      grid: newGrid,
    },
  };
};

export const actions = {
  setGrid,
};
