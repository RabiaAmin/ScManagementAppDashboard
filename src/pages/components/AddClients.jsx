import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SpecialLoadingBtn from './specialLoadingBtn';



function AddClients() {
  const [loading] = useState(false);

  return (
    <div className="w-full">
      <div className="grid gap-6">
        {/* Heading */}
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Client Information</h1>
          <p className="text-muted-foreground">Update Your Client Information</p>
        </div>

        {/* Client Details */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input type="text" placeholder="client name" value="Enter Values"  />
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" placeholder="client email" value="Enter Values"  />
          </div>

          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input type="text" placeholder="client phone" value="Enter Values"  />
          </div>

          <div className="grid gap-2">
            <Label>Tel Phone</Label>
            <Input type="text" placeholder="client telphone" value="Enter Values"  />
          </div>

          <div className="grid gap-2">
            <Label>Address</Label>
            <Textarea placeholder="client address" value="Enter Values"  />
          </div>

          <div className="grid gap-2">
            <Label>VAT Number</Label>
            <Input type="text" placeholder="client vat number" value="Enter Values"  />
          </div>

          <div className="grid gap-2">
            <Label>Registration Number</Label>
            <Input type="text" placeholder="client registration number" value="Enter Values"  />
          </div>

          <div className="grid gap-2">
            <Label>Fax</Label>
            <Input type="text" placeholder="client fax" value="Enter vlaue"  />
          </div>

          {/* Save Button */}
          <div className="grid gap-2 mb-8">
            {!loading ? (
              <Button className="w-full">Add Client</Button>
            ) : (
              <SpecialLoadingBtn content="Adding..." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddClients;
