import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "Test Trainee",
};

const TraineeSlice = createSlice({
  name: "trainee",

  initialState,

  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { setName } = TraineeSlice.actions;

export default TraineeSlice.reducer;
