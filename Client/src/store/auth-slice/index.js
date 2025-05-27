import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.withCredentials = true;

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  message: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error registering user");
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verify-email",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-email`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error verifying email");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, formData);
      
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token); // Store token
        dispatch(setUser(response.data.user)); // Set user
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error logging in");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`);
      return {};
    } catch (error) {
      return rejectWithValue("Error logging out");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.log("Error response:", error.response?.data); // Debug log - error response
      return rejectWithValue(error.response?.data?.message || "Error sending reset email");
    }
  }
);




export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password/${token}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error resetting password");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check-auth",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/check-auth`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setUser(response.data.user));
      return response.data;
    } catch (error) {
      console.error("Check Auth Error:", error);
      return rejectWithValue(error.message || "Failed to check auth");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, isVerified: true }; // Ensure user is marked as verified
      })
      
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        sessionStorage.setItem("token", action.payload.token);
      })
      
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        sessionStorage.removeItem("token"); 
        
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message; 
        
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      
      })
      
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
