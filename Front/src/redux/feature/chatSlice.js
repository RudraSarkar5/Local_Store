import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../Server/variable";

const initialState = {
  data: [],
  unReadMsgNumber: 0,
  status: "idle",
  error: null,
};

export const fetchFriends = createAsyncThunk(
  "chat/fetchfriends",
  async (userId) => {
    console.log("enter");
    console.log(userId);
    const response = await fetch(`${baseUrl}/chat/getAllFriendMsg/${userId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch friends");
    }
    const data = await response.json();
    console.log(data);
    return data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
        const totalUnreadMsg = action.payload.filter((item) => !item.read); // Filter unread messages
        state.unReadMsgNumber = totalUnreadMsg.length; // Assign to state
      })

      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default chatSlice.reducer;
export const { setStatus } = chatSlice.actions;
