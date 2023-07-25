import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const serverURL = process.env.REACT_APP_SERVER_URL;
// Replace 'https://example-api.com/title' with your actual GET/PUT API endpoint URL
const API_URL = `${serverURL}/api/title`;

export const fetchTitle = createAsyncThunk("title/fetchTitle", async () => {
  const response = await axios.get(API_URL);
  return response.data.title;
});

export const updateTitle = createAsyncThunk(
  "title/updateTitle",
  async (newTitle) => {
    const response = await axios.put(API_URL, { title: newTitle });
    return response.data.title;
  }
);

const initialState = {
  title: "",
  status: "idle",
  error: null,
};

const titleSlice = createSlice({
  name: "title",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTitle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTitle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload;
      })
      .addCase(fetchTitle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateTitle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTitle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.title = action.payload;
      })
      .addCase(updateTitle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default titleSlice.reducer;
