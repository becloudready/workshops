import { configureStore } from "@reduxjs/toolkit";
import TraineeSlice from "./TraineeSlice";
import TraineeTasksSlice from "./TraineeTasksSlice";

export const Store = configureStore({
  reducer: {
    trainee: TraineeSlice,
    traineeTasks: TraineeTasksSlice,
  },
});

export default Store;
