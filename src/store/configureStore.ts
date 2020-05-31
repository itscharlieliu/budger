import { applyMiddleware, CombinedState, createStore, Store } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "./rootReducer";

import IApplicationState from "./index";

function configureStore(): Store<CombinedState<IApplicationState>> {
    return createStore(rootReducer, applyMiddleware(thunk, logger));
}

export default configureStore;
