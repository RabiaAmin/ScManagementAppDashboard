import {configureStore} from "@reduxjs/toolkit"
import userReducer  from "./slices/userSlice"
import forgotResetPassReducer from "./slices/forgotResetPasswordSlice"
import businessReducer from "./slices/businessSlice"
import clientReducer from "./slices/clientSlice"
import invoiceReducer from "./slices/invoiceSlice"
import expenseCategoryReducer from "./slices/expenseCategorySlice"
import expense from "./slices/expenseSlice"

export const store = configureStore({
    reducer:{
        user : userReducer,
        forgotPassword: forgotResetPassReducer,
        business: businessReducer,
        client: clientReducer,
        invoice: invoiceReducer,
        expenseCategory: expenseCategoryReducer,
        expense: expense
        
    }
})