import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import SpecialLoadingBtn from "./SpecialLoadingBtn";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
  createInvoice,
  resetInvoice,
  clearInvoiceErrors,

} from "@/store/Slices/invoiceSlice";

function CreateInvoice() {
  const dispatch = useDispatch();
  const { loading, error, message, isCreated } = useSelector(state => state.invoice);
  const { business } = useSelector(state => state.business);
  const { clients } = useSelector(state => state.client);

  const [poNumber, setPoNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [fromBusiness, setFromBusiness] = useState(business?._id || "");
  const [toClient, setToClient] = useState("");
  const [items, setItems] = useState([{ quantity: 1, description: "", unitPrice: 0, amount: 0 }]);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    const sub = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    setSubTotal(sub);
    const calculatedTax =  sub*0.15;
    setTax(calculatedTax); 
    setTotalAmount(sub + calculatedTax);
  }, [items, tax]);



  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    setItems(updatedItems);
  };

  const addItem = () => setItems([...items, { quantity: 1, description: "", unitPrice: 0, amount: 0 }]);
  const removeItem = index => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = e => {
    e.preventDefault();
    const invoiceData = { poNumber, date, fromBusiness, toClient, items, subTotal, tax, totalAmount, status };
    dispatch(createInvoice(invoiceData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearInvoiceErrors());
    }
    if (isCreated) {
      toast.success(message);
      dispatch(resetInvoice());

      setPoNumber("");
      setDate(new Date().toISOString().slice(0, 10));
      setToClient("");
      setItems([{ quantity: 1, description: "", unitPrice: 0, amount: 0 }]);
      setSubTotal(0);
      setTax(0);
      setTotalAmount(0);
      setStatus("Pending");
    }
  }, [error, isCreated, message, dispatch]);

  return (
    <div className="w-full p-4 sm:p-6 md:p-8">
      <div className="grid gap-6 max-w-5xl mx-auto">
        <div className="grid gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Create Invoice</h1>
          <p className="text-muted-foreground">Fill in the invoice details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* PO Number & Date */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="w-full">
              <Label>PO Number</Label>
              <Input
                type="text"
                placeholder="eg: po57886"
                value={poNumber}
                onChange={e => setPoNumber(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="w-full">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                readOnly
                onChange={e => setDate(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* From Business & To Client */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="w-full">
              <Label>From Business</Label>
              <Input
                type="text"
                placeholder="Business ID"
                value={fromBusiness}
                readOnly
                onChange={e => setFromBusiness(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="w-full">
              <Label>To Client</Label>
              <Select value={toClient} onValueChange={val => setToClient(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dynamic Items */}
          <div className="grid gap-4">
            <Label>Items</Label>
            {items.map((item, index) => (
              <div key={index} className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[120px]">
                  <Label className="text-stone-400">Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, "quantity", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 min-w-[150px]">
                  <Label className="text-stone-400">Description</Label>
                  <Input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={e => handleItemChange(index, "description", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 min-w-[120px]">
                  <Label className="text-stone-400">Unit Price</Label>
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={e => handleItemChange(index, "unitPrice", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 min-w-[120px]">
                  <Label className="text-stone-400">Amount</Label>
                  <Input type="number" value={item.amount} readOnly className="w-full" />
                </div>

                <div className="flex justify-end items-end min-w-[100px]">
                  <Button type="button" variant="destructive" onClick={() => removeItem(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" variant="secondary" className="cursor-pointer w-full sm:w-auto" onClick={addItem}>
              + Add Item
            </Button>
          </div>

          {/* Totals & Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Subtotal</Label>
              <Input type="number" value={subTotal} readOnly className="w-full" />
            </div>

            <div>
              <Label>15% Tax</Label>
              <Input type="number" value={tax} readOnly className="w-full" />
            </div>

            <div>
              <Label>Total Amount</Label>
              <Input type="number" value={totalAmount} readOnly className="w-full" />
            </div>

            <div>
              <Label>Status</Label>
              <select className="border p-2 rounded-md w-full" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="w-full mt-4">
            {!loading ? (
              <Button className="w-full sm:w-auto" type="submit">
                Create Invoice
              </Button>
            ) : (
              <SpecialLoadingBtn content="Creating..." />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInvoice;
