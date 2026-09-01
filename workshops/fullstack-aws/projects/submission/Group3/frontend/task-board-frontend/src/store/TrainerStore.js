import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "Test Trainer",
};

const TrainerSlice = createSlice({
  name: "trainer",

  initialState,

  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { setName } = TrainerSlice.actions;

export default TrainerSlice.reducer;