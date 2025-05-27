
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, sessionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/shop/cart/add`,
        { userId, productId, quantity, sessionId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async ({ userId, sessionId }, { rejectWithValue }) => {
    try {
      const params = {};
      if (userId) params.userId = userId;
      if (sessionId) params.sessionId = sessionId;

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/shop/cart/get`,
        { params }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update the updateCartQuantity thunk to handle sessionId
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity, sessionId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/shop/cart/update-cart`,
        {
          userId,
          productId,
          quantity,
          sessionId
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update mergeCarts to properly handle the response
export const mergeCarts = createAsyncThunk(
  "cart/mergeCarts",
  async ({ userId, sessionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/shop/cart/merge`,
        { userId, sessionId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId, sessionId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/shop/cart/delete`,
        { 
          data: {
            userId,
            productId,
            sessionId
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Add to cart failed:', action.payload);
      })

      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Fetch cart failed:', action.payload);
      })

      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Update failed:', action.payload);
      })

      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Delete failed:', action.payload);
      })

      .addCase(mergeCarts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mergeCarts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(mergeCarts.rejected, (state, action) => {
        state.isLoading = false;
        console.error('Merge failed:', action.payload);
      });
  },
});

export default shoppingCartSlice.reducer;
