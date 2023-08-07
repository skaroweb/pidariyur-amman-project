import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

// Fetch member data from the server
export const fetchMemberData = createAsyncThunk(
  "member/fetchMemberData",
  async () => {
    try {
      const response = await axios.get(`${serverURL}/api/member/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState: {
    isToggled: false,
    data: [],
  },
  reducers: {
    toggleValue: (state) => {
      state.isToggled = !state.isToggled;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberData.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(fetchMemberData.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchMemberData.rejected, (state) => {
        // Handle rejected state if needed
      });
  },
});

export const { toggleValue } = memberSlice.actions;

export default memberSlice.reducer;
