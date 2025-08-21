import {createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const userSlice = createSlice({
    name: "user",
    initialState:{
        loading:false,
        user:{},
        isAuthenticated:false,
        error:null,
        message: null,
        isUpadated:false,
    },
    reducers :{
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    loadUserRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loadUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loadUserFail(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = action.payload;
    },
    logoutFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.isUpadated = false;
      state.message = null;
      state.error = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.isUpadated = true;
      state.message = action.payload;
      state.error = null;
    },
    updatePasswordFail(state, action) {
      state.loading = false;
      state.isUpadated = false;
      state.message = null;
      state.error = action.payload;
    },
      updateProfileRequest(state) {
      state.loading = true;
      state.isUpadated = false;
      state.message = null;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.isUpadated = true;
      state.message = action.payload;
      state.error = null;
    },
    updateProfileFail(state, action) {
      state.loading = false;
      state.isUpadated = false;
      state.message = null;
      state.error = action.payload;
    },
    updateProfileResetAfterUpdate(state){
      state.error = null;
      state.isUpadated = false;
      state.message = null;
    },
    clearAllErrors(state) {
      state.error = null;
    },
    }
});


export const login = (email, password) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const data = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL_USER}/login` ,
      { email, password },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(userSlice.actions.loginSuccess(data.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loginFail(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.loadUserRequest());
  try {
    const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL_USER}/getUser`, {
      withCredentials: true,
    });
 
    dispatch(userSlice.actions.loadUserSuccess(data.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loadUserFail(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL_USER}/logout`, {
      withCredentials: true,
    });
 
    dispatch(userSlice.actions.logoutSuccess(data.data.message));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFail(error.response.data.message));
  }
};

export const updatePassword = (currentPassword,newPassword,confirmNewPassword)=> async (dispatch)=>{
  dispatch(userSlice.actions.updatePasswordRequest());
  try {
     const {data} = await axios.put(`${import.meta.env.VITE_BACKEND_URL_USER}/update/pawssord`,{currentPassword,newPassword,confirmNewPassword},{withCredentials:true,headers:{"Content-Type":"application/json"}});
     dispatch(userSlice.actions.updatePasswordSuccess(data.message));
     dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
     dispatch(userSlice.actions.updatePasswordFail(error.response.data.message));
  } 
}

export const updateProfile = (formdata)=> async (dispatch)=>{
  dispatch(userSlice.actions.updateProfileRequest());
  try {
     const {data} = await axios.put(`${import.meta.env.VITE_BACKEND_URL_USER}/update/profile`,formdata,{withCredentials:true,headers:{"Content-Type":"multipart/form-data"}});
     dispatch(userSlice.actions.updateProfileSuccess(data.message));
     dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
     dispatch(userSlice.actions.updateProfileFail(error.response.data.message));
  } 
}

export const resetProfile = ()=> async (dispatch)=>{
   dispatch(userSlice.actions.updateProfileResetAfterUpdate())
}

export const clearAllUserErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllErrors());
};

export default userSlice.reducer;