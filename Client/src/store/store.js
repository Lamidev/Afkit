import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

import adminProductsSlice from "./admin/products-slice";
import adminUserStats from "./admin/user-stats-slice";
import adminOrderSlice from "./admin/order-slice";

import shopProductSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";


import commonFeatureSlice from "./common-slice/index";
import shareTrackingSlice from './common-slice/share-slice/index';
import notificationSlice from "./common-slice/notification-slice";

const store = configureStore({
  reducer: {
    // Defined my reducers here
    auth: authReducer,

    adminProducts: adminProductsSlice,
    userStats: adminUserStats,
    adminOrder: adminOrderSlice,

    shopProducts: shopProductSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,

    commonFeature: commonFeatureSlice,
    shareTracking: shareTrackingSlice,
    notifications: notificationSlice,
  },
 
});

export default store;
