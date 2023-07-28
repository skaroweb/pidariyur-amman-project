import { configureStore } from "@reduxjs/toolkit";

import donationReducer from "./donationSlice";

const store = configureStore({
  reducer: {
    donation: donationReducer, // Add more reducers here if needed

    // Add other reducers if needed
  },
});

export default store;
