import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
  currentKeyword: "", // Add this to track the current search term
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/shop/search/${keyword}`
      );
      return { 
        data: response.data.data,
        keyword // Return the keyword along with the data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.currentKeyword = "";
      state.isLoading = false;
    },
    setSearchKeyword: (state, action) => {
      state.currentKeyword = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
        state.currentKeyword = action.payload.keyword;
      })
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export const { resetSearchResults, setSearchKeyword } = searchSlice.actions;

export default searchSlice.reducer;