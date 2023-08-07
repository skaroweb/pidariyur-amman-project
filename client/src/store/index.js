import { configureStore } from "@reduxjs/toolkit";

import donationReducer from "./donationSlice";
import memberReducer from "./memberSlice";

const store = configureStore({
  reducer: {
    donation: donationReducer, // Add more reducers here if needed
    member: memberReducer,

    // Add other reducers if needed
  },
});

export default store;
