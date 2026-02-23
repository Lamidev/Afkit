import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  addressList: [],
  isLoading: false,
};

export const addNewAddress = createAsyncThunk(
  "/address/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/shop/address/add`,
      formData
    );

    return response.data;
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/address/fetchAllAddresses",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/shop/address/get/${userId}`
    );

    return response.data;
  }
);

export const editAddress = createAsyncThunk(
  "/address/editAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return response.data;
  }
);

export const fetchLastUsedAddress = createAsyncThunk(
  "/address/fetchLastUsedAddress",
  async ({ userId, type }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/shop/address/last-used/${userId}?type=${type}`
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/address/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        // Optimistically remove the address from the list if the server succeeded
        const deletedId = action.meta.arg.addressId;
        state.addressList = state.addressList.filter(item => item._id !== deletedId);
      });
  },
});

export default addressSlice.reducer;
