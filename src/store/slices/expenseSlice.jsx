import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_BACKEND_URL_EXPENSE;

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    Expenses: [],
    ExpenseStats: {},
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    addExpeseRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addExpenseSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    addExpenseFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAllExpenseRequest(state) {
      state.Expenses = [];
      state.loading = true;
      state.error = null;
    },
    getAllExpenseSuccess(state, action) {
      state.Expenses = action.payload.Expenses;
      state.ExpenseStats = action.payload.expenseStats;
      state.loading = false;
      state.error = null;
    },
    getAllExpenseFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteExpenseRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteExpenseSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.Expenses = state.Expenses.filter(
        (exp) => exp._id !== action.payload.Expenses
      );
      state.message = action.payload;
    },
    deleteExpenseFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    updateExpenseRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateExpenseSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    updateExpenseFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetExpenseSatus(state) {
      state.error = null;
      state.loading = false;
      state.message = null;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const addExpense = (formData)=> async (dispatch)=>{
     dispatch(expenseSlice.actions.addExpeseRequest());
   try {
    const response = await axios.post(
      `${BASE_URL}/add`,
      formData,
      { withCredentials: true ,headers: {"Content-Type": "application/json"}}
    );
    dispatch(expenseSlice.actions.addExpenseSuccess(response.data.message));
    dispatch(expenseSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(expenseSlice.actions.addExpenseFailed(error.response.data.message));
  }

}

export const getAllExpenses = (startDate,endDate) => async (dispatch) => {
  dispatch(expenseSlice.actions.getAllExpenseRequest());
  try {
    const { data } = await axios.get(
      `${BASE_URL}/getAll?startDate=${startDate}&endDate=${endDate}`,
      { withCredentials: true }
    );
    dispatch(expenseSlice.actions.getAllExpenseSuccess(data));
    dispatch(expenseSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(expenseSlice.actions.getAllExpenseFail(error?.response?.data.message));
  }
};

export const deleteExpense = (id) => async (dispatch) => {
  dispatch(expenseSlice.actions.deleteExpenseRequest());
  try { 
    const { data } = await axios.delete(
      `${BASE_URL}/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(expenseSlice.actions.deleteExpenseSuccess(data.message));
    dispatch(expenseSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(expenseSlice.actions.deleteExpenseFail(error?.response?.data.message));
  } 
};

export const updateExpense = (id,formData) => async (dispatch) => {
  dispatch(expenseSlice.actions.updateExpenseRequest());
  try { 
    const { data } = await axios.put(
        `${BASE_URL}/update/${id}`,
        formData,
        { withCredentials: true ,headers: {"Content-Type": "application/json"}}
    );
    dispatch(expenseSlice.actions.updateExpenseSuccess(data.message));
    dispatch(expenseSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(expenseSlice.actions.updateExpenseFail(error?.response?.data.message));
  } 
};

export const clearAllExpenseErrors = () => (dispatch) => {
  dispatch(expenseSlice.actions.clearAllErrors());
};

export const resetExpenseStatus = () => (dispatch) => {
  dispatch(expenseSlice.actions.resetExpenseSatus());
};

export default expenseSlice.reducer;

