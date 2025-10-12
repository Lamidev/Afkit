
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   productList: [],
//   imageUploadLoading: false,
// };

// export const uploadProductImages = createAsyncThunk(
//   "products/uploadImages",
//   async (imageFiles, { rejectWithValue }) => {
//     try {
//       console.log("Starting upload of", imageFiles.length, "images");
      
//       const formData = new FormData();
//       imageFiles.forEach((file, index) => {
//         formData.append('my_files', file);
//         console.log(`Appending file ${index + 1}:`, file.name, file.type, file.size);
//       });

//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/upload-images`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           timeout: 30000, // 30 second timeout
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             console.log(`Upload Progress: ${progress}%`);
//           },
//         }
//       );
      
//       console.log("Upload response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Upload error details:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         config: error.config
//       });
      
//       if (error.code === 'ECONNABORTED') {
//         return rejectWithValue({ message: "Upload timeout. Please try again." });
//       }
      
//       if (error.response?.status === 413) {
//         return rejectWithValue({ message: "File too large. Maximum size is 5MB per image." });
//       }
      
//       return rejectWithValue(
//         error.response?.data || { message: error.message || "Network error occurred" }
//       );
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
//         { 
//           headers: { "Content-Type": "application/json" },
//           timeout: 30000
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// export const fetchAllProducts = createAsyncThunk(
//   "products/fetchAllProducts",
//   async ({ filterParams = {}, sortParams = "latest-arrival", priceRange = {} } = {}, { rejectWithValue }) => {
//     try {
//       const queryParams = new URLSearchParams({
//         sortBy: sortParams,
//       });

//       Object.entries(filterParams).forEach(([key, value]) => {
//         if (Array.isArray(value) && value.length > 0) {
//           queryParams.append(key, value.join(','));
//         } else if (value && !Array.isArray(value)) {
//           queryParams.append(key, value);
//         }
//       });

//       if (priceRange.min !== undefined) {
//         queryParams.append("minPrice", priceRange.min);
//       }
//       if (priceRange.max !== undefined) {
//         queryParams.append("maxPrice", priceRange.max);
//       }

//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/get?${queryParams}`,
//         { timeout: 30000 }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
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
//         { 
//           headers: { "Content-Type": "application/json" },
//           timeout: 30000
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// export const deleteProduct = createAsyncThunk(
//   "products/deleteProduct",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.delete(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/delete/${id}`,
//         { timeout: 30000 }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// export const hideProduct = createAsyncThunk(
//   "products/hideProduct",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/hide/${id}`,
//         { timeout: 30000 }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// export const unhideProduct = createAsyncThunk(
//   "products/unhideProduct",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(
//         `${import.meta.env.VITE_API_BASE_URL}/admin/products/unhide/${id}`,
//         { timeout: 30000 }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// const AdminProductsSlice = createSlice({
//   name: "adminProducts",
//   initialState,
//   reducers: {
//     resetProductState: () => initialState,
//     clearImageUploadError: (state) => {
//       state.imageUploadLoading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(uploadProductImages.pending, (state) => {
//         state.imageUploadLoading = true;
//       })
//       .addCase(uploadProductImages.fulfilled, (state) => {
//         state.imageUploadLoading = false;
//       })
//       .addCase(uploadProductImages.rejected, (state) => {
//         state.imageUploadLoading = false;
//       })
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
//       .addCase(addNewProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(addNewProduct.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(addNewProduct.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(editProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(editProduct.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(editProduct.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(deleteProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(deleteProduct.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(deleteProduct.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(hideProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(hideProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         if (action.payload.success) {
//           state.productList = state.productList.map(product => 
//             product._id === action.payload.data._id ? action.payload.data : product
//           );
//         }
//       })
//       .addCase(hideProduct.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(unhideProduct.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(unhideProduct.fulfilled, (state, action) => {
//         state.isLoading = false;
//         if (action.payload.success) {
//           state.productList = state.productList.map(product => 
//             product._id === action.payload.data._id ? action.payload.data : product
//           );
//         }
//       })
//       .addCase(unhideProduct.rejected, (state) => {
//         state.isLoading = false;
//       });
//   },
// });

// export const { resetProductState, clearImageUploadError } = AdminProductsSlice.actions;
// export default AdminProductsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  imageUploadLoading: false,
};

export const uploadProductImages = createAsyncThunk(
  "products/uploadImages",
  async (imageFiles, { rejectWithValue }) => {
    try {
      console.log("Starting upload of", imageFiles.length, "images");
      
      const formData = new FormData();
      imageFiles.forEach((file, index) => {
        formData.append('my_files', file);
        console.log(`Appending file ${index + 1}:`, file.name, file.type, file.size);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/upload-images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${progress}%`);
          },
        }
      );
      
      console.log("Upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue({ message: "Upload timeout. Please try again." });
      }
      
      if (error.response?.status === 413) {
        return rejectWithValue({ message: "File too large. Maximum size is 5MB per image." });
      }
      
      return rejectWithValue(
        error.response?.data || { message: error.message || "Network error occurred" }
      );
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
        { 
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams = {}, sortParams = "latest-arrival", priceRange = {} } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        sortBy: sortParams,
      });

      Object.entries(filterParams).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.append(key, value.join(','));
        } else if (value && !Array.isArray(value)) {
          queryParams.append(key, value);
        }
      });

      if (priceRange.min !== undefined) {
        queryParams.append("minPrice", priceRange.min);
      }
      if (priceRange.max !== undefined) {
        queryParams.append("maxPrice", priceRange.max);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/get?${queryParams}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
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
        { 
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
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
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const hideProduct = createAsyncThunk(
  "products/hideProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/hide/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const unhideProduct = createAsyncThunk(
  "products/unhideProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/unhide/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    resetProductState: () => initialState,
    clearImageUploadError: (state) => {
      state.imageUploadLoading = false;
    },
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
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
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
      })
      .addCase(hideProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hideProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.productList = state.productList.map(product => 
            product._id === action.payload.data._id ? action.payload.data : product
          );
        }
      })
      .addCase(hideProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(unhideProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unhideProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.productList = state.productList.map(product => 
            product._id === action.payload.data._id ? action.payload.data : product
          );
        }
      })
      .addCase(unhideProduct.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetProductState, clearImageUploadError } = AdminProductsSlice.actions;
export default AdminProductsSlice.reducer;