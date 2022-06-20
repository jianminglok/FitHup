import { configureStore } from "@reduxjs/toolkit";
import nameReducer from "./slices/nameSlice";

export const store = configureStore({
    reducer: {
        name: nameReducer
    },
});