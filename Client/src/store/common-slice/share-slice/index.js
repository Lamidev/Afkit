import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Assume your base API URL is defined somewhere, e.g., in a config file or .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const recordLinkShare = createAsyncThunk(
  "shareTracking/recordLinkShare", // Unique action type for this slice
  async ({ productId, productTitle, shareDestination, sourcePage, sessionId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Assuming JWT token for authenticated users
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(`${API_BASE_URL}/shares/record`, { // Matches your backend route
        productId,
        productTitle,
        shareDestination,
        sourcePage,
        sessionId,
      }, config);
      return response.data;
    } catch (error) {
      console.error("Error recording link share:", error);
      // Return a user-friendly message, not the full error object
      return rejectWithValue(error.response.data?.message || "Failed to record share event.");
    }
  }
);

const shareTrackingSlice = createSlice({
  name: "shareTracking",
  initialState: {
    isRecording: false,
    error: null,
    lastRecordedShare: null, // Optional: store the last successful share info
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(recordLinkShare.pending, (state) => {
        state.isRecording = true;
        state.error = null;
      })
      .addCase(recordLinkShare.fulfilled, (state, action) => {
        state.isRecording = false;
        state.lastRecordedShare = action.payload; // Store success data
        console.log("Link share recorded successfully:", action.payload.message);
      })
      .addCase(recordLinkShare.rejected, (state, action) => {
        state.isRecording = false;
        state.error = action.payload; // Store the error message
        console.error("Failed to record link share:", action.payload);
      });
  },
});

export default shareTrackingSlice.reducer;