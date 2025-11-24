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
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

import {
  updateBookTransaction,
  clearAllTransactionErrors,
  resetTransactionStatus,
} from "@/store/slices/bookTransactionSlice";
import { fetchCategories } from "@/store/slices/expenseCategorySlice";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";

function UpdateBookTransaction() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { loading, error, message } = useSelector(
    (state) => state.bookTransaction
  );
  const { categories } = useSelector((state) => state.expenseCategory);

  const [transactionType, setTransactionType] = useState("");
  const sourceType = "MANUAL";
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [tax, setTax] = useState("");
  const [total, setTotal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const BASE_URL = import.meta.env.VITE_BACKEND_URL_BANKTRANSACTION;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get/${id}`, {
          withCredentials: true,
        });
        const t = res.data.transaction;

        setTransactionType(t.transactionType || "");
        setClient(t.clientName || "");
        setCategory(t.category?._id || "");
        setAmount(t.amount || "");
        setTax(t.tax || "");
        setTotal(t.total || "");
        setPaymentMethod(t.paymentMethod || "");
        setDescription(t.description || "");
        setDate(t.date ? t.date.split("T")[0] : "");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch transaction"
        );
      }
    };
    fetchTransaction();
  }, [id]);

  // 🟢 Auto-calculate total
  useEffect(() => {
    const amt = parseFloat(amount) || 0;
    const taxVal = parseFloat(tax) || 0;
    setTotal((amt + taxVal).toFixed(2));
  }, [amount, tax]);

  // 🟢 Handle update
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!transactionType || !amount || !paymentMethod || !date) {
      toast.error("Please fill all required fields.");
      return;
    }

    const vatApplicable = parseFloat(tax) > 0 ? true : false;

    const updatedData = {
      transactionType,
      sourceType,
      clientName: transactionType === "INCOME" ? client : "",
      category: transactionType === "EXPENSE" ? category : null,
      amount,
      tax,
      total,
      paymentMethod,
      description,
      date,
      isVatApplicable: vatApplicable,
    };

    dispatch(updateBookTransaction(id, updatedData));
  };

  // 🟢 Toast messages and state reset
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllTransactionErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetTransactionStatus());
    }
  }, [dispatch, error, message]);

  if (loading) return <Loader />;

  return (
    <div className="w-full h-[100vh]  p-4 sm:p-6 md:p-8">
      <div className="grid h-full gap-6 max-w-5xl mx-auto">
        <div className="grid gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Update Book Transaction
          </h1>
          <p className="text-muted-foreground">
            Edit details for this income or expense transaction.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="grid gap-6">
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
            </div>
          </div>

          {/* Client or Category */}
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

          {/* Amounts */}
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
              placeholder="Notes about this transaction"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-stone-50 border-stone-300"
            />
          </div>

          <div className="w-full mt-4">
            {!loading ? (
              <Button
                className="w-full sm:w-auto bg-stone-700 hover:bg-stone-800 text-white"
                type="submit"
              >
                Save Changes
              </Button>
            ) : (
              <SpecialLoadingBtn content="Updating..." />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateBookTransaction;
