import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL_EMPLOYEE;

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    loading: false,
    employees: [],
    employee: {},
    error: null,
    message: null,
  },

  reducers: {
    // ================= ADD =================
    addEmployeeRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addEmployeeSuccess(state, action) {
      state.loading = false;
      state.employees.push(action.payload.employee);
      state.message = action.payload.message;
    },
    addEmployeeFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= UPDATE =================
    updateEmployeeRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateEmployeeSuccess(state, action) {
      state.loading = false;
      state.employees = state.employees.map((emp) =>
        emp._id === action.payload.employee._id
          ? action.payload.employee
          : emp
      );
      state.message = action.payload.message;
    },
    updateEmployeeFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= GET ALL =================
    getAllEmployeeRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getAllEmployeeSuccess(state, action) {
      state.loading = false;
      state.employees = action.payload;
    },
    getAllEmployeeFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getEmployeeDetailsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getEmployeeDetailsSuccess(state, action) {
      state.loading = false;
      state.employee = action.payload;
    },
    getEmployeeDetailsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= DELETE =================
    deleteEmployeeRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteEmployeeSuccess(state, action) {
      state.loading = false;
      state.employees = state.employees.filter(
        (emp) => emp._id !== action.payload.id
      );
      state.message = action.payload.message;
    },
    deleteEmployeeFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= RESET & CLEAR =================
    resetEmployeeStatus(state) {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
    clearEmployeeErrors(state) {
      state.error = null;
    },
  },
});


// ================= THUNKS =================

// ✅ ADD EMPLOYEE
export const addEmployee = (Data) => async (dispatch) => {
  dispatch(employeeSlice.actions.addEmployeeRequest());
  try {
    const { data } = await axios.post(
      `${BASE_URL}/add`,
      Data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(
      employeeSlice.actions.addEmployeeSuccess({
        employee: data.employee,
        message: data.message,
      })
    );

    dispatch(employeeSlice.actions.clearEmployeeErrors());
  } catch (error) {
    dispatch(
      employeeSlice.actions.addEmployeeFail(
        error.response?.data?.message || error.message
      )
    );
  }
};


export const updateEmployee = ({ id, Data }) => async (dispatch) => {
  dispatch(employeeSlice.actions.updateEmployeeRequest());
  try {
    const { data } = await axios.put(
      `${BASE_URL}/update/${id}`,
      Data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(
      employeeSlice.actions.updateEmployeeSuccess({
        employee: data.employee,
        message: data.message,
      })
    );

    dispatch(employeeSlice.actions.clearEmployeeErrors());
  } catch (error) {
    dispatch(
      employeeSlice.actions.updateEmployeeFail(
        error.response?.data?.message || error.message
      )
    );
  }
};


export const deleteEmployee = (id) => async (dispatch) => {
  dispatch(employeeSlice.actions.deleteEmployeeRequest());
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/delete/${id}`,
      { withCredentials: true }
    );

    dispatch(
      employeeSlice.actions.deleteEmployeeSuccess({
        id,
        message: data.message,
      })
    );

    dispatch(employeeSlice.actions.clearEmployeeErrors());
  } catch (error) {
    dispatch(
      employeeSlice.actions.deleteEmployeeFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

export const getSingleEmployeeDetails = (id) => async (dispatch) => {
  dispatch(employeeSlice.actions.getEmployeeDetailsRequest());
  try {
    const { data } = await axios.get(
      `${BASE_URL}/get/${id}`,
      { withCredentials: true }
    );
    dispatch(
      employeeSlice.actions.getEmployeeDetailsSuccess(data.employee)
    );
    dispatch(employeeSlice.actions.clearEmployeeErrors());
  }
  catch (error) {
    dispatch(
      employeeSlice.actions.getEmployeeDetailsFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

export const getAllEmployee = () => async (dispatch) => {
  dispatch(employeeSlice.actions.getAllEmployeeRequest());
  try {
    const { data } = await axios.get(
      `${BASE_URL}/getAll`,
      { withCredentials: true }
    );

    dispatch(
      employeeSlice.actions.getAllEmployeeSuccess(data.employees)
    );

    dispatch(employeeSlice.actions.clearEmployeeErrors());
  } catch (error) {
    dispatch(
      employeeSlice.actions.getAllEmployeeFail(
        error.response?.data?.message || error.message
      )
    );
  }
};


export const resetEmployee = () => (dispatch) => {
  dispatch(employeeSlice.actions.resetEmployeeStatus());
};

export const clearEmployeeErrors = () => (dispatch) => {
  dispatch(employeeSlice.actions.clearEmployeeErrors());
};

export default employeeSlice.reducer;
