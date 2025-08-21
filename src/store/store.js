import {configureStore} from "@reduxjs/toolkit"
import  userReducer  from "./Slices/userSlice"
import  forgotResetPassReducer from "./Slices/forgotResetPasswordSlice"
export const store = configureStore({
    reducer:{
        user : userReducer,
         forgotPassword: forgotResetPassReducer,
    }
})