import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BillPreview from "@/components/BillPreview";
import { BillItem } from "./Billing";

interface SavedBill {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  paymentMode: string;
  total: number;
  date: string;
  time: string;
}

const PastBills = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<SavedBill[]>([]);
  const [selectedBill, setSelectedBill] = useState<SavedBill | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    loadBills();
  }, [navigate]);

  const loadBills = () => {
    const savedBills = localStorage.getItem("savedBills");
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }
  };

  const handleViewBill = (bill: SavedBill) => {
    setSelectedBill(bill);
    setShowPreview(true);
  };

  const handleDeleteBill = (billId: string) => {
    const updatedBills = bills.filter(bill => bill.id !== billId);
    setBills(updatedBills);
    localStorage.setItem("savedBills", JSON.stringify(updatedBills));
  };

  const handlePrintBill = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 print:hidden">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/billing")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-primary">Past Bills</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8 print:hidden">
        {bills.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No bills saved yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bills.map((bill) => (
              <Card key={bill.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{bill.invoiceNumber}</span>
                    <span className="text-sm text-muted-foreground font-normal">
                      {bill.date} {bill.time}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">{bill.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment</p>
                      <p className="font-medium">{bill.paymentMode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">₹{bill.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBill(bill)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBill(bill.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedBill && (
            <div>
              <div className="print:hidden mb-4">
                <Button onClick={handlePrintBill} className="w-full">
                  Print Bill
                </Button>
              </div>
              <BillPreview
                invoiceNumber={selectedBill.invoiceNumber}
                customerName={selectedBill.customerName}
                customerPhone={selectedBill.customerPhone}
                items={selectedBill.items}
                paymentMode={selectedBill.paymentMode}
                total={selectedBill.total}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PastBills;
