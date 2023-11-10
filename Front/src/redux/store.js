import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./feature/productsSlice";
import cartSlice from "./feature/cartSlice";
import chatSlice from "./feature/chatSlice";
import searchSlice from "./feature/searchSlice";
import unreadMsgSlice from "./feature/unreadMsgSlice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartSlice,
    chat: chatSlice,
    searchText: searchSlice,
    unreadMsg : unreadMsgSlice,
  },
});

export default store;
