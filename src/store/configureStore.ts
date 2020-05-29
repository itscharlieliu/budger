import { applyMiddleware, CombinedState, createStore, Store } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import IApplicationState from "./index";
import rootReducer from "./rootReducer";

function configureStore(): Store<CombinedState<IApplicationState>> {
    return createStore(rootReducer, applyMiddleware(thunk, logger));
}

export default configureStore;
