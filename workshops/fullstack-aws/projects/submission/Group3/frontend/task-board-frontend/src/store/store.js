import { configureStore } from "@reduxjs/toolkit";
import TraineeSlice from "./TraineeSlice";
import TraineeTasksSlice from "./TraineeTasksSlice";
import TrainerSlice from "./TrainerStore";

export const Store = configureStore({
  reducer: {
    trainee: TraineeSlice,
    trainer: TrainerSlice,
  },
});

export default Store;
