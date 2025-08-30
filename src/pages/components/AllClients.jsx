import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteClient } from "@/store/slices/clientSlice"; // adjust path as needed
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


function AllClients() {
  const { clients  } = useSelector((state) => state.client);
  const dispatch = useDispatch();


  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      dispatch(deleteClient(id));
    }
  };


 

  return (
    <div className="w-full h-full p-6">
      <div className="grid gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200">
            All Clients
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Manage, update, or remove client records from the list below.
          </p>
        </div>

        {/* Client Cards */}
        {clients?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card
                key={client._id}
                className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-stone-800 dark:text-stone-100">
                    {client.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-1 text-sm text-stone-700 dark:text-stone-300">
                  <p>
                    <strong>VAT No:</strong> {client.vatNumber}
                  </p>
                  <p>
                    <strong>Reg No:</strong> {client.registrationNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {client.address}
                  </p>
                  <p>
                    <strong>Phone:</strong> {client.phone}
                  </p>
                  <p>
                    <strong>Fax:</strong> {client.fax}
                  </p>
                  <p>
                    <strong>Email:</strong> {client.email}
                  </p>
                  <p>
                    <strong>Telephone:</strong> {client.telphone}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between mt-2">
                  <Link to={`/update/${client._id}`}>
                  <Button
                    variant="secondary"
                    className="bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600"
                    
                  >
                    Edit
                  </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDelete(client._id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-stone-600 dark:text-stone-400 text-lg">
            No clients found. Add some clients first.
          </p>
        )}
      </div>



    </div>
  );
}

export default AllClients;
