
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL_EMPLOYEE_LOAN;

const employeeLoanSlice = createSlice({
  name: "employeeLoan",
  initialState: {
    loansByEmployee: [],  // for EmployeeLoanPage
    allLoans: [],  
    employee: {},
    totalLoans: 0,
    totalLoanAmount: 0,
    totalPaidAmount: 0,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // ================= ADD LOAN =================
    addLoanRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addLoanSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    addLoanFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= GET ALL LOANS =================
    getAllLoansRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAllLoansSuccess: (state, action) => {
      state.loading = false;
      state.allLoans = action.payload;
    },
    getAllLoansFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getLoansByEmployeeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
   
    getLoansByEmployeeSuccess: (state, action) => {
      state.loading = false;  
      state.error = null;
      state.loansByEmployee = action.payload.loans;
      state.employee = action.payload.employee;
      state.totalLoans = action.payload.totalLoans;
      state.totalLoanAmount = action.payload.totalLoanAmount;
      state.totalPaidAmount = action.payload.totalPaidAmount;
    },
    getLoansByEmployeeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= DELETE LOAN =================
    deleteLoanRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteLoanSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.allLoans = state.loans.filter((loan) => loan._id !== action.payload);
      state.message = action.payload.message || "Loan deleted successfully";
    },
    deleteLoanFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // ================= UPDATE / PAY LOAN =================
    updateLoanRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateLoanSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload.message || "Loan updated successfully";
      state.allLoans = state.loans.map((loan) =>
        loan._id === action.payload.loan._id ? action.payload.loan : loan
      );
    },
    updateLoanFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    // ================= RESET / CLEAR =================
    resetLoanStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    clearAllErrors: (state) => {
      state.error = null;
    },
  },
});

// ================= THUNKS =================

// ADD LOAN
export const addLoan = (data) => async (dispatch) => {
  dispatch(employeeLoanSlice.actions.addLoanRequest());
  try {
    const res = await axios.post(`${BASE_URL}/add`, data, { withCredentials: true });
    dispatch(employeeLoanSlice.actions.addLoanSuccess(res.data.message));
  } catch (error) {
    dispatch(
      employeeLoanSlice.actions.addLoanFail(error.response?.data?.message || error.message)
    );
  }
};

// GET ALL LOANS
export const getAllLoans = () => async (dispatch) => {
  dispatch(employeeLoanSlice.actions.getAllLoansRequest());
  try {
    const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
    dispatch(employeeLoanSlice.actions.getAllLoansSuccess(res.data.loans));
  } catch (error) {
    dispatch(
      employeeLoanSlice.actions.getAllLoansFail(error.response?.data?.message || error.message)
    );
  }
};

// PAY EMI
export const payLoanEmi = ({ id, amount }) => async (dispatch) => {
  dispatch(employeeLoanSlice.actions.updateLoanRequest());
  try {
    const res = await axios.put(`${BASE_URL}/pay-emi/${id}`, { amount }, { withCredentials: true });
    dispatch(employeeLoanSlice.actions.updateLoanSuccess(res.data));
  } catch (error) {
    dispatch(
      employeeLoanSlice.actions.updateLoanFail(error.response?.data?.message || error.message)
    );
  }
};

// PAY MANUAL
export const payManualLoanAmount = ({ loanId, amount, method = "CASH", note }) => async (dispatch) => {
  dispatch(employeeLoanSlice.actions.updateLoanRequest());
  try {
    const res = await axios.put(
      `${BASE_URL}/pay-manual/${loanId}`,
      { amount, method, note },
      { withCredentials: true }
    );
    dispatch(employeeLoanSlice.actions.updateLoanSuccess(res.data));
  } catch (error) {
    dispatch(
      employeeLoanSlice.actions.updateLoanFail(error.response?.data?.message || error.message)
    );
  }
};

export const getLoansByEmployee = (employeeId) => async (dispatch) => {
  dispatch(employeeLoanSlice.actions.getLoansByEmployeeRequest());
  try {
    const res = await axios.get(`${BASE_URL}/employee/${employeeId}`, { withCredentials: true });
    dispatch(employeeLoanSlice.actions.getLoansByEmployeeSuccess(res.data));
  } catch (error) {
    dispatch(
      employeeLoanSlice.actions.getLoansByEmployeeFail( 
        error.response?.data?.message || error.message
      )
    );
  } 
};

// DELETE LOAN
export const deleteLoan = (loanId) => async (dispatch) => {
  dispatch(employeeLoanSlice.actions.deleteLoanRequest());
  try {
    const res = await axios.delete(`${BASE_URL}/close/${loanId}`, { withCredentials: true });
    dispatch(employeeLoanSlice.actions.deleteLoanSuccess(res.data));
  } catch (error) {
    dispatch(
      employeeLoanSlice.actions.deleteLoanFail(error.response?.data?.message || error.message)
    );
  }
};

// RESET & CLEAR
export const clearEmployeeLoanErrors = () => (dispatch) => {
  dispatch(employeeLoanSlice.actions.clearAllErrors());
};
export const resetEmployeeLoan = () => (dispatch) => {
  dispatch(employeeLoanSlice.actions.resetLoanStatus());
};

export default employeeLoanSlice.reducer;
