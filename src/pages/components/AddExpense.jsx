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
import { addExpense, resetExpenseStatus, clearAllExpenseErrors } from "@/store/slices/expenseSlice";
import { fetchCategories } from "@/store/slices/expenseCategorySlice";
import Loader from "@/components/Loader";

function AddExpense() {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.expense);
  const { categories } = useSelector((state) => state.expenseCategory);

  const [vendorName, setVendorName] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [amount, setAmount] = useState("");
  const [vatAmount, setVatAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [isVatApplicable, setIsVatApplicable] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      vendorName,
      invoiceNo,
      amount,
      vatAmount,
      totalAmount,
      category,
      paymentMethod,
      date,
      isVatApplicable,
      notes,
    };
    dispatch(addExpense(formData));
  };

  useEffect(() => {
    const amt = parseFloat(amount) || 0;
    const vat = isVatApplicable ? (parseFloat(vatAmount) || 0) : 0;
    setTotalAmount((amt + vat).toFixed(2));
  }, [amount, vatAmount, isVatApplicable]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllExpenseErrors());
    }
    if (message) {
      toast.success(message || "Expense added successfully!");
      dispatch(resetExpenseStatus());
      // Reset form
      setVendorName("");
      setInvoiceNo("");
      setAmount("");
      setVatAmount("");
      setTotalAmount("");
      setCategory("");
      setPaymentMethod("");
      setDate("");
      setNotes("");
      setIsVatApplicable(false);
    }
  }, [dispatch, error, message]);

  if (loading) return <Loader />;

  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
   <div className="grid gap-6 max-w-5xl mx-auto">
        <div className="grid gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Add Expense</h1>
          <p className="text-muted-foreground">Fill in the Expens details below.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Vendor Name</Label>
              <Input
                placeholder="Enter vendor name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
                className="bg-stone-50 border-stone-300"
              />
            </div>

            <div>
              <Label>Invoice No</Label>
              <Input
                placeholder="Enter invoice number"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                required
                className="bg-stone-50 border-stone-300"
              />
            </div>
          </div>
           <div className="grid sm:grid-cols-3 gap-4 ">
            <div className="w-full">
              <Label>Category</Label>
              <Select onValueChange={(val) => setCategory(val)} >
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

            <div  className="w-full ">
              <Label>Payment Method</Label>
              <Select  onValueChange={(val) => setPaymentMethod(val)} >
                <SelectTrigger className="bg-stone-50 border-stone-300 w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
              <div  className="w-full">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required

                className="bg-stone-50 border-stone-300 w-full"
              />
            </div>
          
          </div>
              <div className="flex items-center gap-2 mt-6">
              <input
                id="vatApplicable"
                type="checkbox"
                checked={isVatApplicable}
                onChange={(e) => setIsVatApplicable(e.target.checked)}
              />
              <Label htmlFor="vatApplicable" className="text-stone-700">
                VAT Applicable
              </Label>
            </div>

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
              <Label>VAT Amount</Label>
              <Input
                type="number"
                placeholder="0"
                value={vatAmount}
                onChange={(e) => setVatAmount(e.target.value)}
                className="bg-stone-50 border-stone-300"
              />
            </div>
            <div>
              <Label>Total Amount</Label>
              <Input
                type="number"
                readonly
                value={totalAmount}
                required
                className="bg-stone-50 border-stone-300"
              />
            </div>
          </div>

         

       
          
       

          <div>
            <Label>Notes</Label>
            <Textarea
              placeholder="Additional details about this expense"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-stone-50 border-stone-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto bg-stone-700 hover:bg-stone-800 text-white"
          >
            Add Expense
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
