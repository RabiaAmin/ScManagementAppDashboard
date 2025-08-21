import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const forgotResetPassSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    forgotPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    resetPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(forgotResetPassSlice.actions.forgotPasswordRequest());
  try {
    const data = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL_USER}/password/forgot`,
      { email},
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(forgotResetPassSlice.actions.forgotPasswordSuccess(data.data.message));
    dispatch(forgotResetPassSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(forgotResetPassSlice.actions.forgotPasswordFail(error.response.data.message));
  }
};

export const resetPassword = (token, password, confirmPassword) => async (dispatch) => {
  dispatch(forgotResetPassSlice.actions.resetPasswordRequest());
  try {
      const data = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL_USER}/password/reset/${token}`,
      { password,confirmPassword},
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
  
    dispatch(forgotResetPassSlice.actions.resetPasswordSuccess(data.data.message));
    dispatch(forgotResetPassSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(forgotResetPassSlice.actions.resetPasswordFail(error.response.data.message));
  }
};

export const clearAllForgotPasswordErrors = () => (dispatch) => {
  dispatch(forgotResetPassSlice.actions.clearAllErrors());
};

export default forgotResetPassSlice.reducer;