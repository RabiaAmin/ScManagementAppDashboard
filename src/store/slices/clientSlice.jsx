import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL_CLIENT; // e.g. http://localhost:4000/api/v1/client

const clientSlice = createSlice({
  name: "client",
  initialState: {
    loading: false,
    clients: [],      
    client: {},      
    isCreated: false, 
    isUpdated: false, 
    error: null,
    message: null,
  },
  reducers: {
    // Add client
    addClientRequest(state) {
      state.loading = true;
      state.error = null;
      state.isCreated = false;
    },
    addClientSuccess(state, action) {
      state.loading = false;
      state.isCreated = true;
      state.clients.push(action.payload);
      state.message = action.payload;
    },
    addClientFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isCreated = false;
    },

    // Update client
    updateClientRequest(state) {
      state.loading = true;
      state.error = null;
      state.isUpdated = false;
    },
    updateClientSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      // update client in the list
      state.clients = state.clients.map((client) =>
        client._id === action.payload._id ? action.payload : client
      );
      state.message = action.payload;
    },
    updateClientFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isUpdated = false;
    },

    // Delete client
    deleteClientRequest(state) {
      state.loading = true;
      state.error = null;
      state.isDeleted = false;
    },
    deleteClientSuccess(state, action) {
      state.loading = false;
      state.isDeleted = true;
      state.clients = state.clients.filter(
        (client) => client._id !== action.payload
      );
      state.message = action.payload;
    },
    deleteClientFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isDeleted = false;
    },

    // Get single client
    getClientRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getClientSuccess(state, action) {
      state.loading = false;
      state.client = action.payload;
    },
    getClientFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.client = {};
    },

    // Get all clients
    getAllClientsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getAllClientsSuccess(state, action) {
      state.loading = false;
      state.clients = action.payload;
    },
    getAllClientsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.clients = [];
    },

    // Reset flags
    resetClientStatus(state) {
      state.isCreated = false;
      state.isUpdated = false;
      state.loading = false;
      state.message = null;
      state.error = null;
    },

    // Clear errors
    clearClientErrors(state) {
      state.error = null;
    },
  },
});

// Thunks
export const addClient = (clientData) => async (dispatch) => {
  dispatch(clientSlice.actions.addClientRequest());
  try {
    const { data } = await axios.post(
      `${BASE_URL}/add`,
      clientData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
   
    dispatch(clientSlice.actions.addClientSuccess(data.message));
    dispatch(clientSlice.actions.clearClientErrors());
  } catch (error) {
    dispatch(
      clientSlice.actions.addClientFail(error.response?.data?.message || error.message)
    );
  }
};

export const updateClient = (id, clientData) => async (dispatch) => {
  dispatch(clientSlice.actions.updateClientRequest());
  try {
    const { data } = await axios.put(
      `${BASE_URL}/update/${id}`,
      clientData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(clientSlice.actions.updateClientSuccess(data.message));
    dispatch(clientSlice.actions.clearClientErrors());
  } catch (error) {
    dispatch(
      clientSlice.actions.updateClientFail(error.response?.data?.message || error.message)
    );
  }
};

export const deleteClient = (id) => async (dispatch) => {
  dispatch(clientSlice.actions.deleteClientRequest());
  try {
    await axios.delete(`${BASE_URL}/delete/${id}`, { withCredentials: true });
    dispatch(clientSlice.actions.deleteClientSuccess(id));
    dispatch(clientSlice.actions.clearClientErrors());
  } catch (error) {
    dispatch(
      clientSlice.actions.deleteClientFail(error.response?.data?.message || error.message)
    );
  }
};

export const getClient = (id) => async (dispatch) => {
  dispatch(clientSlice.actions.getClientRequest());
  try {
    const { data } = await axios.get(`${BASE_URL}/get/${id}`, { withCredentials: true });
    dispatch(clientSlice.actions.getClientSuccess(data.client));
    dispatch(clientSlice.actions.clearClientErrors());
  } catch (error) {
    dispatch(
      clientSlice.actions.getClientFail(error.response?.data?.message || error.message)
    );
  }
};

export const getAllClients = () => async (dispatch) => {
  dispatch(clientSlice.actions.getAllClientsRequest());
  try {
    const { data } = await axios.get(`${BASE_URL}/getAll`, { withCredentials: true });
    dispatch(clientSlice.actions.getAllClientsSuccess(data.clients));
    dispatch(clientSlice.actions.clearClientErrors());
  } catch (error) {
    dispatch(
      clientSlice.actions.getAllClientsFail(error.response?.data?.message || error.message)
    );
  }
};

// Reset and clear error actions
export const resetClient = () => (dispatch) => {
  dispatch(clientSlice.actions.resetClientStatus());
};

export const clearClientErrors = () => (dispatch) => {
  dispatch(clientSlice.actions.clearClientErrors());
};

export default clientSlice.reducer;
