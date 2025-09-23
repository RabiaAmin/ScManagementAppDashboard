import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import SpecialLoadingBtn from "./SpecialLoadingBtn";
import { useDispatch, useSelector } from "react-redux";
import { clearAllUserErrors, getUser, resetProfile, updatePassword } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

function UpdatePassword() {
  const { message,loading,error ,isUpadated} = useSelector((state) => state.user);
  const [currentPassword,setCurrentPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmNewPassword,setConfirmNewPassword] = useState("");

  const dispatch =useDispatch();
  const updatePasswordHandler =()=>{
   dispatch(updatePassword(currentPassword,newPassword,confirmNewPassword));
  }

   useEffect(()=>{
      if(error){
          toast.error(error);
          dispatch(clearAllUserErrors());
      }
      if(isUpadated){
          dispatch(getUser());
          dispatch(resetProfile());
      }
      if(message){
          toast.success(message);
      }
    },[dispatch ,loading,error , isUpadated])
  
  return (
    <div className="w-full">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Update Password</h1>
          <p className="text-muted-foreground">Update Your Password</p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Current Password</Label>
            <Input
              type="text"
              placeholder="current password"
              value={currentPassword}
              onChange={(e)=> setCurrentPassword(e.target.value) }
            />  </div>
            <div className="grid gap-2">
            <Label>New Password</Label>
            <Input
              type="text"
              placeholder="new password"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value) }
            />  </div>
               <div className="grid gap-2">
            <Label>Confirm New Password</Label>
            <Input
              type="text"
              placeholder="confirm new password"
              value={confirmNewPassword}
              onChange={ (e)=>setConfirmNewPassword(e.target.value)}
            />  </div>
          <div className="grid gap-2 mb-8">
            {
                !loading ? <Button onClick={updatePasswordHandler} className="w-full">Update Password</Button>: <SpecialLoadingBtn content="Updating...." />
            }
        
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;