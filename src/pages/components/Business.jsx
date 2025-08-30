import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import {
  clearBusinessErrors,
  getBusiness,
  updateBusiness,
  resetBusiness,
} from "@/store/slices/businessSlice";
import { toast } from "react-toastify";

import SpecialLoadingBtn from "./specialLoadingBtn";


function Business() {
    const { loading, error, business, isUpdated, message } = useSelector(
    (state) => state.business
  );
 
  const [name, setName] = useState(business?.name || "");
  const [email, setEmail] = useState(business?.email || "");
  const [phone, setPhone] = useState(business?.phone || "");
  const [vatNumber, setVatNumber] = useState(business?.vatNumber || "");
  const [ckNumber, setCkNumber] = useState(business?.ckNumber || "");
  const [address, setAddress] = useState(business?.address || "");
  const [telPhone, setTelPhone] = useState(business?.telPhone || "");
  const [fax, setFax] = useState(business?.fax || "");


  const dispatch = useDispatch();

  const updateBusinessHandler = () => {
    const formData = new FormData();
   formData.append("name", name);
   formData.append("email", email);
   formData.append("phone", phone);
    formData.append("vatNumber", vatNumber);
    formData.append("ckNumber", ckNumber);
    formData.append("address", address);
    formData.append("telPhone", telPhone);
    formData.append("fax", fax);


    dispatch(updateBusiness(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBusinessErrors());
    }
    if (isUpdated) {
      dispatch(getBusiness());
      dispatch(resetBusiness());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, loading, error, isUpdated, message]);

  return (
    <div className="w-full">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Business Information</h1>
          <p className="text-muted-foreground">
            Update Your Business Information
          </p>
        </div>

        {/* User Details */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input type="text" placeholder="Enter Name" value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input type="text" placeholder="Enter Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Tel Phone</Label>
            <Input type="text" placeholder="Enter Telephone" value={telPhone} onChange={(e)=>setTelPhone(e.target.value)}  />
          </div>
          <div className="grid gap-2">
            <Label>address</Label>
            <Textarea placeholder="Enter Address" value={address} onChange={(e)=>setAddress(e.target.value)}  />
          </div>
          <div className="grid gap-2">
            <Label>vatNumber</Label>
            <Textarea placeholder="Enter Vat Number" value={vatNumber} onChange={(e)=>setVatNumber(e.target.value)}  />
          </div>
          <div className="grid gap-2">
            <Label>ckNumber</Label>
            <Textarea placeholder="Enter ck Number " value={ckNumber} onChange={(e)=>setCkNumber(e.target.value)}  />
          </div>
          <div className="grid gap-2">
            <Label>Fax</Label>
            <Textarea placeholder="Enter Fax" value={fax} onChange={(e)=>setFax(e.target.value)}  />
          </div>
          <div className="grid gap-2 mb-8">
            {!loading ? (
              <Button className="w-full cursor-pointer" onClick={updateBusinessHandler} >Save</Button>
            ) : (
              <SpecialLoadingBtn content="Saving...." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Business;
