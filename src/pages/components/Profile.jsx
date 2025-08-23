import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
function Profile() {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <div className="w-full h-full">
        <div>
          <div className="grid w-[100%] gap-6">
            <div className="grid gap-2">
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-gray-400">Full Profile Preview</p>
            </div>
          <div className="grid gap-6">
             <div className="flex flex-col lg:flex-row gap-6">
                      {/* Profile Image Section */}
                      <div className="grid gap-4 w-full sm:w-82">
                        <Label>Profile Image</Label>
                        <img
                          src={user.avatar.url}
                          alt="avatar"
                          className="w-full h-auto sm:h-72 rounded-2xl object-contain border"
                        />
                       
                      </div>
            
                     
                      
                      </div>
                    </div>
            <div className="grid gap-2">
              <Label>User Name</Label>
              <Input type="text" defaultValue={user.username} disabled />
            </div>
             <div className="grid gap-2">
              <Label>User Email</Label>
              <Input type="email" defaultValue={user.email} disabled />
            </div>
             <div className="grid gap-2">
              <Label>User Phone</Label>
              <Input type="text" defaultValue={user.phone} disabled />
            </div>
             <div className="grid gap-2">
              <Label>About Me</Label>
              <Textarea  defaultValue={user.aboutMe} disabled />
            </div>
           
          </div>
          </div>
        </div>
      
    </>
  );
}

export default Profile;