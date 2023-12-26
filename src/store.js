// React
import { configureStore } from "@reduxjs/toolkit";

// Slice
import dataReducer from "./slice/dataSlice";
import threeReducer from "./slice/threeSlice"

// Store
export const store = configureStore({
    reducer: {
        data: dataReducer,
        three: threeReducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        })
    }
})