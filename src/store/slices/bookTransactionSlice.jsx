import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_BACKEND_URL_BANKTRANSACTION;


const bookTransactionSlice = createSlice({
  name: "bookTransaction",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    addTransactionRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addTransactionSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.transactions.push(action.payload);
      state.message = action.payload;
    },
    addTransactionFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAllTransactionRequest(state) {
      state.transactions = [];
      state.loading = true;
      state.error = null;
    },
    getAllTransactionSuccess(state, action) {
      state.transactions = action.payload.transactions;
      state.loading = false;
      state.error = null;
    },
    getAllTransactionFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTransactionRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteTransactionSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.transactions = state.transactions.filter(
        (trans) => trans._id !== action.payload.transactions
      );
      state.message = action.payload;
    },
    deleteTransactionFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    updateTransactionRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateTransactionSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    updateTransactionFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetTransactionSatus(state) {
      state.error = null;
      state.loading = false;
      state.message = null;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const addBookTransaction = (formData)=> async (dispatch)=>{
     dispatch(bookTransactionSlice.actions.addTransactionRequest());
   try {
    const response = await axios.post(
      `${BASE_URL}/add`,
      formData,
      { withCredentials: true ,headers: {"Content-Type": "application/json"}}
    );
    dispatch(bookTransactionSlice.actions.addTransactionSuccess(response.data.message));
    dispatch(bookTransactionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(bookTransactionSlice.actions.addTransactionFailed(error.response.data.message));
  }

}

export const getAllBookTransactions = ({startDate,endDate}) => async (dispatch) => {
  dispatch(bookTransactionSlice.actions.getAllTransactionRequest());
  try {
      const queryParams = new URLSearchParams({});
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    const { data } = await axios.get(
      `${BASE_URL}/getAll?${queryParams.toString()}`,
      { withCredentials: true }
    );
    dispatch(bookTransactionSlice.actions.getAllTransactionSuccess(data));
    dispatch(bookTransactionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(bookTransactionSlice.actions.getAllTransactionFail(error?.response?.data.message));
  }
};

export const deleteBookTransaction = (id) => async (dispatch) => {
  dispatch(bookTransactionSlice.actions.deleteTransactionRequest());
  try { 
    const { data } = await axios.delete(
      `${BASE_URL}/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(bookTransactionSlice.actions.deleteTransactionSuccess(data.message));
    dispatch(bookTransactionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(bookTransactionSlice.actions.deleteTransactionFail(error?.response?.data.message));
  } 
};

export const updateBookTransaction = (id,formData) => async (dispatch) => {
  dispatch(bookTransactionSlice.actions.updateTransactionRequest());
  try { 
    const { data } = await axios.put(
        `${BASE_URL}/update/${id}`,
        formData,
        { withCredentials: true ,headers: {"Content-Type": "application/json"}}
    );
    dispatch(bookTransactionSlice.actions.updateTransactionSuccess(data.message));
    dispatch(bookTransactionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(bookTransactionSlice.actions.updateTransactionFail(error?.response?.data.message));
  } 
};

export const clearAllTransactionErrors = () => (dispatch) => {
  dispatch(bookTransactionSlice.actions.clearAllErrors());
};

export const resetTransactionStatus = () => (dispatch) => {
  dispatch(bookTransactionSlice.actions.resetTransactionSatus());
};

export default bookTransactionSlice.reducer;

