import { AuthState, User, AuthResponse, LoginCredentials, RegisterCredentials } from './authInterfaces';

// Action Types
export const AUTH_ACTIONS = {
    LOGIN_REQUEST: 'AUTH/LOGIN_REQUEST',
    LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
    LOGIN_FAILURE: 'AUTH/LOGIN_FAILURE',
    REGISTER_REQUEST: 'AUTH/REGISTER_REQUEST',
    REGISTER_SUCCESS: 'AUTH/REGISTER_SUCCESS',
    REGISTER_FAILURE: 'AUTH/REGISTER_FAILURE',
    LOGOUT: 'AUTH/LOGOUT',
    CLEAR_ERROR: 'AUTH/CLEAR_ERROR',
    SET_LOADING: 'AUTH/SET_LOADING',
    RESTORE_SESSION: 'AUTH/RESTORE_SESSION',
} as const;

// Action Creators
export const loginRequest = (credentials: LoginCredentials) => ({
    type: AUTH_ACTIONS.LOGIN_REQUEST,
    payload: credentials,
});

export const loginSuccess = (response: AuthResponse) => ({
    type: AUTH_ACTIONS.LOGIN_SUCCESS,
    payload: response,
});

export const loginFailure = (error: string) => ({
    type: AUTH_ACTIONS.LOGIN_FAILURE,
    payload: error,
});

export const registerRequest = (credentials: RegisterCredentials) => ({
    type: AUTH_ACTIONS.REGISTER_REQUEST,
    payload: credentials,
});

export const registerSuccess = (response: AuthResponse) => ({
    type: AUTH_ACTIONS.REGISTER_SUCCESS,
    payload: response,
});

export const registerFailure = (error: string) => ({
    type: AUTH_ACTIONS.REGISTER_FAILURE,
    payload: error,
});

export const logout = () => ({
    type: AUTH_ACTIONS.LOGOUT,
});

export const clearError = () => ({
    type: AUTH_ACTIONS.CLEAR_ERROR,
});

export const setLoading = (isLoading: boolean) => ({
    type: AUTH_ACTIONS.SET_LOADING,
    payload: isLoading,
});

export const restoreSession = (user: User, token: string) => ({
    type: AUTH_ACTIONS.RESTORE_SESSION,
    payload: { user, token },
});

// Thunk Actions
export const login = (credentials: LoginCredentials) => {
    return async (dispatch: any) => {
        dispatch(loginRequest(credentials));
        dispatch(setLoading(true));

        try {
            const response = await fetch('http://localhost:3001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.success) {
                // Store token in localStorage
                localStorage.setItem('budger_token', data.data.token);
                localStorage.setItem('budger_user', JSON.stringify(data.data.user));
                
                dispatch(loginSuccess(data));
            } else {
                dispatch(loginFailure(data.error || 'Login failed'));
            }
        } catch (error) {
            dispatch(loginFailure('Network error. Please try again.'));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const register = (credentials: RegisterCredentials) => {
    return async (dispatch: any) => {
        dispatch(registerRequest(credentials));
        dispatch(setLoading(true));

        try {
            const response = await fetch('http://localhost:3001/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.success) {
                // Store token in localStorage
                localStorage.setItem('budger_token', data.data.token);
                localStorage.setItem('budger_user', JSON.stringify(data.data.user));
                
                dispatch(registerSuccess(data));
            } else {
                dispatch(registerFailure(data.error || 'Registration failed'));
            }
        } catch (error) {
            dispatch(registerFailure('Network error. Please try again.'));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const logoutUser = () => {
    return (dispatch: any) => {
        // Clear localStorage
        localStorage.removeItem('budger_token');
        localStorage.removeItem('budger_user');
        
        dispatch(logout());
    };
};

export const restoreUserSession = () => {
    return (dispatch: any) => {
        const token = localStorage.getItem('budger_token');
        const userStr = localStorage.getItem('budger_user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                dispatch(restoreSession(user, token));
            } catch (error) {
                // Clear invalid data
                localStorage.removeItem('budger_token');
                localStorage.removeItem('budger_user');
            }
        }
    };
};
