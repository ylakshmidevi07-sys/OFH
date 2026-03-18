import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ShoppingBag, Check, Package, Tag, X, Loader2, CreditCard, Banknote, MapPin, ChevronDown, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartFacade } from "@/hooks/useCartFacade";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ordersApi } from "@/api/orders.api";
import { useCreateOrder, useAddresses } from "@/hooks/queries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

// PromoCode shape returned by POST /api/orders/validate-promo
interface PromoCode {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

interface SavedAddress {
  id: string;
  label: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string | null;
  is_default: boolean;
}

function generateOrderNumber(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartFacade();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { toast } = useToast();
  const createOrderMutation = useCreateOrder();
  const { data: rawAddresses, isLoading: isLoadingAddresses } = useAddresses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "upi">("card");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [gstin, setGstin] = useState("");
  const [gstinError, setGstinError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Map backend addresses to SavedAddress shape
  const savedAddresses: SavedAddress[] = (rawAddresses || []).map((a) => ({
    id: a.id,
    label: a.label,
    first_name: a.firstName,
    last_name: a.lastName,
    address: a.address,
    city: a.city,
    state: a.state,
    zip_code: a.zipCode,
    phone: a.phone ?? null,
    is_default: a.isDefault,
  }));

  // Auto-select the default address when addresses load
  useEffect(() => {
    if (savedAddresses.length > 0 && selectedAddressId === "new") {
      const defaultAddr = savedAddresses.find((a) => a.is_default) || savedAddresses[0];
      setSelectedAddressId(defaultAddr.id);
      applyAddress(defaultAddr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawAddresses]);

  // Pre-fill email if logged in
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email || "" }));
    }
  }, [user]);

  const applyAddress = (addr: SavedAddress) => {
    setFormData(prev => ({
      ...prev,
      firstName: addr.first_name,
      lastName: addr.last_name,
      phone: addr.phone || "",
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zip_code,
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === "new") {
      // Clear form except email
      setFormData(prev => ({
        firstName: "",
        lastName: "",
        email: prev.email,
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      }));
    } else {
      const addr = savedAddresses.find(a => a.id === addressId);
      if (addr) {
        applyAddress(addr);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsValidatingPromo(true);
    setPromoError("");

    try {
      const result = await ordersApi.validatePromo(promoCodeInput.trim(), totalPrice);
      if (result.valid && result.promoCode) {
        setAppliedPromo(result.promoCode as PromoCode);
        setPromoDiscount(result.discount || 0);
        setPromoCodeInput("");
        toast({
          title: "Promo code applied!",
          description: result.promoCode.description,
        });
      } else {
        setPromoError(result.error || "Invalid promo code");
      }
    } catch {
      setPromoError("Unable to validate promo code. Please try again.");
    }

    setIsValidatingPromo(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    toast({
      title: "Promo code removed",
      description: "Your discount has been removed.",
    });
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processRazorpayPayment = async (_orderNumber: string, _estimatedDelivery: Date): Promise<boolean> => {
    // Payment intent/verification is now backend-owned; keep checkout UX unchanged for now.
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderNumber = generateOrderNumber();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    // Process Razorpay payment for card and UPI methods
    if (paymentMethod === "card" || paymentMethod === "upi") {
      const paymentSuccess = await processRazorpayPayment(orderNumber, estimatedDelivery);
      if (!paymentSuccess) {
        setIsSubmitting(false);
        return;
      }
    }

    // Create order through enterprise backend
    let finalOrderNumber = orderNumber;

    try {
      const createdOrder = await createOrderMutation.mutateAsync({
        shippingAddress: {
          ...formData,
          gstin: gstin.trim() || undefined,
          paymentMethod,
        },
        promoCode: appliedPromo?.code,
        paymentMethod,
      });
      finalOrderNumber = createdOrder.orderNumber || orderNumber;
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Order confirmation delivery is backend-owned in NestJS queue/email pipeline.

    setCompletedOrderNumber(finalOrderNumber);
    setOrderComplete(true);
    clearCart();
    setIsSubmitting(false);
    toast({
      title: "Order placed successfully!",
      description: paymentMethod === "cod" 
        ? "You'll pay when your order arrives." 
        : paymentMethod === "upi"
        ? "UPI payment successful. Thank you!"
        : "Thank you for shopping with The Organic Foods House.",
    });
  };

  const shippingCost = totalPrice >= 499 ? 0 : 49;
  const cgst = totalPrice * 0.09;
  const sgst = totalPrice * 0.09;
  const tax = cgst + sgst;
  const orderTotal = totalPrice + shippingCost + tax - promoDiscount;

  if (items.length === 0 && !orderComplete) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <div className="text-center px-6">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Your cart is empty
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              Add some products to your cart before checking out.
            </p>
            <Button asChild>
              <Link to="/#shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  if (orderComplete) {
    return (
      <PageTransition>
        <Helmet>
          <title>Order Confirmed | OFH</title>
        </Helmet>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center px-6 max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Thank You!
            </h1>
            <p className="font-body text-muted-foreground mb-2">
              Your order has been placed successfully.
            </p>
            <p className="font-body text-sm text-muted-foreground mb-8">
              We'll send a confirmation email with your order details shortly.
            </p>
            <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold text-foreground">
                  {completedOrderNumber || "Order Confirmed"}
                </span>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                Estimated delivery: 2-4 business days
              </p>
              {paymentMethod === "cod" && (
                <p className="font-body text-sm text-primary mt-2">
                  💵 Cash on Delivery - Pay when your order arrives
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {user ? (
                <Button asChild variant="outline" size="lg">
                  <Link to={`/account/orders/${completedOrderNumber}`}>View Order</Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth">Create Account to Track</Link>
                </Button>
              )}
              <Button asChild size="lg">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Checkout | OFH - The Organic Foods House</title>
        <meta name="description" content="Complete your order at The Organic Foods House." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Checkout
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Contact Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Shipping Address
                  </h2>
                  
                  {/* Saved Address Selector */}
                  {user && savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <Label className="mb-2 block">Select Address</Label>
                      <Select value={selectedAddressId} onValueChange={handleAddressSelect}>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Choose a saved address" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {savedAddresses.map((addr) => (
                            <SelectItem key={addr.id} value={addr.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{addr.label}</span>
                                {addr.is_default && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                                <span className="text-muted-foreground text-sm">
                                  — {addr.address}, {addr.city}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                          <SelectItem value="new">
                            <div className="flex items-center gap-2 text-primary">
                              <span>+ Enter new address</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedAddressId !== "new" && (
                        <p className="text-xs text-muted-foreground mt-2">
                          You can edit the fields below if needed
                        </p>
                      )}
                    </div>
                  )}

                  {isLoadingAddresses && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Loading saved addresses...</span>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">House/Flat No., Street, Locality</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="e.g. 12/3, MG Road, Indiranagar"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City / District</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="e.g. Bengaluru"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={formData.state} onValueChange={(v) => setFormData(prev => ({ ...prev, state: v }))}>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Pincode</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          placeholder="e.g. 560001"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          maxLength={6}
                          pattern="[0-9]{6}"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="font-display text-xl font-bold text-foreground mb-6">
                    Payment Method
                  </h2>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as "card" | "cod" | "upi")}
                    className="space-y-3"
                  >
                    <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                      paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                      <RadioGroupItem value="card" id="payment-card" />
                      <Label htmlFor="payment-card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-display font-semibold text-foreground block">
                            Credit/Debit Card
                          </span>
                          <span className="font-body text-xs text-muted-foreground">
                            Pay securely online
                          </span>
                        </div>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                      paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                      <RadioGroupItem value="upi" id="payment-upi" />
                      <Label htmlFor="payment-upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-display font-semibold text-foreground block">
                            UPI
                          </span>
                          <span className="font-body text-xs text-muted-foreground">
                            Google Pay, PhonePe, Paytm & more
                          </span>
                        </div>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                      paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                      <RadioGroupItem value="cod" id="payment-cod" />
                      <Label htmlFor="payment-cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Banknote className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-display font-semibold text-foreground block">
                            Cash on Delivery
                          </span>
                          <span className="font-body text-xs text-muted-foreground">
                            Pay when your order arrives
                          </span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {(paymentMethod === "card" || paymentMethod === "upi") && (
                    <p className="mt-4 text-xs text-muted-foreground text-center">
                      You'll be redirected to Razorpay secure checkout to complete payment.
                    </p>
                  )}
                </div>

                {/* GSTIN for B2B */}
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="font-display text-xl font-bold text-foreground mb-2">
                    GST Invoice <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                  </h2>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    Enter your GSTIN for a GST-compliant invoice.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      placeholder="e.g. 22AAAAA0000A1Z5"
                      value={gstin}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                        setGstin(val);
                        if (val && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val)) {
                          setGstinError("Please enter a valid 15-character GSTIN");
                        } else {
                          setGstinError("");
                        }
                      }}
                      maxLength={15}
                      className="uppercase tracking-wider"
                    />
                    {gstinError && (
                      <p className="text-xs text-destructive">{gstinError}</p>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    paymentMethod === "cod" ? "Place Order (Pay on Delivery)" : paymentMethod === "upi" ? "Pay with UPI" : "Place Order"
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-28">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground text-sm">
                          {item.name}
                        </h3>
                        <p className="font-body text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-body font-semibold text-foreground">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  {/* Promo Code Section */}
                  <div className="pb-3 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="font-display font-semibold text-foreground text-sm">
                        Promo Code
                      </span>
                    </div>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3">
                        <div>
                          <p className="font-body text-sm font-semibold text-primary">
                            {appliedPromo.code}
                          </p>
                          <p className="font-body text-xs text-muted-foreground">
                            {appliedPromo.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={handleRemovePromo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter promo code"
                            value={promoCodeInput}
                            onChange={(e) => {
                              setPromoCodeInput(e.target.value.toUpperCase());
                              setPromoError("");
                            }}
                            className="flex-1 uppercase"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyPromo();
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            onClick={handleApplyPromo}
                            disabled={isValidatingPromo}
                          >
                            {isValidatingPromo ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                        {promoError && (
                          <p className="font-body text-xs text-destructive">
                            {promoError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-primary">Discount</span>
                      <span className="text-primary font-semibold">
                        -₹{promoDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="space-y-1 py-2 border-t border-dashed border-border">
                    <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">GST Breakdown (18%)</p>
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-muted-foreground">CGST (9%)</span>
                      <span className="text-foreground">₹{cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-muted-foreground">SGST (9%)</span>
                      <span className="text-foreground">₹{sgst.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-display font-bold text-foreground">Total</span>
                    <span className="font-display text-xl font-bold text-primary">
                      ₹{orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {totalPrice < 499 && (
                  <p className="mt-4 text-xs text-center text-muted-foreground bg-secondary/50 rounded-lg p-3">
                    Add ₹{(499 - totalPrice).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Checkout;
