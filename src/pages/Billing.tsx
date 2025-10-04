import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { LogOut, Plus, Trash2, Send, Printer } from "lucide-react";
import BillPreview from "@/components/BillPreview";

export interface BillItem {
  id: string;
  item: string;
  price: number;
}

const Billing = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [items, setItems] = useState<BillItem[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }

    // Generate invoice number
    const today = new Date();
    const invoiceNo = `INV${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setInvoiceNumber(invoiceNo);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleAddItem = () => {
    if (!selectedItem || !price) {
      toast({
        title: "Missing Information",
        description: "Please select an item and enter price",
        variant: "destructive",
      });
      return;
    }

    const newItem: BillItem = {
      id: Date.now().toString(),
      item: selectedItem,
      price: parseFloat(price),
    };

    setItems([...items, newItem]);
    setSelectedItem("");
    setPrice("");
    
    toast({
      title: "Item Added",
      description: `${selectedItem} added to bill`,
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const handleSendWhatsApp = () => {
    if (!customerName || !customerPhone || items.length === 0) {
      toast({
        title: "Incomplete Bill",
        description: "Please add customer details and items",
        variant: "destructive",
      });
      return;
    }

    const billText = `*BHASA MENS WEAR*\n\nInvoice: ${invoiceNumber}\nDate: ${new Date().toLocaleDateString()}\n\nCustomer: ${customerName}\n\n*Items:*\n${items.map(item => `${item.item} - ₹${item.price}`).join('\n')}\n\n*Total: ₹${calculateTotal()}*\n\nPayment Mode: ${paymentMode}\n\nThank you for shopping with us!`;
    
    const whatsappUrl = `https://wa.me/91${customerPhone}?text=${encodeURIComponent(billText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    if (!customerName || items.length === 0) {
      toast({
        title: "Incomplete Bill",
        description: "Please add customer details and items",
        variant: "destructive",
      });
      return;
    }
    window.print();
  };

  const handleNewBill = () => {
    setCustomerName("");
    setCustomerPhone("");
    setItems([]);
    setPaymentMode("Cash");
    const today = new Date();
    const newInvoiceNo = `INV${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setInvoiceNumber(newInvoiceNo);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 print:hidden">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">BHASA MENS WEAR</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Billing Form */}
          <div className="space-y-6 print:hidden">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">WhatsApp Number</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMode">Payment Mode</Label>
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item">Select Item</Label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shirt">Shirt</SelectItem>
                      <SelectItem value="Pant">Pant</SelectItem>
                      <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                      <SelectItem value="Under Garments">Under Garments</SelectItem>
                      <SelectItem value="Night Pant">Night Pant</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Bill Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-secondary rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-sm text-muted-foreground">₹{item.price}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSendWhatsApp}
                className="flex-1"
                disabled={items.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Send on WhatsApp
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1"
                disabled={items.length === 0}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Bill
              </Button>
            </div>
            
            <Button
              onClick={handleNewBill}
              variant="outline"
              className="w-full"
            >
              New Bill
            </Button>
          </div>

          {/* Bill Preview */}
          <div>
            <BillPreview
              invoiceNumber={invoiceNumber}
              customerName={customerName}
              customerPhone={customerPhone}
              items={items}
              paymentMode={paymentMode}
              total={calculateTotal()}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
