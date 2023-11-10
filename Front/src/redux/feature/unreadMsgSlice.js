import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../Server/variable";
const initialState = {
    unReadMsg : 0,
    
  };

  export const fetchUnreadMsgNumber = createAsyncThunk(
    "chat/getUnreadMsgNumber",
    async (userId) => {
      const response = await fetch(`${baseUrl}/chat/getUnreadMsgNumber/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }
      const data = await response.json();
      return data.value;
    }
  );

  

  const UnreadSlice = createSlice({
    name: "unreadMsg",
    initialState,
    reducers: {
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUnreadMsgNumber.fulfilled, (state, action) => {
          state.unReadMsg = action.payload;
          
        })
        .addCase(fetchUnreadMsgNumber.rejected, (state, action) => {
         
          
        })
        
        
    },
  });
  
  export default UnreadSlice.reducer;
  export const { setStatuss } = UnreadSlice.actions;