import { configureStore } from "@reduxjs/toolkit";
import titleReducer from "./titleSlice"; // Import the name reducer or any other reducers you have
import donationReducer from "./donationSlice";

const store = configureStore({
  reducer: {
    title: titleReducer,
    donation: donationReducer, // Add more reducers here if needed

    // Add other reducers if needed
  },
});

export default store;
