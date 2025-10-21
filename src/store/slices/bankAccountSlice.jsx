import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
const BASE_URL = import.meta.env.VITE_BACKEND_URL_BANK_ACCOUNT;


const bankAcountSlice = createSlice({
  name: "bankAccount",
  initialState: {
    bankAccounts: [],
    bankAccount:{},
    error: null,
    message: null,
    loading: false,
  },
  reducers: {
    createAccountRequest(state) {
      state.loading = true;
    },
    createAccountSuccess(state, action) {
      state.bankAccounts.push(action.payload);
      state.loading = false;
      state.message = action.payload;
    },
    createAccountFail(state, action) {
      state.message = null;
      state.error = action.payload;
    },
    updateAccountRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateAccountSuccess(state, action) {
      state.bankAccounts = state.bankAccounts.map((account) =>
        account._id === action.payload._id ? action.payload : account
      );
      state.loading = false;
      state.message = action.payload;
    },
    updateAccountFail(state, action) {
      state.message = null;
      state.error = action.payload;
    },
    deleteAccountRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteAccountSuccess(state, action) {
      state.bankAccounts = state.bankAccounts = state.bankAccounts.filter(
        (account) => account._id !== action.payload
      );
      state.loading = false;
      state.message = action.payload;
    },
    deleteAccountFail(state, action) {
      state.message = null;
      state.error = action.payload;
    },
    getAllBankAccountsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getAllBankAccountsSuccess(state, action) {
      state.bankAccounts = action.payload;
      state.loading = false;
      state.message = action.payload;
    },
    getAllBankAccountsFail(state, action) {
      state.error = action.payload;
    },

    getSingleBankAccountRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getSingleBankAccountSuccess(state, action) {
      state.bankAccount = action.payload;
      state.loading = false;
      state.message = action.payload;
    },
    getSingleBankAccountFail(state, action) {
      state.error = action.payload;
    },
    resetBankAccountStatus(state){
        state.loading = false;
        state.message = null;
        state.error = null;
    },
    clearAllBankAccountErrors(state){
        state.error = null;
    }
  },
});

export const addBankAccount = (formData)=> async (dispatch)=>{
    dispatch(bankAcountSlice.actions.createAccountRequest());
    try {
        const {data} = await axios.post(`${BASE_URL}/create`,formData,{withCredentials:true , headers:{"Content-Type": "application/json"}});
        dispatch(bankAcountSlice.actions.createAccountSuccess(data.message));
        dispatch(bankAcountSlice.actions.clearAllBankAccountErrors());
    } catch (error) {
        dispatch(bankAcountSlice.actions.createAccountFail(error.response.data.message))
    }

}

export const getAllBankAccount = ()=> async (dispatch)=>{
    dispatch(bankAcountSlice.actions.getAllBankAccountsRequest());
    try {
        const {data} = await axios.get(`${BASE_URL}/getAll`,{withCredentials:true});
      
        dispatch(bankAcountSlice.actions.getAllBankAccountsSuccess(data.bankAccounts));
        dispatch(bankAcountSlice.actions.clearAllBankAccountErrors());
        
    } catch (error) {
        dispatch(bankAcountSlice.actions.getAllBankAccountsFail(error.response.data.message))
    }

}

export const getSingleBankAccount = (id)=> async (dispatch)=>{
    dispatch(bankAcountSlice.actions.getSingleBankAccountRequest());
    try {
        const {data} = await axios.get(`${BASE_URL}/get/${id}`,{withCredentials:true});
        dispatch(bankAcountSlice.actions.getSingleBankAccountSuccess(data.bankAccount));
        dispatch(bankAcountSlice.actions.clearAllBankAccountErrors());
        
    } catch (error) {
        dispatch(bankAcountSlice.actions.getSingleBankAccountFail(error.response.data.message))
    }

}

export const deleteBankAccount = (id)=> async (dispatch)=>{
    dispatch(bankAcountSlice.actions.deleteAccountRequest());
    try {
         await axios.delete(`${BASE_URL}/delete/${id}`,{withCredentials:true});
        dispatch(bankAcountSlice.actions.deleteAccountSuccess(id));
        dispatch(bankAcountSlice.actions.clearAllBankAccountErrors());
        
    } catch (error) {
        dispatch(bankAcountSlice.actions.deleteAccountFail(error.response.data.message))
    }
}

export const updateBankAccount = (id,formData)=> async (dispatch)=>{
    dispatch(bankAcountSlice.actions.updateAccountRequest());
    try {
        const {data} = await axios.put(`${BASE_URL}/update/${id}`,formData,{withCredentials:true , headers:{"Content-Type":"application/json"}});
        dispatch(bankAcountSlice.actions.updateAccountSuccess(data.message));
        dispatch(bankAcountSlice.actions.clearAllBankAccountErrors());
    } catch (error) {
        dispatch(bankAcountSlice.actions.updateAccountFail(error.response.data.message))
    }

}

export const resetBankAccount = ()=>(dispatch)=>{
  dispatch(bankAcountSlice.actions.resetBankAccountStatus());
}

export const clearAllErrors  = ()=>(dispatch)=>{
  dispatch(bankAcountSlice.actions.clearAllBankAccountErrors())
}





export default bankAcountSlice.reducer;
