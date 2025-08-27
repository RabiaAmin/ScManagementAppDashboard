import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

import SpecialLoadingBtn from "./specialLoadingBtn";
const businessData = {
  _id: "68ad8cfa5e038e2af984d2e2",
  name: "SANIA CLOTHING CC",
  vatNumber: "4103254292",
  ckNumber: "2009/213423/23",
  address: "86 Devis Hurley Street (Queen Street), Bassa Building, Durban, 4001",
  phone: "0848817506",
  telPhone: "031 032 0743",
  fax: "0848817506",
  email: "xyz@gmail.com"
};

function Business() {
  const [data,] = useState(businessData);
  const [loading, ] = useState(false);

 
  

  return (
     <div className="w-full">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Business Information</h1>
          <p className="text-muted-foreground">Update Your Business Information</p>
        </div>

      
        {/* User Details */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input type="text" placeholder="user name" value={data.name}  />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" placeholder="user email" value={data.email}   />
          </div>
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input type="text" placeholder="user phone" value={data.phone}   />
          </div>
           <div className="grid gap-2">
            <Label>Tel Phone</Label>
            <Input type="text" placeholder="user phone" value={data.phone}   />
          </div>
          <div className="grid gap-2">
            <Label>address</Label>
            <Textarea placeholder="about user" value={data.address}   />
          </div>
           <div className="grid gap-2">
            <Label>vatNumber</Label>
            <Textarea placeholder="about user" value={data.address}   />
          </div>
           <div className="grid gap-2">
            <Label>ckNumber</Label>
            <Textarea placeholder="about user" value={data.address}   />
          </div>
           <div className="grid gap-2">
            <Label>Fax</Label>
            <Textarea placeholder="about user" value={data.address}   />
          </div>
          <div className="grid gap-2 mb-8">
            {
                !loading ? <Button className="w-full">Save</Button>: <SpecialLoadingBtn content="Saving...."/>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Business;
