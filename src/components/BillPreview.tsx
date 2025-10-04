import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BillItem } from "@/pages/Billing";
import shopLogo from "@/assets/bhasa_logo.jpg";

interface BillPreviewProps {
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  paymentMode: string;
  total: number;
}

const BillPreview = ({
  invoiceNumber,
  customerName,
  customerPhone,
  items,
  paymentMode,
  total,
}: BillPreviewProps) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <Card className="p-8 bg-card print:shadow-none print:border-0" id="bill-preview">
      {/* Shop Header */}
      <div className="text-center mb-6 space-y-3">
        <img 
          src={shopLogo} 
          alt="Bhasa Mens Wear Logo" 
          className="h-24 w-24 mx-auto object-contain"
        />
        <h1 className="text-3xl font-bold text-primary">BHASA MENS WEAR</h1>
        <p className="text-sm text-muted-foreground">
          Near Chatrapati Shivaji Maharaj Chowk
        </p>
        <p className="text-sm text-muted-foreground">
          Nandura, Dist. Buldhana, Maharashtra 443404
        </p>
      </div>

      <Separator className="my-4" />

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="font-semibold">Invoice No:</p>
          <p className="text-muted-foreground">{invoiceNumber || '-'}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Date & Time:</p>
          <p className="text-muted-foreground">{currentDate}</p>
          <p className="text-muted-foreground">{currentTime}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-6 space-y-2 text-sm">
        <div>
          <span className="font-semibold">Customer Name: </span>
          <span className="text-muted-foreground">{customerName || '-'}</span>
        </div>
        <div>
          <span className="font-semibold">Mobile Number: </span>
          <span className="text-muted-foreground">{customerPhone || '-'}</span>
        </div>
        <div>
          <span className="font-semibold">Payment Mode: </span>
          <span className="text-muted-foreground">{paymentMode}</span>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 font-semibold">Sr.</th>
              <th className="text-left py-2 font-semibold">Item</th>
              <th className="text-right py-2 font-semibold">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{item.item}</td>
                  <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-8 text-muted-foreground">
                  No items added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-bold mb-8">
        <span>Total Amount:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground space-y-1 pt-4 border-t border-border">
        <p className="font-semibold">Thank you for shopping with us!</p>
        <p>Visit Again</p>
      </div>
    </Card>
  );
};

export default BillPreview;
