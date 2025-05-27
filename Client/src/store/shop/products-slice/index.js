// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   productList: [],
//   productDetails: null,
//   relatedProducts: [],

// };

// export const fetchAllFilteredProducts = createAsyncThunk(
//   "/products/fetchAllProducts",
//   async ({ filterParams, sortParams, priceRange }) => {
//     const query = new URLSearchParams({
//       ...filterParams,
//       sortBy: sortParams,
//     });

//     // Add price range to query if exists
//     if (priceRange) {
//       query.append('minPrice', priceRange.min);
//       query.append('maxPrice', priceRange.max);
//     }

//     const result = await axios.get(
//       `${import.meta.env.VITE_API_BASE_URL}/shop/products/get?${query}`
//     );

//     return result?.data;
//   }
// );


// export const fetchProductDetails = createAsyncThunk(
//   "/products/fetchProductDetails",
//   async (id) => {
//     const result = await axios.get(
//       `${import.meta.env.VITE_API_BASE_URL}/shop/products/get/${id}`
//     );

//     return result?.data;
//   }
// );export const fetchProductsByBrand = createAsyncThunk(
//   "/products/fetchProductsByBrand",
//   async (brand) => {
//     const result = await axios.get(
//       `${import.meta.env.VITE_API_BASE_URL}/shop/products/brand?brand=${brand}`
//     );
//     return result?.data;
//   }
// );




// const shoppingProductSlice = createSlice({

//   name: "shoppingProducts",
//   initialState,
//   reducers: {
//     setProductDetails: (state) => {
//       state.productDetails = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllFilteredProducts.pending, (state, action) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.productList = action.payload.data;
//       })
//       .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
//         state.isLoading = false;
//         state.productList = [];
//       })
//       .addCase(fetchProductDetails.pending, (state, action) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchProductDetails.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.productDetails = action.payload.data;
//       })
//       .addCase(fetchProductDetails.rejected, (state, action) => {
//         state.isLoading = false;
//         state.productDetails = null;
//       })
//       .addCase(fetchProductsByBrand.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.relatedProducts = action.payload.data;
//       })
//       .addCase(fetchProductsByBrand.rejected, (state) => {
//         state.isLoading = false;
//         state.relatedProducts = [];
//       });
      
//   },

// });

// export const { setProductDetails } = shoppingProductSlice.actions;

// export default shoppingProductSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  relatedProducts: [],
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, priceRange }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    if (priceRange) {
      query.append('minPrice', priceRange.min);
      query.append('maxPrice', priceRange.max);
    }

    const result = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/shop/products/get?${query}`
    );

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/shop/products/get/${id}`
    );

    return result?.data;
  }
);

// export const fetchProductsByBrand = createAsyncThunk(
//   "/products/fetchProductsByBrand",
//   async (brand) => {
//     const result = await axios.get(
//       `${import.meta.env.VITE_API_BASE_URL}/shop/products/brand?brand=${brand}`
//     );
//     return result?.data;
//   }
// );

export const fetchProductsByBrand = createAsyncThunk(
  "/products/fetchProductsByBrand",
  async (brand, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/shop/products/brand?brand=${encodeURIComponent(brand)}`
      );
      return result?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    clearRelatedProducts: (state) => {
      state.relatedProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.relatedProducts = action.payload.data;
      })
      .addCase(fetchProductsByBrand.rejected, (state) => {
        state.isLoading = false;
        state.relatedProducts = [];
      });
  },
});

export const { setProductDetails, clearRelatedProducts } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;