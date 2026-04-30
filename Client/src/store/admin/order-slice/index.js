import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/adminOrder/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/admin/orders/get`,
      { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
    );
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/adminOrder/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/admin/orders/details/${id}`,
      { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
    );
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/adminOrder/updateOrderStatus",
  async ({ id, orderStatus, paymentStatus, amountPaid }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/admin/orders/update/${id}`,
      { orderStatus, paymentStatus, amountPaid },
      { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
    );
    return response.data;
  }
);

export const deleteOrderForAdmin = createAsyncThunk(
  "/adminOrder/deleteOrderForAdmin",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/admin/orders/delete/${id}`,
      { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
    );
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
