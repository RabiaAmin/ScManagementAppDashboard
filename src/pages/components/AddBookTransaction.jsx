import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addBookTransaction,
  resetTransactionStatus,
  clearAllTransactionErrors,
} from "@/store/slices/bookTransactionSlice";
import { fetchCategories } from "@/store/slices/expenseCategorySlice";
import Loader from "@/components/Loader";

function AddBookTransaction() {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(
    (state) => state.bookTransaction
  );
  const { categories } = useSelector((state) => state.expenseCategory);
 
  // --- State variables ---
  const [transactionType, setTransactionType] = useState("");
  const sourceType = "MANUAL";
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");
  const [total, setTotal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [date, setDate] = useState("");

  // --- Auto calculate total ---
  useEffect(() => {
    const amt = parseFloat(amount) || 0;
    const taxVal = parseFloat(tax) || 0;
    setTotal((amt + taxVal).toFixed(2));
  }, [amount, tax]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // --- Handle success/error ---
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllTransactionErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetTransactionStatus());
      resetForm();
    }
  }, [dispatch, error, message]);

  // --- Reset form ---
  const resetForm = () => {
    setTransactionType("");
    setClient("");
    setCategory("");
    setAmount("");
    setTax("");
    setTotal("");
    setSupplier("");
    setPaymentMethod("");
    setIncomeCategory("");
    setDescription("");
    setDate("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!transactionType || !amount || !paymentMethod || !date) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (transactionType === "EXPENSE" && !category) {
      toast.error("Please select a category for expenses.");
      return;
    }

    if (transactionType === "INCOME" && !client) {
      toast.error("Please enter client name for income transactions.");
      return;
    }

    const vatApplicable = parseFloat(tax) > 0 ? true : false;


    const formData = {
      transactionType,
      sourceType,
      clientName: transactionType === "INCOME" ? client : "",
      supplierName: transactionType === "EXPENSE" ? supplier : "",
      category: transactionType === "EXPENSE" ? category : null,
      incomeCategory: transactionType === "INCOME" ? incomeCategory : "",
      amount,
      tax,
      total,
      paymentMethod,
      description,
      date,
      isVatApplicable: vatApplicable, 
    };

    dispatch(addBookTransaction(formData));
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
      <div className="grid gap-6 max-w-5xl mx-auto">
        <div className="grid gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Add Book Transaction
          </h1>
          <p className="text-muted-foreground">
            Add a manual income or expense transaction.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Transaction Type */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Transaction Type</Label>
              <Select
                onValueChange={(val) => setTransactionType(val)}
                value={transactionType}
              >
                <SelectTrigger className="bg-stone-50 border-stone-300 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Source Type</Label>
              <Input
                readOnly
                value={sourceType}
                className="bg-stone-100 border-stone-300 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                (Transactions from invoices or expenses are auto-recorded)
              </p>
            </div>
          </div>

          {/* Client for Income OR Category for Expense */}
          <div className="grid sm:grid-cols-3 gap-4">
            {transactionType === "INCOME" && (
              <div>
                <Label>Client</Label>
                <Input
                  type="text"
                  placeholder="Enter client name"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  required
                  className="bg-stone-50 border-stone-300"
                />
              </div>
            )}
             {transactionType === "EXPENSE" && (
              <div>
                <Label>Supplier</Label>
                <Input
                  type="text"
                  placeholder="Enter Supplier name"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  required
                  className="bg-stone-50 border-stone-300"
                />
              </div>
            )}


            {transactionType === "INCOME" && (
              <div>
                <Label>Category</Label>
                <Select
                  onValueChange={(val) => setIncomeCategory(val)}
                  value={incomeCategory}
                >
                  <SelectTrigger className="bg-stone-50 border-stone-300 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Finished Garments", "CMT Services", "Other Income"].map((cat , index) => (
                      <SelectItem key={index} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {transactionType === "EXPENSE" && (
              <div>
                <Label>Category</Label>
                <Select
                  onValueChange={(val) => setCategory(val)}
                  value={category}
                >
                  <SelectTrigger className="bg-stone-50 border-stone-300 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Payment Method</Label>
              <Select
                onValueChange={(val) => setPaymentMethod(val)}
                value={paymentMethod}
              >
                <SelectTrigger className="bg-stone-50 border-stone-300 w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-stone-50 border-stone-300"
              />
            </div>
          </div>

          {/* Amount Fields */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-stone-50 border-stone-300"
              />
            </div>
            <div>
              <Label>Tax</Label>
              <Input
                type="number"
                placeholder="0"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="bg-stone-50 border-stone-300"
              />
            </div>
            <div>
              <Label>Total</Label>
              <Input
                type="number"
                readOnly
                value={total}
                required
                className="bg-stone-50 border-stone-300"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Additional notes about this transaction"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-stone-50 border-stone-300"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full sm:w-auto bg-stone-700 hover:bg-stone-800 text-white"
          >
            Add Transaction
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddBookTransaction;
