import { configureStore } from "@reduxjs/toolkit";
import TraineeSlice from "./TraineeSlice";
import TraineeTasksSlice from "./TraineeTasksSlice";

export const Store = configureStore({
  reducer: {
    trainee: TraineeSlice,
    trainer: TrainerSlice,
  },
});

export default Store;
