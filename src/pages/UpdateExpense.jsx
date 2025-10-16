import Loader from "@/components/Loader";
import { fetchCategories } from "@/store/slices/expenseCategorySlice";
import {
  clearAllExpenseErrors,
  getAllExpenses,
  resetExpenseStatus,
  updateExpense,
} from "@/store/slices/expenseSlice";
import axios from "axios";
import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
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
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";

function UpdateExpense() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error, message, Expenses } = useSelector(
    (state) => state.expense
  );

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

 const BASE_URL = import.meta.env.VITE_BACKEND_URL_EXPENSE;

   useEffect(() => {
     dispatch(fetchCategories());
   }, [dispatch]);
  useEffect(() => {    const fetchExpense = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get/${id}`, { withCredentials: true });
        const e = res.data.expense;
        setVendorName(e.vendorName || "");
        setInvoiceNo(e.invoiceNo || "");
        setAmount(e.amount || "");
        setVatAmount(e.vatAmount || "");
        setTotalAmount(e.totalAmount || "");
        setCategory(e.category || "");
        setPaymentMethod(e.paymentMethod || "");
        setNotes(e.notes || "");
        setDate(e.date ? e.date.split("T")[0] : "");
        setIsVatApplicable(e.isVatApplicable || false);
      } catch (error) {
        toast.error(error.response.data.message);
      } 
    };   fetchExpense();
  }, [id]);

   const handleUpdate = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("vendorName",vendorName);
      formData.append("invoiceNo",invoiceNo);
      formData.append("amount",amount);
      formData.append("vatAmount",vatAmount);
        formData.append("totalAmount",totalAmount);
        formData.append("category",category);
        formData.append("paymentMethod",paymentMethod);
        formData.append("notes",notes);
        formData.append("date",date);
        formData.append("isVatApplicable",isVatApplicable);
      dispatch(updateExpense(id,formData));
    };

     useEffect(() => {
        const amt = parseFloat(amount) || 0;
        const vat = isVatApplicable ? (parseFloat(vatAmount) || 0) : 0;
        setTotalAmount((amt + vat).toFixed(2));
      }, [amount, vatAmount, isVatApplicable]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllExpenseErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetExpenseStatus());
      dispatch(getAllExpenses());
    }
  }, [dispatch, error, loading, message]);


    if (loading) return <Loader />;
  return  <div className="w-full h-[100vh] p-4 sm:p-6 md:p-8">
      <div className="grid gap-6 max-w-5xl mx-auto">
        <div className="grid gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Update Expense</h1>
          <p className="text-muted-foreground">
            Fill in the Expense details below.
          </p>
        </div>

           <form onSubmit={handleUpdate} className="grid gap-6">
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
              <Select value={category} onValueChange={(val) => setCategory(val)} >
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
              <Select value={paymentMethod}  onValueChange={(val) => setPaymentMethod(val)} >
                <SelectTrigger className="bg-stone-50 border-stone-300 w-full">
                  <SelectValue placeholder="Select payment method"/>
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

          <div className="w-full mt-4">
            {!loading ? (
              <Button className="w-full sm:w-auto" type="submit">
                Save Changes
              </Button>
            ) : (
              <SpecialLoadingBtn content="Creating..." />
            )}
          </div>
        </form>
      </div>
    </div>;
}

export default UpdateExpense;
