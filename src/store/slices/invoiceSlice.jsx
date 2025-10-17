import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL_INVOICE;

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    loading: false,
    invoices: [],
    invoice: {},
    isCreated: false,
    isUpdated: false,
    isDeleted: false,
    error: null,
    message: null,
    page: 1,
    totalPages: 1,
    totalRecords: 0,
    stats: {},
    
  },
  reducers: {
    // Create invoice
    createInvoiceRequest(state) {
      state.loading = true;
      state.error = null;
      state.isCreated = false;
    },
    createInvoiceSuccess(state, action) {
      state.loading = false;
      state.isCreated = true;
      state.invoices.push(action.payload);
      state.message = "Invoice created successfully!";
    },
    createInvoiceFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isCreated = false;
    },

    // Update invoice
    updateInvoiceRequest(state) {
      state.loading = true;
      state.error = null;
      state.isUpdated = false;
    },
    updateInvoiceSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.invoices = state.invoices.map((invoice) =>
        invoice._id === action.payload._id ? action.payload : invoice
      );
      state.message = "Invoice updated successfully!";
    },
    updateInvoiceFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isUpdated = false;
    },

    // Delete invoice
    deleteInvoiceRequest(state) {
      state.loading = true;
      state.error = null;
      state.isDeleted = false;
    },
    deleteInvoiceSuccess(state, action) {
      state.loading = false;
      state.isDeleted = true;
      state.invoices = state.invoices.filter(
        (invoice) => invoice._id !== action.payload
      );
      state.message = "Invoice deleted successfully!";
    },
    deleteInvoiceFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isDeleted = false;
    },

    // Get single invoice
    getInvoiceRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getInvoiceSuccess(state, action) {
      state.loading = false;
      state.invoice = action.payload;
    },
    getInvoiceFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.invoice = {};
    },

    // Get all invoices
    getAllInvoicesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getAllInvoicesSuccess(state, action) {
      state.loading = false;
      state.invoices = action.payload.invoices;
      state.stats = action.payload.stats;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.totalRecords = action.payload.totalRecords;
    },
    getAllInvoicesFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.invoices = [];
    },

    // Reset status
    resetInvoiceStatus(state) {
      state.isCreated = false;
      state.isUpdated = false;
      state.isDeleted = false;
      state.message = null;
      state.error = null;
    },

    // Clear errors
    clearInvoiceErrors(state) {
      state.error = null;
    },
  },
});

// Thunks
export const createInvoice = (invoiceData) => async (dispatch) => {
  dispatch(invoiceSlice.actions.createInvoiceRequest());
  try {
    const { data } = await axios.post(`${BASE_URL}/create`, invoiceData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(invoiceSlice.actions.createInvoiceSuccess(data.invoice));
    dispatch(invoiceSlice.actions.clearInvoiceErrors());
  } catch (error) {
    dispatch(
      invoiceSlice.actions.createInvoiceFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

export const updateInvoice = (id, invoiceData) => async (dispatch) => {
  dispatch(invoiceSlice.actions.updateInvoiceRequest());
  try {
    const { data } = await axios.put(`${BASE_URL}/update/${id}`, invoiceData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(invoiceSlice.actions.updateInvoiceSuccess(data.invoice));
    dispatch(invoiceSlice.actions.clearInvoiceErrors());
  } catch (error) {
    dispatch(
      invoiceSlice.actions.updateInvoiceFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

export const deleteInvoice = (id) => async (dispatch) => {
  dispatch(invoiceSlice.actions.deleteInvoiceRequest());
  try {
    await axios.delete(`${BASE_URL}/delete/${id}`, { withCredentials: true });
    dispatch(invoiceSlice.actions.deleteInvoiceSuccess(id));
    dispatch(invoiceSlice.actions.clearInvoiceErrors());
  } catch (error) {
    dispatch(
      invoiceSlice.actions.deleteInvoiceFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

export const getInvoice = (id) => async (dispatch) => {
  dispatch(invoiceSlice.actions.getInvoiceRequest());
  try {
    const { data } = await axios.get(`${BASE_URL}/get/${id}`, {
      withCredentials: true,
    });
    dispatch(invoiceSlice.actions.getInvoiceSuccess(data.invoice));
    dispatch(invoiceSlice.actions.clearInvoiceErrors());
  } catch (error) {
    dispatch(
      invoiceSlice.actions.getInvoiceFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

export const getAllInvoicesOFThisMonth = (page, limit,startDate,endDate) => async (dispatch) => {
  dispatch(invoiceSlice.actions.getAllInvoicesRequest());
  try {
        const queryParams = new URLSearchParams({ page, limit });
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    const { data } = await axios.get(
      `${BASE_URL}/getAllOfThisMonth?${queryParams.toString()}`,
      { withCredentials: true }
    );
    dispatch(invoiceSlice.actions.getAllInvoicesSuccess(data));
    dispatch(invoiceSlice.actions.clearInvoiceErrors());
  } catch (error) {
    dispatch(
      invoiceSlice.actions.getAllInvoicesFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

// Reset and clear error actions
export const resetInvoice = () => (dispatch) => {
  dispatch(invoiceSlice.actions.resetInvoiceStatus());
};

export const clearInvoiceErrors = () => (dispatch) => {
  dispatch(invoiceSlice.actions.clearInvoiceErrors());
};

export default invoiceSlice.reducer;
