import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "Test Trainer",
  tab: "cohorts",
};

const TrainerSlice = createSlice({
  name: "trainer",

  initialState,

  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setTab: (state, action) => {
      state.tab = action.payload;
    },
  },
});

export const { setName, setTab } = TrainerSlice.actions;

export default TrainerSlice.reducer;
