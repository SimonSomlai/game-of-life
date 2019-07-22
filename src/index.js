// NPM Modules
import React from "react";
import {render} from "react-dom";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
// import logger from "redux-logger";

// External Modules
import {gameReducer} from "./modules/game";

// Components
import {Game} from "./modules/game";

const middlewares = [];
const store = createStore(
  gameReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById("root"),
);
