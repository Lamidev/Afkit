

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   productList: [],
//   imageUploadLoading: false,
// };

// // Multiple image upload
// export const uploadProductImages = createAsyncThunk(
//   "products/uploadImages",
//   async (imageFiles, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       imageFiles.forEach(file => {
//         formData.append('my_files', file);
//       });
      
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/upload-images`,
//         formData
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const addNewProduct = createAsyncThunk(
//   "products/addnewproduct",
//   async (productData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/add`,
//         productData,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const fetchAllProducts = createAsyncThunk(
//   "products/fetchAllProducts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/get`
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const editProduct = createAsyncThunk(
//   "products/editProduct",
//   async ({ id, productData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/edit/${id}`,
//         productData,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const deleteProduct = createAsyncThunk(
//   "products/deleteProduct",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.delete(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/delete/${id}`
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const AdminProductsSlice = createSlice({
//   name: "adminProducts",
//   initialState,
//   reducers: {
//     resetProductState: () => initialState,
//   },
//   extraReducers: (builder) => {
//     builder
//       // Image Upload
//       .addCase(uploadProductImages.pending, (state) => {
//         state.imageUploadLoading = true;
//       })
//       .addCase(uploadProductImages.fulfilled, (state) => {
//         state.imageUploadLoading = false;
//       })
//       .addCase(uploadProductImages.rejected, (state) => {
//         state.imageUploadLoading = false;
//       })
      
//       // Fetch Products
//       .addCase(fetchAllProducts.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchAllProducts.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.productList = action.payload.data || [];
//       })
//       .addCase(fetchAllProducts.rejected, (state) => {
//         state.isLoading = false;
//       })
      
//       // Add Product
//       .addCase(addNewProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(addNewProduct.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(addNewProduct.rejected, (state) => {
//         state.isLoading = false;
//       })
      
//       // Edit Product
//       .addCase(editProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(editProduct.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(editProduct.rejected, (state) => {
//         state.isLoading = false;
//       })
      
//       // Delete Product
//       .addCase(deleteProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(deleteProduct.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(deleteProduct.rejected, (state) => {
//         state.isLoading = false;
//       });
//   },
// });

// export const { resetProductState } = AdminProductsSlice.actions;
// export default AdminProductsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  imageUploadLoading: false,
  filterParams: {},
  sortParams: null,
  priceRange: null,
  isFilterLoading: false,
};

export const uploadProductImages = createAsyncThunk(
  "products/uploadImages",
  async (imageFiles, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('my_files', file);
      });
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/upload-images`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  "products/addnewproduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/add`,
        productData,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams = {}, sortParams = null, priceRange = null } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        ...(Object.keys(filterParams).length > 0 && { filterParams: JSON.stringify(filterParams) }),
        ...(sortParams && { sortParams }),
      });

      if (priceRange) {
        query.append('priceRange[min]', priceRange.min);
        query.append('priceRange[max]', priceRange.max);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/get?${query}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/edit/${id}`,
        productData,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/delete/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    resetProductState: () => initialState,
    setFilterParams: (state, action) => {
      state.filterParams = action.payload;
    },
    setSortParams: (state, action) => {
      state.sortParams = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    clearFilters: (state) => {
      state.filterParams = {};
      state.sortParams = null;
      state.priceRange = null;
    },
    setIsFilterLoading: (state, action) => {
      state.isFilterLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProductImages.pending, (state) => {
        state.imageUploadLoading = true;
      })
      .addCase(uploadProductImages.fulfilled, (state) => {
        state.imageUploadLoading = false;
      })
      .addCase(uploadProductImages.rejected, (state) => {
        state.imageUploadLoading = false;
      })
      
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.isFilterLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFilterLoading = false;
        state.productList = action.payload.data || [];
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.isFilterLoading = false;
      })
      
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewProduct.rejected, (state) => {
        state.isLoading = false;
      })
      
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editProduct.rejected, (state) => {
        state.isLoading = false;
      })
      
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { 
  resetProductState, 
  setFilterParams, 
  setSortParams, 
  setPriceRange,
  clearFilters,
  setIsFilterLoading
} = AdminProductsSlice.actions;
export default AdminProductsSlice.reducer;