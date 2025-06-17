// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchVerifiedUserCount = createAsyncThunk(
//   "admin/fetchVerifiedUserCount",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/verified-users`
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch verified users count"
//       );
//     }
//   }
// );

// const adminSlice = createSlice({
//   name: "admin",
//   initialState: {
//     verifiedUserCount: 0,
//     isLoading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchVerifiedUserCount.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchVerifiedUserCount.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.verifiedUserCount = action.payload.verifiedUserCount;
//       })
//       .addCase(fetchVerifiedUserCount.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default adminSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserStats = createAsyncThunk(
  "userStats/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/user-stats`,
        { withCredentials: true } // This is crucial for sending cookies
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user statistics"
      );
    }
  }
);

const userStatsSlice = createSlice({
  name: "userStats",
  initialState: {
    stats: {
      verifiedUsers: 0,
      unverifiedUsers: 0,
      activeUsers: 0,
      totalUsers: 0,
    },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userStatsSlice.reducer;