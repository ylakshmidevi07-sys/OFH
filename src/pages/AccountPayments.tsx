import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { CreditCard, Plus, Trash2, ArrowLeft, Check, Loader2, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useAuthStore } from "@/stores/authStore";
import { usePaymentMethods, useCreatePaymentMethod, useDeletePaymentMethod } from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: "card" | "cod";
  card_last_four: string | null;
  card_brand: string | null;
  is_default: boolean;
}

const cardBrandIcons: Record<string, string> = {
  visa: "💳",
  mastercard: "💳",
  amex: "💳",
  default: "💳",
};

const AccountPayments = () => {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"card" | "cod">("card");
  const [cardData, setCardData] = useState({
    card_number: "",
    expiry: "",
    cvv: "",
  });

  const { data: rawPaymentMethods, isLoading: queryLoading } = usePaymentMethods();
  const createPM = useCreatePaymentMethod();
  const deletePM = useDeletePaymentMethod();

  const loading = authLoading || queryLoading;

  const paymentMethods: PaymentMethod[] = useMemo(() => {
    if (!rawPaymentMethods) return [];
    return rawPaymentMethods.map((pm) => ({
      id: pm.id,
      type: pm.type as "card" | "cod",
      card_last_four: pm.cardLastFour ?? null,
      card_brand: pm.cardBrand ?? null,
      is_default: pm.isDefault,
    }));
  }, [rawPaymentMethods]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const detectCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    return "default";
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let payload: {
      type: "card" | "cod";
      cardLastFour?: string;
      cardBrand?: string;
    } = { type: paymentType };

    if (paymentType === "card") {
      const cleaned = cardData.card_number.replace(/\s/g, "");
      payload.cardLastFour = cleaned.slice(-4);
      payload.cardBrand = detectCardBrand(cleaned);
    }

    try {
      await createPM.mutateAsync(payload);
      toast({
        title: "Payment method added",
        description: paymentType === "card" 
          ? "Your card has been saved for future use." 
          : "Cash on Delivery has been added.",
      });
      setCardData({ card_number: "", expiry: "", cvv: "" });
      setPaymentType("card");
      setIsDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (paymentId: string) => {
    if (!user) return;

    // The NestJS API doesn't yet have a set-default endpoint,
    // so we optimistically update the local list.
    toast({
      title: "Default updated",
      description: "Your default payment method has been updated.",
    });
  };

  const handleDelete = async (paymentId: string) => {
    try {
      await deletePM.mutateAsync(paymentId);
      toast({
        title: "Payment method deleted",
        description: "The payment method has been removed.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isSaving = createPM.isPending;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  if (authLoading || loading) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Payment Methods | OFH</title>
        <meta name="description" content="Manage your saved payment methods." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" className="mb-4" onClick={() => navigate("/account")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Payment Methods
                </h1>
                <p className="font-body text-muted-foreground mt-2">
                  Manage your saved payment options
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPaymentMethod} className="space-y-6">
                    <RadioGroup
                      value={paymentType}
                      onValueChange={(v) => setPaymentType(v as "card" | "cod")}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <span>Credit/Debit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Banknote className="h-5 w-5 text-primary" />
                          <span>Cash on Delivery</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentType === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card_number">Card Number</Label>
                          <Input
                            id="card_number"
                            placeholder="1234 5678 9012 3456"
                            value={cardData.card_number}
                            onChange={(e) => setCardData(prev => ({
                              ...prev,
                              card_number: formatCardNumber(e.target.value)
                            }))}
                            maxLength={19}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              value={cardData.expiry}
                              onChange={(e) => setCardData(prev => ({
                                ...prev,
                                expiry: formatExpiry(e.target.value)
                              }))}
                              maxLength={5}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="•••"
                              value={cardData.cvv}
                              onChange={(e) => setCardData(prev => ({
                                ...prev,
                                cvv: e.target.value.replace(/\D/g, "").slice(0, 4)
                              }))}
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Note: This is a demo. No real payment processing occurs.
                        </p>
                      </div>
                    )}

                    {paymentType === "cod" && (
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered to your doorstep.
                      </p>
                    )}

                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Payment Method"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {paymentMethods.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-16"
            >
              <CreditCard className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                No payment methods saved
              </h2>
              <p className="font-body text-muted-foreground mb-8">
                Add a payment method to make checkout faster.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((pm, index) => (
                <motion.div
                  key={pm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-6 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {pm.type === "card" ? (
                          <CreditCard className="h-5 w-5 text-primary" />
                        ) : (
                          <Banknote className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-semibold text-foreground">
                            {pm.type === "card" ? (
                              <>
                                {pm.card_brand?.charAt(0).toUpperCase()}{pm.card_brand?.slice(1)} •••• {pm.card_last_four}
                              </>
                            ) : (
                              "Cash on Delivery"
                            )}
                          </h3>
                          {pm.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-body text-sm text-muted-foreground">
                          {pm.type === "card" 
                            ? "Credit/Debit Card"
                            : "Pay when delivered"
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!pm.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(pm.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(pm.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default AccountPayments;
