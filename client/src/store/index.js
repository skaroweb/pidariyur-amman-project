import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./toggleSlice"; // Import the name reducer or any other reducers you have

const store = configureStore({
  reducer: {
    toggle: toggleReducer,
    // Add other reducers if needed
  },
});

export default store;
