import {configureStore} from "@reduxjs/toolkit"
import  userReducer  from "./Slices/userSlice"
import  forgotResetPassReducer from "./Slices/forgotResetPasswordSlice"
import businessReducer from "./Slices/businessSlice"
import clientReducer from "./Slices/clientSlice"
export const store = configureStore({
    reducer:{
        user : userReducer,
        forgotPassword: forgotResetPassReducer,
        business: businessReducer,
        client: clientReducer
        
    }
})