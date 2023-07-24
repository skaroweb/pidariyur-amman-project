import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "toggle",
  initialState: false,
  reducers: {
    toggleValue: (state) => !state,
  },
});

export const { toggleValue } = toggleSlice.actions;

export default toggleSlice.reducer;
