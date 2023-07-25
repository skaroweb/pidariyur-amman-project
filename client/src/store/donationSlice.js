import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

export const fetchDonationData = createAsyncThunk(
  "donation/fetchDonationData",
  async () => {
    try {
      const response = await axios.get(`${serverURL}/api/donate/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const donationSlice = createSlice({
  name: "donation",
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
      .addCase(fetchDonationData.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(fetchDonationData.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchDonationData.rejected, (state) => {
        // Handle rejected state if needed
      });
  },
});

export const { toggleValue } = donationSlice.actions;

export default donationSlice.reducer;
