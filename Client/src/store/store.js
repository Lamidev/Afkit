import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

import adminProductsSlice from "./admin/products-slice";
import adminUserStats from "./admin/user-stats-slice";

import shopProductSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopSearchSlice from "./shop/search-slice";


import commonFeatureSlice from "./common-slice/index";
import shareTrackingSlice from './common-slice/share-slice/index';

const store = configureStore({
  reducer: {
    // Define your reducers here
    auth: authReducer,

    adminProducts: adminProductsSlice,
    userStats: adminUserStats,

    shopProducts: shopProductSlice,
    shopCart: shopCartSlice,
  
    shopSearch: shopSearchSlice,
  

    commonFeature: commonFeatureSlice,
    shareTracking: shareTrackingSlice,
  },
 
});

export default store;
