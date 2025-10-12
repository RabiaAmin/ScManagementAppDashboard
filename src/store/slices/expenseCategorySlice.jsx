import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_BACKEND_URL_EXPENSE_CATEGORY;

const expenseCategorySlice = createSlice({
  name: "expenseCategory",
  initialState: {
    loading: false,
    categories: [],
    category: {},
    isCreated: false,
    isUpdated: false,
    error: null,
    message: null,
  },
  reducers: {
    // Add category
    addCategoryRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
      state.isCreated = false;
    },
    addCategorySuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.isCreated = true;
      state.message = action.payload ;
    },
    addCategoryFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
      state.isCreated = false;
    },
    deleteCategoryRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteCategorySuccess(state, action) {
      state.loading = false;
      state.categories = state.categories.filter(
        (cat) => cat._id !== action.payload
      );
      state.message = "Category deleted successfully!";
    },
    deleteCategoryFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // Fetch all categories
    fetchCategoriesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action) {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchCategoriesFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // Reset flags
    resetExpenseCategoryStatus(state) {
      state.isCreated = false;
      state.isUpdated = false;
      state.isDeleted = false;
      state.message = null;
      state.error = null;
    },

    // Clear errors
    clearExpenseCategoryErrors(state) {
      state.error = null;
    },
  },
});

export const addCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch(expenseCategorySlice.actions.addCategoryRequest());
    const { data } = await axios.post(`${BASE_URL}/add`, categoryData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(
      expenseCategorySlice.actions.addCategorySuccess(data.message)
    );
    dispatch(expenseCategorySlice.actions.clearExpenseCategoryErrors());
  } catch (error) {
    dispatch(
      expenseCategorySlice.actions.addCategoryFail(
        error.response?.data?.message || error.message
      )
    );
  }
};
export const deleteCategory = (categoryId) => async (dispatch) => {
  try {
    dispatch(expenseCategorySlice.actions.deleteCategoryRequest());
    await axios.delete(`${BASE_URL}/delete/${categoryId}`, {
      withCredentials: true,
    });
    dispatch(expenseCategorySlice.actions.deleteCategorySuccess(categoryId));
    dispatch(expenseCategorySlice.actions.clearExpenseCategoryErrors());
  } catch (error) {
    dispatch(
      expenseCategorySlice.actions.deleteCategoryFail(
        error.response?.data?.message || error.message
      )
    );
  }
};
export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(expenseCategorySlice.actions.fetchCategoriesRequest());
    const { data } = await axios.get(`${BASE_URL}/getAll`, {
      withCredentials: true,
    });
    dispatch(
      expenseCategorySlice.actions.fetchCategoriesSuccess(
        data.expenseCategories
      )
    );
    dispatch(expenseCategorySlice.actions.clearExpenseCategoryErrors());
  } catch (error) {
    dispatch(
      expenseCategorySlice.actions.fetchCategoriesFail(
        error.response?.data?.message || error.message
      )
    );
  }
};

// Reset and clear error actions
export const resetExpenseCategory = () => (dispatch) => {
  dispatch(expenseCategorySlice.actions.resetExpenseCategoryStatus());
};

export const clearExpenseCategoryErrors = () => (dispatch) => {
  dispatch(expenseCategorySlice.actions.clearExpenseCategoryErrors());
};
export default expenseCategorySlice.reducer;
