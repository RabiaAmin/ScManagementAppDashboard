import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllExpenses,

  deleteExpense,
} from "../../store/slices/expenseSlice";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import SpecialLoadingBtn from "./SpecialLoadingBtn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function ManageExpense() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSearch, setIsSearch] = useState(true);

  const dispatch = useDispatch();
  const { loading,  Expenses } = useSelector(
    (state) => state.expense
  );

  // Default month range
  useEffect(() => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const start = first.toISOString().split("T")[0];
    const end = last.toISOString().split("T")[0];

    setStartDate(start);
    setEndDate(end);
    dispatch(getAllExpenses(start, end));
  }, [dispatch]);

 

  const handleDelete = (id)=>{
    if(window.confirm("Are you sure you want to delete this expense?")){
        dispatch(deleteExpense(id));}
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      {/* --- Filter Section --- */}
      <div className="flex flex-wrap items-end gap-3 mb-6 justify-end">
        <div>
          <label className="text-stone-400 text-sm">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setIsSearch(false);
            }}
          />
        </div>
        <div>
          <label className="text-stone-400 text-sm">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setIsSearch(false);
            }}
          />
        </div>
        <div>
          {loading ? (
            <SpecialLoadingBtn />
          ) : (
            <Button
              disabled={isSearch}
              onClick={() => {
                setIsSearch(true);
                dispatch(getAllExpenses(startDate, endDate));
              }}
            >
              Search
            </Button>
          )}
        </div>
      </div>

      {/* --- Table Section --- */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">
              Expense List
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : Expenses?.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No expenses found for this period.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>VAT Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {Expenses.map((expense) => (
                    <TableRow key={expense._id} >
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{expense.vendorName}</TableCell>
                      <TableCell>{expense.invoiceNo}</TableCell>
                      <TableCell  >{expense.notes || "-"}</TableCell>
                      <TableCell>{expense.paymentMethod}</TableCell>
                      <TableCell>R{expense.amount.toFixed(2)}</TableCell>
                      <TableCell>R{expense.vatAmount.toFixed(2)}</TableCell>
                      <TableCell className="flex justify-center space-x-2">
                     
                        <Link to={`/expense/update/${expense._id}`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-primary/10"
                          >
                            <Pencil className="w-5 h-5 text-green-600" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-primary/10"
                            onClick={() => handleDelete(expense._id)}
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ManageExpense;
