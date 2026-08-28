import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("trainee");

const initialState = storedUser
  ? JSON.parse(storedUser)
  : {
      accessToken: null,
      tokenType: null,
      role: null,
      userId: null,
      isAuthenticated: false,
    };

const TraineeSlice = createSlice({
  name: "trainee",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, tokenType, role, userId } = action.payload;

      state.accessToken = accessToken;
      state.tokenType = tokenType;
      state.role = role;
      state.userId = userId;
      state.isAuthenticated = true;

      // Persist the entire login state
      localStorage.setItem(
        "trainee",
        JSON.stringify({
          accessToken,
          tokenType,
          role,
          userId,
          isAuthenticated: true,
        }),
      );
    },

    logout: (state) => {
      state.accessToken = null;
      state.tokenType = null;
      state.role = null;
      state.userId = null;
      state.isAuthenticated = false;

      localStorage.removeItem("trainee");
    },

    setName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { setCredentials, logout, setName } = TraineeSlice.actions;

export default TraineeSlice.reducer;
