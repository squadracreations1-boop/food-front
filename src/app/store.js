import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "../slices/productsSlice";
import productReducer from '../slices/productSlice';
import authReducer from '../slices/authSlice';
import cartReducer from '../slices/cartSlice';
import orderReducer from '../slices/orderSlice';
import userReducer from '../slices/userSlice';
import checkoutReducer from '../slices/checkoutSlice';
import wishlistReducer from '../slices/wishlistSlice';

const reducer = combineReducers({
  products: productsReducer,
  product: productReducer,
  auth: authReducer,
  cart: cartReducer,
  order: orderReducer,
  user: userReducer,
  checkout: checkoutReducer,
  wishlist: wishlistReducer
})

const store = configureStore({
  reducer,
})

export default store;