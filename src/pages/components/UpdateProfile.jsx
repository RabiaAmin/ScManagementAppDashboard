import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SpecialLoadingBtn from "./specialLoadingBtn";
import { clearAllUserErrors, getUser, resetProfile, updateProfile } from "@/store/slices/userSlice";
import { toast } from "react-toastify";

function UpdateProfile() {
  const { user ,message,loading,error ,isUpadated} = useSelector((state) => state.user);

  const [username ,setUsername] = useState(user?.username);
  const [email,setEmail] = useState(user?.email);
  const [phone,setPhone] = useState(user?.phone);
  const [aboutMe,setAboutMe] = useState(user?.aboutMe);
  
  const [avatar, setAvatar] = useState(user?.avatar?.url || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || "");

  const dispatch = useDispatch();

  const avatarHandle = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
  };


  const updateProfileHandler = ()=>{
    const formData = new FormData();
    formData.append("username",username);
    formData.append("email",email);
    formData.append("phone",phone);
    formData.append("aboutMe",aboutMe);
  
    formData.append("avatar",avatar);
    
    dispatch(updateProfile(formData));
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
          <h1 className="text-2xl font-bold">Update Profile</h1>
          <p className="text-muted-foreground">Update Your Profile</p>
        </div>

        {/* Profile Image & Resume */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Image Section */}
          <div className="grid gap-4 w-full sm:w-82">
            <Label>Profile Image</Label>
            <img
              src={avatarPreview || "./vite.svg"}
              alt="avatar"
              className="w-full h-auto sm:h-72 rounded-2xl object-contain border"
            />
            <div className="relative">
              <input
                id="avatar-upload"
                type="file"
                onChange={avatarHandle}
                className="hidden"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer inline-block w-full text-center py-2 font-semibold rounded-md border-2 border-foreground text-foreground hover:bg-foreground hover:text-muted transition-all duration-200"
              >
                Upload Avatar
              </label>
            </div>
          </div>

         
        </div>

        {/* User Details */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>User Name</Label>
            <Input type="text" placeholder="user name" value={username} onChange={(e)=>setUsername(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>User Email</Label>
            <Input type="email" placeholder="user email" value={email} onChange={(e)=>setEmail(e.target.value)}  />
          </div>
          <div className="grid gap-2">
            <Label>User Phone</Label>
            <Input type="text" placeholder="user phone" value={phone} onChange={(e)=>setPhone(e.target.value)}  />
          </div>
          <div className="grid gap-2">
            <Label>About Me</Label>
            <Textarea placeholder="about user" value={aboutMe} onChange={(e)=>setAboutMe(e.target.value)}  />
          </div>
        
          <div className="grid gap-2 mb-8">
            {
                !loading ? <Button onClick={updateProfileHandler} className="w-full">Update Profile</Button>: <SpecialLoadingBtn content="profile updating...."/>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;