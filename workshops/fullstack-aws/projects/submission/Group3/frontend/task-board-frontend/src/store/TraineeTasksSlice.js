import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  selectedTask: null,
  progressHistory: [],
  loading: false,
  error: null,
};

const TraineeTaskSlice = createSlice({
  name: "TraineeTaskSlice",

  initialState,

  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },

    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },

    setProgressHistory: (state, action) => {
      state.progressHistory = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearSelectedTask: (state) => {
      state.selectedTask = null;
      state.progressHistory = [];
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTasks,
  setSelectedTask,
  setProgressHistory,
  setLoading,
  setError,
  clearSelectedTask,
  clearError,
} = TraineeTaskSlice.actions;

export default TraineeTaskSlice.reducer;
