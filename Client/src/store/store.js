import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

import adminProductsSlice from "./admin/products-slice";
import adminVerifyUser from "./admin/verified-users-slice"

import shopProductSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
// import shopAddressSlice from "./shop/address-slice";
// import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
// import shopReviewSlice from "./shop/review-slice";

import commonFeatureSlice from "./common-slice/index";


const store = configureStore({
  reducer: {
    // Define your reducers here
    auth: authReducer,

    adminProducts: adminProductsSlice,
      verifiedUsers: adminVerifyUser,

    shopProducts: shopProductSlice,
    shopCart: shopCartSlice,
    // shopAddress: shopAddressSlice,
    // shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    // shopReview: shopReviewSlice,

    commonFeature: commonFeatureSlice,
  
  },
  // Other store setup...
});

export default store;
