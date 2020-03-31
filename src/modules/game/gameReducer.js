import {combineReducers} from "redux";

import {SQUARES} from "../shared/constants";
import {actionTypes} from "./gameActions";
import {createGrid} from "./gameUtils";

const defaultState = {
  grid: createGrid(SQUARES),
  pattern: [],
};

const gameReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_GRID: {
      return Object.assign({}, state, {grid: action.payload.grid});
    }
    case actionTypes.SET_PATTERN: {
      return Object.assign({}, state, {pattern: action.payload.pattern});
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({
  gameState: gameReducer,
});
