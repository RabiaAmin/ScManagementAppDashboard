import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";

import { toast } from "react-toastify";
import {
  addCategory,
  clearExpenseCategoryErrors,
  deleteCategory,
  fetchCategories,
  resetExpenseCategory,
} from "@/store/slices/expenseCategorySlice";

function ManageExpenseCategory() {
  const { loading, error, message, isCreated, categories } = useSelector(
    (state) => state.expenseCategory
  );
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const addCategoryHandler = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    dispatch(addCategory(formData));
  };
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(categoryId));
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearExpenseCategoryErrors());
    }
    if (isCreated) {
      toast.success(message);
      dispatch(resetExpenseCategory());
      dispatch(fetchCategories());
      setName("");
      setDescription("");
    }
  }, [dispatch, error, isCreated, message]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen  py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <Card className="shadow-md bg-stone-50 border-stone-300">
          <CardHeader>
            <CardTitle className="text-center text-stone-800 text-2xl font-semibold">
              Manage Expense Categories
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Add Expense Category Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Category Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-stone-300 focus:ring-stone-400"
              />
              <Input
                placeholder="Description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white border-stone-300 focus:ring-stone-400"
              />
            </div>

            <Button
              onClick={addCategoryHandler}
              className="w-full sm:w-auto bg-stone-700 hover:bg-stone-800"
            >
              Add Category
            </Button>

            {/* Table for Categories */}
            <div className="mt-8 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-stone-200">
                    <TableHead className="w-1/6 text-stone-700">#</TableHead>
                    <TableHead className="w-1/3 text-stone-700">Name</TableHead>
                    <TableHead className="w-1/2 text-stone-700">
                      Description
                    </TableHead>
                    <TableHead className="text-right text-stone-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat, index) => (
                    <TableRow key={cat._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell>{cat.description}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="bg-stone-600 hover:bg-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {categories.length === 0 && (
                <p className="text-center text-stone-500 mt-4">
                  No expense categories available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ManageExpenseCategory;
