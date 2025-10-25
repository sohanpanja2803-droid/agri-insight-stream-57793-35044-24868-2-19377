import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Mark user as authenticated
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authTimestamp", new Date().toISOString());
      
      toast({
        title: "Payment Successful! 🎉",
        description: "Welcome to FieldSense. Redirecting to your dashboard...",
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/free-trial")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Secure Payment</CardTitle>
                  <CardDescription>
                    Security deposit: ₹999 (Refundable)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  This is a refundable security deposit. You'll get full access to all features
                  during your 45-day free trial. The deposit will be refunded at the end of the trial period.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={19}
                      value={paymentData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "");
                        const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                        setPaymentData({ ...paymentData, cardNumber: formatted });
                      }}
                    />
                    <CreditCard className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    required
                    value={paymentData.cardName}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, cardName: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      required
                      maxLength={5}
                      value={paymentData.expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const formatted = value.length >= 2 
                          ? `${value.slice(0, 2)}/${value.slice(2, 4)}`
                          : value;
                        setPaymentData({ ...paymentData, expiryDate: formatted });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      required
                      maxLength={3}
                      value={paymentData.cvv}
                      onChange={(e) =>
                        setPaymentData({ 
                          ...paymentData, 
                          cvv: e.target.value.replace(/\D/g, "") 
                        })
                      }
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Pay ₹999"}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  <Lock className="inline h-3 w-3 mr-1" />
                  Your payment information is secure and encrypted
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Payment;
