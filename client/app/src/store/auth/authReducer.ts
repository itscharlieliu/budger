import { AuthState } from "./authInterfaces";
import { AUTH_ACTIONS } from "./authActions";

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

const authReducer = (state: AuthState = initialState, action: any): AuthState => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_REQUEST:
        case AUTH_ACTIONS.REGISTER_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload.data.user,
                token: action.payload.data.token,
                isLoading: false,
                error: null,
                isAuthenticated: true,
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                isAuthenticated: false,
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };

        case AUTH_ACTIONS.RESTORE_SESSION:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                error: null,
            };

        default:
            return state;
    }
};

export default authReducer;
