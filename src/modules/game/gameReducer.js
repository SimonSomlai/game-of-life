// NPM Modules
import {combineReducers} from "redux";

// External Modules
import {actionTypes} from "./gameActions";
import {getDefaultGameState} from "./gameUtils";
import {SQUARES} from "../shared/constants";

const defaultState = getDefaultGameState(SQUARES);
const gameReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_GRID: {
      return Object.assign([], state, action.payload.grid);
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({
  gameState: gameReducer,
});
