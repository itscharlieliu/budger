import { applyMiddleware, CombinedState, createStore, Store } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import DEV_MODE from "../defs/devMode";

import rootReducer from "./rootReducer";

import ApplicationState from "./index";

function configureStore(): Store<CombinedState<ApplicationState>> {
    if (!DEV_MODE) {
        return createStore(rootReducer, applyMiddleware(thunk));
    }
    return createStore(rootReducer, applyMiddleware(thunk, logger));
}

export default configureStore;
