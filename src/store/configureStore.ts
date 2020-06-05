import { applyMiddleware, CombinedState, createStore, Store } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import rootReducer from "./rootReducer";

import ApplicationState from "./index";

function configureStore(): Store<CombinedState<ApplicationState>> {
    return createStore(rootReducer, applyMiddleware(thunk, logger));
}

export default configureStore;
