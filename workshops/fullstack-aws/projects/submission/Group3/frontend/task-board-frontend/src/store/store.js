import { configureStore } from "@reduxjs/toolkit";

import TraineeSlice from "./TraineeStore";

export const Store = configureStore({
  reducer: {
    TraineeSlice: TraineeSlice,
  },
  middleware: (getDefault) => getDefault(),
});

export default Store;
