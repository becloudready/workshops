import { configureStore } from "@reduxjs/toolkit";

export const Store = configureStore({
  reducer: {
    TraineeSlice: require("./TraineeStore").default,
  },
  middleware: (getDefault) => getDefault(),
});

export default Store;
