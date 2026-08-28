import { configureStore } from "@reduxjs/toolkit";
import TraineeSlice from "./TraineeSlice";
import TraineeTasksSlice from "./TraineeTasksSlice";
import TrainerSlice from "./TrainerSlice";
export const Store = configureStore({
  reducer: {
    trainee: TraineeSlice,
    trainer: TrainerSlice,
    traineeTasks: TraineeTasksSlice,
  },
});

export default Store;
