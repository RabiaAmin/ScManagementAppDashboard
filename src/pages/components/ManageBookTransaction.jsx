import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookTransactions,
  deleteBookTransaction,
   resetTransactionStatus,
  clearAllTransactionErrors,
} from "@/store/slices/bookTransactionSlice";
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
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ManageBookTransaction() {
  const dispatch = useDispatch();
  const {error, loading, transactions,totalPages ,message } = useSelector(
    (state) => state.bookTransaction
  );
  
    const [page, setPage] = useState(1);
    const [limit] = useState(40);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSearch, setIsSearch] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // --- Default month range ---
  useEffect(() => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const start = first.toISOString().split("T")[0];
    const end = last.toISOString().split("T")[0];

    setStartDate(start);
    setEndDate(end);

    dispatch(getAllBookTransactions({startDate:start, endDate:end, page:page, limit:limit }));
  }, [dispatch]);

  // --- Delete Transaction ---
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteBookTransaction(id));
    }
  };

    useEffect(() => {
      
  
      if (error) {
        toast.error(error);
        dispatch(clearAllTransactionErrors());
      }
      if (message) {
        toast.success(message);
        dispatch(resetTransactionStatus());
      
      }
    }, [error, message, dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      {/* --- Filter Section --- */}
      <div className="flex flex-wrap justify-between items-end mb-4">
        <div>
        
        </div>
        <div className="flex flex-wrap gap-3 items-end justify-end">
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
            {isSearchLoading ? (
              <SpecialLoadingBtn />
            ) : (
              <Button
                disabled={isSearch}
                onClick={() => {
                  setIsSearchLoading(true);
                  dispatch(getAllBookTransactions({startDate:startDate, endDate:endDate}));
                  setTimeout(() => {
                    setIsSearchLoading(false);
                    setIsSearch(true);
                  }, 1000);
                }}
              >
                Search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* --- Table Section --- */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Book Transactions
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : transactions?.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No transactions found for this period.
            </p>
          ) : (
            <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Payement Method</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx._id}>
                      <TableCell>
                        {new Date(tx.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{tx.transactionType}</TableCell>
                      <TableCell>{tx.paymentMethod}</TableCell>
            
                      <TableCell>{ tx.transactionType === "EXPENSE"? tx.category?.name : tx.incomeCategory}</TableCell>
                      <TableCell>R{tx.amount?.toFixed(2)}</TableCell>
                      <TableCell>R{tx.tax?.toFixed(2)}</TableCell>
                      <TableCell>R{tx.total?.toFixed(2)}</TableCell>
                      <TableCell className="flex justify-center space-x-2">
                        <Link to={`/bookTransaction/update/${tx._id}`}>
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
                          onClick={() => handleDelete(tx._id)}
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
              <div className="flex flex-wrap justify-center items-center mt-4 gap-3 sm:gap-4">
                            <Button
                              disabled={page === 1}
                              onClick={() => setPage((prev) => prev - 1)}
                            >
                              Prev
                            </Button>
                            <span className="text-sm sm:text-base">
                              Page {page} of {totalPages || 1}
                            </span>
                            <Button
                              disabled={page === totalPages}
                              onClick={() => setPage((prev) => prev + 1)}
                            >
                              Next
                            </Button>
                          </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ManageBookTransaction;
