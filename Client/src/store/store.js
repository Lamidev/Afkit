import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

import adminProductsSlice from "./admin/products-slice";
import adminVerifyUser from "./admin/verified-users-slice";

import shopProductSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopSearchSlice from "./shop/search-slice";


import commonFeatureSlice from "./common-slice/index";

const store = configureStore({
  reducer: {
    // Define your reducers here
    auth: authReducer,

    adminProducts: adminProductsSlice,
    verifiedUsers: adminVerifyUser,

    shopProducts: shopProductSlice,
    shopCart: shopCartSlice,
  
    shopSearch: shopSearchSlice,
  

    commonFeature: commonFeatureSlice,
  },
 
});

export default store;
