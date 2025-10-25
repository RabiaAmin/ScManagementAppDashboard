import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllInvoicesOFThisMonth,
  deleteInvoice,
  updateInvoice,
} from "@/store/slices/invoiceSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function AllInvoices() {
  const dispatch = useDispatch();
  const { invoices, loading, totalPages, totalRecords } = useSelector(
    (state) => state.invoice
  );

  const [page, setPage] = useState(1);
  const [limit] = useState(40);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInvoices(page, limit);
  }, [page]);

  const fetchInvoices = (page, limit) => {
    dispatch(getAllInvoicesOFThisMonth(page, limit));
  };

  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredInvoices = (sortedInvoices || []).filter((invoice) =>
    invoice?.poNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      dispatch(deleteInvoice(id));
    }
  };

  const handleStatusChange = (invoice, newStatus) => {
    const updatedInvoice = { ...invoice, status: newStatus };
    dispatch(updateInvoice(invoice._id, updatedInvoice));
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Total Invoices:{" "}
          <span className="text-primary font-bold">{totalRecords}</span>
        </h2>
      </div>

      {/* Card with Table */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
            <CardTitle className="text-xl font-bold text-stone-800">
              Invoice List
            </CardTitle>
            <Input
              placeholder="Filter by Po Number..."
              className="w-full sm:w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No invoices found.
            </p>
          ) : (
            <>
              {/* Responsive Table Container */}
              <div className="w-full overflow-x-auto rounded-lg border border-stone-200">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No.</TableHead>
                      <TableHead>Po No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice._id}>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.poNumber}</TableCell>
                        <TableCell>
                          {new Date(invoice.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{invoice.items.length}</TableCell>
                        <TableCell>
                          R{invoice.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={invoice.status}
                            onValueChange={(value) =>
                              handleStatusChange(invoice, value)
                            }
                          >
                            <SelectTrigger className="w-[110px] sm:w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Sent">Sent</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="flex justify-center space-x-2 sm:space-x-3">
                          <Link to={`/invoice/${invoice._id}`}>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:bg-primary/10"
                            >
                              <Eye className="w-5 h-5 text-blue-600" />
                            </Button>
                          </Link>
                          <Link to={`/invoice/update/${invoice._id}`}>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:bg-primary/10"
                            >
                              <Pencil className="w-5 h-5 text-green-600" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-primary/10"
                            onClick={() => handleDelete(invoice._id)}
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-wrap justify-center items-center mt-4 gap-3 sm:gap-4">
                <Button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Prev
                </Button>
                <span className="text-sm sm:text-base">
                  Page {page} of {totalPages || 1}
                </span>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AllInvoices;
