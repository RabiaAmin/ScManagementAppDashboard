import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

function Orders() {
  const [loading, setLoading] = useState(true);
  const [ordersPerProduct, setOrdersPerProduct] = useState([
    { totalOrders: 0, product: "", invoiceCount: 0 },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const now = new Date();

    // Start of the month
    const first = new Date(now.getFullYear(), now.getMonth(), 1);

    // End of the month
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Format as YYYY-MM-DD
    const startDate = first.toISOString().split("T")[0];
    const endDate = last.toISOString().split("T")[0];

    fetchData(startDate, endDate);
  }, []);

  const fetchData = async (start, end) => {
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL_INVOICE;
      const res = await axios.get(
        `${BASE_URL}/getOrdersPerProduct?startDate=${start}&endDate=${end}&_=${new Date().getTime()}`,
        { withCredentials: true }
      );
      const data = res.data.data;

      setOrdersPerProduct(data);
      setLoading(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to fetch weekly statements"
      );
    }
  };

  if (loading) {
    return <Loader />;
  }
  const filteredOrders = ordersPerProduct.filter((item) =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-2  ">
      <main className=" grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid grid-cols-2 mb-2 gap-2">

              {/* Summary Counts */}
  <div className="grid grid-cols-2 gap-4  mt-2 md:mt-0">
    <Card className="p-2 flex-1 min-w-[150px]">
      <CardHeader>
        <CardTitle className="text-stone-500 text-sm">Total Products</CardTitle>
        <CardTitle className="text-2xl">
          {ordersPerProduct.length}
        </CardTitle>
      </CardHeader>
    </Card>
    <Card className="p-2 flex-1 min-w-[150px]">
      <CardHeader>
        <CardTitle className="text-stone-500 text-sm">Total Orders</CardTitle>
        <CardTitle className="text-2xl">
          {ordersPerProduct.reduce((sum, item) => sum + item.totalOrders, 0)}
        </CardTitle>
      </CardHeader>
    </Card>
  </div>
  {/* Filter Input */}
  <div className="flex justify-end items-end">
  <Input
    type="text"
    placeholder="Filter by product..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-primary "
  />

  </div>


</div>

          {/* Orders Per Product (Current Month) */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-stone-500">
                Orders Per Product (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders && filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-3 py-2 border-b">Product</th>
                        <th className="px-3 py-2 border-b">Total Orders</th>
                        <th className="px-3 py-2 border-b">Invoice Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="px-3 py-2 border-b">{item.product}</td>
                          <td className="px-3 py-2 border-b">
                            {item.totalOrders}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {item.invoiceCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No product orders available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Orders;
