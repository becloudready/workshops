import { createSlice } from "@reduxjs/toolkit";

const TraineeSlice = createSlice({
  name: "TraineeSlice",
  initialState: {
    name: "test",
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { setName } = TraineeSlice.actions;
export default TraineeSlice.reducer;
