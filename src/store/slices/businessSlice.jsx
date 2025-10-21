import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL_BUSINESS;

const businessSlice = createSlice({
  name: "business",
  initialState: {
    loading: false,
    business: {},
    isUpdated: false,
    error: null,
    message: null,
  },
  
  reducers: {
    // Create business (no creation flag now)
    createBusinessRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createBusinessSuccess(state, action) {
      state.loading = false;
      state.business = action.payload;
      state.message = action.payload;
    },
    createBusinessFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Update business
    updateBusinessRequest(state) {
      state.loading = true;
      state.error = null;
      state.isUpdated = false;
    },
    updateBusinessSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.business = action.payload;
      state.message = action.payload;
    },
    updateBusinessFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isUpdated = false;
    },

    // Get business
    getBusinessRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getBusinessSuccess(state, action) {
      state.loading = false;
      state.business = action.payload;
      state.error = null;
    },
    getBusinessFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.business = {};
    },

    // Reset update flag
    resetBusinessStatus(state) {
      state.isUpdated = false;
      state.message = null;
      state.error = null;
    },

    // Clear errors
    clearBusinessErrors(state) {
      state.error = null;
    },
  },
});

// Thunks
export const createBusiness = (businessData) => async (dispatch) => {
  dispatch(businessSlice.actions.createBusinessRequest());
  try {
    const { data } = await axios.post(
      `${BASE_URL}/create`,
      businessData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(businessSlice.actions.createBusinessSuccess(data.message));
    dispatch(businessSlice.actions.clearBusinessErrors());
  } catch (error) {
    dispatch(
      businessSlice.actions.createBusinessFail(error.response?.data?.message || error.message)
    );
  }
};

export const updateBusiness = (businessData) => async (dispatch) => {
  dispatch(businessSlice.actions.updateBusinessRequest());
  try {
    const { data } = await axios.put(
      `${BASE_URL}/update`,
      businessData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(businessSlice.actions.updateBusinessSuccess(data.message));
    dispatch(businessSlice.actions.clearBusinessErrors());
  } catch (error) {
    dispatch(
      businessSlice.actions.updateBusinessFail(error.response?.data?.message || error.message)
    );
  }
};

export const getBusiness = () => async (dispatch) => {
  dispatch(businessSlice.actions.getBusinessRequest());
  try {
    const { data } = await axios.get(
      `${BASE_URL}/get`,
      { withCredentials: true }
    );
    dispatch(businessSlice.actions.getBusinessSuccess(data.business));
    dispatch(businessSlice.actions.clearBusinessErrors());
  } catch (error) {
    dispatch(
      businessSlice.actions.getBusinessFail(error.response?.data?.message || error.message)
    );
  }
};

// Reset and clear error actions
export const resetBusiness = () => (dispatch) => {
  dispatch(businessSlice.actions.resetBusinessStatus());
};

export const clearBusinessErrors = () => (dispatch) => {
  dispatch(businessSlice.actions.clearBusinessErrors());
};

export default businessSlice.reducer;
