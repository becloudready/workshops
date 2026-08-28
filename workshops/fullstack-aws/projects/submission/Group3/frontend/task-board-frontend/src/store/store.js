import { configureStore } from "@reduxjs/toolkit";

import TraineeSlice from "./TraineeStore";
import TrainerSlice from "./TrainerStore";

export const Store = configureStore({
  reducer: {
    trainee: TraineeSlice,
    trainer: TrainerSlice,
  },
});

export default Store;
