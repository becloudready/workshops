import { configureStore } from "@reduxjs/toolkit";
import TraineeSlice from "./TraineeStore";

export const Store = configureStore({
  reducer: {
    trainee: TraineeSlice,
  },
});

export default Store;
