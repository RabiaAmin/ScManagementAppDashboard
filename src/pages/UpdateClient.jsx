import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateClient } from "@/store/slices/clientSlice";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";

const BASE_URL = import.meta.env.VITE_BACKEND_URL_CLIENT;
import {
  
  getAllClients,
  resetClient,
  clearClientErrors,
} from "../store/Slices/clientSlice";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

function UpdateClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [telphone, setTelphone] = useState("");
  const [address, setAddress] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [fax, setFax] = useState("");

  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error, message } = useSelector(
    (state) => state.client
  );

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("telphone", telphone);
    formData.append("address", address);
    formData.append("vatNumber", vatNumber);
    formData.append("registrationNumber", registrationNumber);
    formData.append("fax", fax);
    dispatch(updateClient( id, formData ));
  };

useEffect(() => {
  const fetchClient = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/get/${id}`, { withCredentials: true });
      const c = res.data.client;
      setName(c.name || "");
      setEmail(c.email || "");
      setPhone(c.phone || "");
      setTelphone(c.telphone || "");
      setAddress(c.address || "");
      setVatNumber(c.vatNumber || "");
      setRegistrationNumber(c.registrationNumber || "");
      setFax(c.fax || "");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch client data");
    }
  };
  fetchClient();
}, [id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearClientErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetClient());
      dispatch(getAllClients());
    }
  }, [dispatch, error, loading, message]);

  return (
    <div className="flex flex-col p-4 w-full min-h-screen">
      <main className="flex-1 grid items-start gap-6 sm:px-6 sm:py-4 md:gap-8 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-6 md:gap-8 lg:col-span-2">
          {/* Header Section */}
          <div className="flex justify-between items-center bg-muted/40 p-4 rounded-lg shadow-sm">
            <h1 className="text-center text-2xl font-bold tracking-tight dark:text-gray-100">
              Edit Client Information
            </h1>
            <Link to={"/"}>
              <Button>Back to Dashboard</Button>
            </Link>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1 */}
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  type="text"
                  placeholder="Client name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Client email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Row 2 */}
              <div className="flex flex-col gap-2">
                <Label>Phone</Label>
                <Input
                  type="text"
                  placeholder="Client phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Tel Phone</Label>
                <Input
                  type="text"
                  placeholder="Client telephone"
                  value={telphone}
                  onChange={(e) => setTelphone(e.target.value)}
                />
              </div>

              {/* Row 3 */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label>Address</Label>
                <Textarea
                  placeholder="Client address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="resize-none"
                />
              </div>

              {/* Row 4 */}
              <div className="flex flex-col gap-2">
                <Label>VAT Number</Label>
                <Input
                  type="text"
                  placeholder="Client VAT number"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Registration Number</Label>
                <Input
                  type="text"
                  placeholder="Client registration number"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                />
              </div>

              {/* Row 5 */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label>Fax</Label>
                <Input
                  type="text"
                  placeholder="Client fax"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="grid gap-2">
              {!loading ? (
                <Button className="w-full cursor-pointer" type="submit">
                  Save Changes
                </Button>
              ) : (
                <SpecialLoadingBtn content="Updating..." />
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UpdateClient;
