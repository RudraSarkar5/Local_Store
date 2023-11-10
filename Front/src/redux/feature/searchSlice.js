import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
};

const serachSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.text = action.payload;
    },
  },
});

export const { setSearch } = serachSlice.actions;
export default serachSlice.reducer;
