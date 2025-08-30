import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SpecialLoadingBtn from './specialLoadingBtn';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import {addClient,resetClient,clearClientErrors,getAllClients} from '@/store/Slices/clientSlice';
import { useDispatch } from 'react-redux';
import SpecialLoadinBtn from "./specialLoadingBtn";




function AddClients() {
  const {loading , error , message,isCreated} = useSelector((state)=>state.client)
  const dispatch = useDispatch();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [telphone,setTelphone] = useState("");
  const [address,setAddress] = useState("");
  const [vatNumber,setVatNumber] = useState("");
  const [registrationNumber,setRegistrationNumber] = useState("");
  const [fax,setFax] = useState("");


  const addClientHandler = ()=>{
     const formData = new FormData();
      formData.append("name",name);
      formData.append("email",email);
      formData.append("phone",phone);
      formData.append("telphone",telphone);
      formData.append("address",address);
      formData.append("vatNumber",vatNumber);
      formData.append("registrationNumber",registrationNumber);
      formData.append("fax",fax);
      dispatch(addClient(formData));
  }


  useEffect(()=>{
    if(error){
      toast.error(error);
      dispatch(clearClientErrors());
    }
    if(isCreated){
      toast.success(message);
      dispatch(resetClient());
      dispatch(getAllClients());
      setName("");
      setEmail("");
      setPhone("");
      setTelphone("");
      setAddress("");
      setVatNumber("");
      setRegistrationNumber("");
      setFax("");
    }
  },[dispatch,error,isCreated,message])




  

  return (
    <div className="w-full">
      <div className="grid gap-6">
        {/* Heading */}
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Client Information</h1>
          <p className="text-muted-foreground">Add Your New Client Information</p>
        </div>

        {/* Client Details */}
        <form onSubmit={addClientHandler}>
           <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input type="text" placeholder="client name" value={name} onChange={(e)=>setName(e.target.value)}  />
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" placeholder="client email" value={email}  onChange={(e)=>setEmail(e.target.value)}  />
          </div>

          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input type="text" placeholder="client phone" value={phone}  onChange={(e)=>setPhone(e.target.value)}  />
          </div>

          <div className="grid gap-2">
            <Label>Tel Phone</Label>
            <Input type="text" placeholder="client telphone" value={telphone}  onChange={(e)=>setTelphone(e.target.value)}  />
          </div>

          <div className="grid gap-2">
            <Label>Address</Label>
            <Textarea placeholder="client address" value={address}  onChange={(e)=>setAddress(e.target.value)}  />
          </div>

          <div className="grid gap-2">
            <Label>VAT Number</Label>
            <Input type="text" placeholder="client vat number" value={vatNumber}  onChange={(e)=>setVatNumber(e.target.value)}  />
          </div>

          <div className="grid gap-2">
            <Label>Registration Number</Label>
            <Input type="text" placeholder="client registration number" value={registrationNumber}  onChange={(e)=>setRegistrationNumber(e.target.value)}  />
          </div>

          <div className="grid gap-2">
            <Label>Fax</Label>
            <Input type="text" placeholder="client fax" value={fax}  onChange={(e)=>setFax(e.target.value)}  />
          </div>

          {/* Save Button */}
          <div className="grid gap-2 mb-8">
            {!loading ? (
              <Button className="w-full cursor-pointer"type="submit">Add Client</Button>
            ) : (
              <SpecialLoadingBtn content="Adding..." />
            )}
          </div>
        </div>
        </form>
       
      </div>
    </div>
  );
}

export default AddClients;
