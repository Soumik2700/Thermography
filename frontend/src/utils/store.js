import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// Get saved token/user from localStorage
const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

const preloadedState = {
    user: {
        token: savedToken || null,
        user: savedUser ? JSON.parse(savedUser) : null,
    },
};

const store = configureStore({
    reducer: {
        user: userReducer,
    },
    preloadedState,
});

export default store;
