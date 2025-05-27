// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   featureImageList: [],
// };

// export const getFeatureImages = createAsyncThunk(
//   "/common/getFeatureImages",
//   async () => {
//     const response = await axios.get(
//       `${import.meta.env.VITE_API_BASE_URL}/common/features/get`
//     );

//     return response.data;
//   }
// );

// export const addFeatureImage = createAsyncThunk(
//   "/common/addFeatureImage",
//   async (image) => {
//     const response = await axios.post(
//       `${import.meta.env.VITE_API_BASE_URL}/common/features/add`,
//       { image }
//     );

//     return response.data;
//   }
// );

// export const deleteFeatureImage = createAsyncThunk(
//   "/common/deleteFeatureImage",
//   async (id) => {
//     const response = await axios.delete(
//       `${import.meta.env.VITE_API_BASE_URL}/common/features/delete/${id}`
//     );
//     return { id }; // Return the deleted image's id to remove from the list in state
//   }
// );

// const commonSlice = createSlice({
//   name: "commonSlice",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getFeatureImages.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getFeatureImages.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.featureImageList = action.payload.data;
//       })
//       .addCase(getFeatureImages.rejected, (state) => {
//         state.isLoading = false;
//         state.featureImageList = [];
//         console.error("Failed to fetch feature images:", action.error.message);
//       })
//       .addCase(deleteFeatureImage.fulfilled, (state, action) => {
//         state.featureImageList = state.featureImageList.filter(
//           (image) => image._id !== action.payload.id
//         );
//       });
//   },
// });

// export default commonSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "/common/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/common/features/get`
    );
    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/common/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/common/features/add`,
      { image }
    );
    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/common/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/common/features/delete/${id}`
    );
    return { id };
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.featureImageList = [];
        console.error("Failed to fetch feature images:", action.error.message);
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.featureImageList = [...state.featureImageList, action.payload.data];
        }
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.featureImageList = state.featureImageList.filter(
          (image) => image._id !== action.payload.id
        );
      });
  },
});

export default commonSlice.reducer;