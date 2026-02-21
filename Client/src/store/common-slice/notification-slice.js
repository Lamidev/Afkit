import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  notifications: [],
};

export const fetchNotifications = createAsyncThunk(
  "/notifications/fetch",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/common/notifications/get/${userId}`
    );
    return response.data;
  }
);

export const markAsRead = createAsyncThunk(
  "/notifications/markAsRead",
  async (notificationId) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/common/notifications/update/${notificationId}`
    );
    return response.data;
  }
);

export const removeNotification = createAsyncThunk(
  "/notifications/remove",
  async (notificationId) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/common/notifications/delete/${notificationId}`
    );
    return response.data;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.data;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.isLoading = false;
        state.notifications = [];
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(item => item._id === action.meta.arg);
        if (index !== -1) {
          state.notifications[index].isRead = true;
        }
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(item => item._id !== action.meta.arg);
      });
  },
});

export default notificationSlice.reducer;
