// authStorage.js
const AUTH_STORAGE_KEYS = {
    USER: 'user'
};

let inMemoryAccessToken = null;

export const authStorage = {
    getUser: () => {
        try {
            const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Failed to get user from storage:', error);
            return null;
        }
    },

    setUser: (user) => {
        try {
            localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
        } catch (error) {
            console.error('Failed to save user to storage:', error);
        }
    },

    getAccessToken: () => {
        return inMemoryAccessToken;
    },

    setAccessToken: (token) => {
        inMemoryAccessToken = token;
    },

    clearAuth: () => {
        try {
            localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
            inMemoryAccessToken = null;
        } catch (error) {
            console.error('Failed to clear auth storage:', error);
        }
    }
};