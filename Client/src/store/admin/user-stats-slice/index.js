

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchUserStats = createAsyncThunk(
//   "userStats/fetchUserStats",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/user-stats`,
//         { withCredentials: true }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch user statistics"
//       );
//     }
//   }
// );

// // NEW THUNK: Fetch a list of verified users
// export const fetchVerifiedUsersList = createAsyncThunk(
//   "userStats/fetchVerifiedUsersList",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/user-stats/verified-list`,
//         { withCredentials: true }
//       );
//       return response.data.verifiedUsers; // Return the array of users
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch verified users list"
//       );
//     }
//   }
// );

// const userStatsSlice = createSlice({
//   name: "userStats",
//   initialState: {
//     stats: {
//       verifiedUsers: 0,
//       unverifiedUsers: 0,
//       activeUsers: 0,
//       totalUsers: 0,
//       linkShares: {
//         dailyWhatsAppShares: 0,
//         dailyInstagramShares: 0,
//         dailyCheckoutShares: 0,
//         totalLinksShared: 0,
//         dailyAuthenticatedShares: 0,
//         dailyGuestShares: 0,
//         totalAuthenticatedShares: 0,
//         totalGuestShares: 0,
//       },
//     },
//     verifiedUsersList: [], // NEW: State for verified user list
//     isLoading: false,
//     isUsersListLoading: false, // NEW: Loading state for user list
//     error: null,
//     usersListError: null, // NEW: Error state for user list
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserStats.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserStats.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.stats = action.payload.stats;
//       })
//       .addCase(fetchUserStats.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//       // NEW: Handlers for fetchVerifiedUsersList
//       .addCase(fetchVerifiedUsersList.pending, (state) => {
//         state.isUsersListLoading = true;
//         state.usersListError = null;
//       })
//       .addCase(fetchVerifiedUsersList.fulfilled, (state, action) => {
//         state.isUsersListLoading = false;
//         state.verifiedUsersList = action.payload;
//       })
//       .addCase(fetchVerifiedUsersList.rejected, (state, action) => {
//         state.isUsersListLoading = false;
//         state.usersListError = action.payload;
//       });
//   },
// });

// export default userStatsSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserStats = createAsyncThunk(
  "userStats/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/user-stats`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user statistics"
      );
    }
  }
);

export const fetchVerifiedUsersList = createAsyncThunk(
  "userStats/fetchVerifiedUsersList",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/user-stats/verified-list`,
        { 
          params: { page, limit },
          withCredentials: true 
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch verified users list"
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
      linkShares: {
        dailyWhatsAppShares: 0,
        dailyInstagramShares: 0,
        dailyCheckoutShares: 0,
        totalLinksShared: 0,
        dailyAuthenticatedShares: 0,
        dailyGuestShares: 0,
        totalAuthenticatedShares: 0,
        totalGuestShares: 0,
      },
    },
    verifiedUsersList: [],
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    isUsersListLoading: false,
    error: null,
    usersListError: null,
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
        state.totalUsers = action.payload.stats.verifiedUsers;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchVerifiedUsersList.pending, (state) => {
        state.isUsersListLoading = true;
        state.usersListError = null;
      })
      .addCase(fetchVerifiedUsersList.fulfilled, (state, action) => {
        state.isUsersListLoading = false;
        state.verifiedUsersList = action.payload.verifiedUsers;
        state.totalUsers = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchVerifiedUsersList.rejected, (state, action) => {
        state.isUsersListLoading = false;
        state.usersListError = action.payload;
      });
  },
});

export default userStatsSlice.reducer;