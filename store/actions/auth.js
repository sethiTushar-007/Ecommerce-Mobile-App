import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE = 'AUTHENTICATE';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId, token});
    }
}

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCttT0OsLeutLe5UQH38lPA-OyCMhwLiqk',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        });
        const resData = await response.json();
        if (!response.ok) {
            const errorId = resData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email already exists!';
            }
            throw new Error(message);
        }
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
        saveDataToStorage(resData.idToken, resData.localId, resData.expiresIn);
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCttT0OsLeutLe5UQH38lPA-OyCMhwLiqk',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        });
        const resData = await response.json();
        if (!response.ok) {
            const errorId = resData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!';
            }
            throw new Error(message);
        }
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
        saveDataToStorage(resData.idToken, resData.localId, resData.expiresIn);
    }
}

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {type: LOGOUT}
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    }
}

const saveDataToStorage = (token, userId, expiresIn) => {
    const expiryDate = new Date(new Date().getTime() + parseInt(expiresIn) * 1000).toISOString();
    AsyncStorage.setItem(
        'userData', 
        JSON.stringify({
            token,
            userId,
            expiryDate
        })
    );
}