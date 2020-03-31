import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";

import {gameReducer} from "./modules/game";
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
