import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../Server/variable";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const addToCart = createAsyncThunk(
  "products/addCart",
  async ({ product, userId }) => {
    const response = await fetch(`${baseUrl}/products/addCart`, {
      method: "POST",
      body: JSON.stringify({ product, userId }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const result = await response.json();
    console.log(result);
    return result;
  }
);

export const removeCart = createAsyncThunk(
  "products/removeCart",
  async (id) => {
    const response = await fetch(`${baseUrl}/products/remove/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }
);

export const fetchCart = createAsyncThunk(
  "products/fetchCart",
  async (userId) => {
    const response = await fetch(`${baseUrl}/getCart/${userId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();

    return data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "success";
        const existingItem = state.data.find(
          (item) => item._id === action.payload._id
        );
        if (existingItem) {
          existingItem.qty += 1;
        } else {
          state.data.push(action.payload);
        }
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
export const { setStatus } = cartSlice.actions;
