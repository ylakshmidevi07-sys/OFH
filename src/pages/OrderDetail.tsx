import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Package, Clock, Truck, CheckCircle2, XCircle,
  MapPin, Mail, Phone, Copy, CreditCard, Banknote,
  RefreshCw, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useCartFacade } from "@/hooks/useCartFacade";
import { useTrackOrder } from "@/hooks/queries";
import { ordersApi } from "@/api/orders.api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns/format";

// ─── Local display types ───────────────────────────────────────────────────

interface OrderItem {
  id: string;
  name: string;
  price: number;
  unit?: string;
  image: string;
  quantity: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "card" | "cod";
  createdAt: string;
  estimatedDelivery: string;
  shippingAddress: ShippingAddress;
  promoCode?: string;
}

// ─── Status config ─────────────────────────────────────────────────────────

const statusConfig: Record<Order["status"], { label: string; icon: React.ElementType; className: string }> = {
  processing: { label: "Processing", icon: Clock,        className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  confirmed:  { label: "Confirmed",  icon: CheckCircle2, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  shipped:    { label: "Shipped",    icon: Truck,        className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  delivered:  { label: "Delivered",  icon: CheckCircle2, className: "bg-primary/10 text-primary border-primary/20" },
  cancelled:  { label: "Cancelled",  icon: XCircle,      className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const statusSteps = ["processing", "confirmed", "shipped", "delivered"] as const;

const toDisplayStatus = (raw: string): Order["status"] => {
  const s = raw.toLowerCase();
  if (s === "pending" || s === "processing") return "processing";
  if (s === "confirmed") return "confirmed";
  if (s === "shipped") return "shipped";
  if (s === "delivered") return "delivered";
  return "cancelled";
};

// ─── Component ────────────────────────────────────────────────────────────

const OrderDetail = () => {
  const { id, orderNumber } = useParams<{ id?: string; orderNumber?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCartFacade();

  const [statusUpdate, setStatusUpdate] = useState<string | null>(null);
  const prevStatusRef                 = useRef<string | null>(null);

  // Determine the identifier: account route uses orderNumber param, others use id
  const identifier = orderNumber || id || "";
  const isAccountRoute = window.location.pathname.includes("/account/orders/");

  // ── Map raw API order to local display shape ────────────────────────────
  const mapApiOrder = useCallback((raw: any): Order => {
    const addr = (raw.shippingAddress as any) || {};
    return {
      id: raw.id,
      orderNumber: raw.orderNumber || raw.id,
      items: (raw.items || []).map((item: any) => ({
        id: item.id,
        name: item.product?.name || "",
        price: item.price,
        unit: item.unit,
        image: item.product?.images?.[0] || "/placeholder.svg",
        quantity: item.quantity,
      })),
      subtotal: raw.subtotal ?? 0,
      shipping: raw.shipping ?? 0,
      tax: raw.tax ?? 0,
      discount: raw.discount ?? 0,
      total: raw.totalAmount ?? 0,
      status: toDisplayStatus(raw.status),
      paymentMethod: (raw.shippingAddress?.paymentMethod === "cod" ? "cod" : "card") as Order["paymentMethod"],
      createdAt: raw.createdAt,
      estimatedDelivery: raw.estimatedDelivery || new Date(Date.now() + 4 * 86400000).toISOString(),
      shippingAddress: {
        firstName: addr.firstName || "",
        lastName:  addr.lastName  || "",
        email:     addr.email     || "",
        phone:     addr.phone     || "",
        address:   addr.address   || "",
        city:      addr.city      || "",
        state:     addr.state     || "",
        zipCode:   addr.zipCode   || "",
      },
      promoCode: raw.promoCode,
    };
  }, []);

  // ── Fetch order via React Query hook ────────────────────────────────────
  const { data: rawOrder, isLoading: loading } = useTrackOrder(identifier);

  const order = useMemo<Order | null>(() => {
    if (!rawOrder) return null;
    const mapped = mapApiOrder(rawOrder);
    if (prevStatusRef.current === null) prevStatusRef.current = mapped.status;
    return mapped;
  }, [rawOrder, mapApiOrder]);

  // ── Polling for status updates (replaces Supabase realtime) ────────────
  useEffect(() => {
    if (!order || order.status === "delivered" || order.status === "cancelled") return;

    const poll = setInterval(async () => {
      try {
        const raw = await ordersApi.trackOrder(order.orderNumber);
        const newStatus = toDisplayStatus(raw.status);
        if (newStatus !== prevStatusRef.current) {
          setStatusUpdate(newStatus);
          setTimeout(() => setStatusUpdate(null), 4000);
          toast({ title: `Order ${statusConfig[newStatus]?.label}`, description: `Your order ${order.orderNumber} status has been updated.` });
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Order ${statusConfig[newStatus]?.label}`, { body: `Your order ${order.orderNumber} is now ${newStatus}.`, icon: "/favicon.ico" });
          }
          prevStatusRef.current = newStatus;
        }
      } catch { /* silently ignore polling errors */ }
    }, 30_000); // poll every 30 s

    return () => clearInterval(poll);
  }, [order?.orderNumber, order?.status, toast]);

  // ── Push notification permission ────────────────────────────────────────
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const perm = await Notification.requestPermission();
      if (perm === "granted") toast({ title: "Notifications enabled", description: "You'll be notified when your order status changes." });
    }
  }, [toast]);

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      toast({ title: "Copied!", description: "Order number copied to clipboard." });
    }
  };

  const handleBack = () => navigate(isAccountRoute ? "/account/orders" : "/orders");

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
          <div className="container mx-auto px-6">
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────────
  if (!order) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <div className="text-center px-6">
            <Package className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">Order not found</h1>
            <p className="font-body text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
            <Button onClick={handleBack}>View All Orders</Button>
          </div>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;
  const currentStepIndex = order.status === "cancelled" ? -1 : statusSteps.indexOf(order.status as typeof statusSteps[number]);

  return (
    <PageTransition>
      <Helmet>
        <title>Order {order.orderNumber} | OFH</title>
        <meta name="description" content={`View details for order ${order.orderNumber}`} />
      </Helmet>
      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Button variant="ghost" className="mb-4" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back to Orders
            </Button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{order.orderNumber}</h1>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyOrderId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-body text-muted-foreground mt-1">
                  Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <Badge variant="outline" className={`${statusConfig[order.status].className} gap-1.5 text-sm px-4 py-2`}>
                <StatusIcon className="h-4 w-4" />
                {statusConfig[order.status].label}
              </Badge>
            </div>
          </motion.div>

          {/* Push notification opt-in */}
          {"Notification" in window && Notification.permission !== "granted" && (
            <div className="mb-6">
              <Button variant="outline" size="sm" onClick={requestNotificationPermission} className="gap-2">
                <Bell className="h-4 w-4" />Enable Push Notifications
              </Button>
            </div>
          )}

          {/* Status update flash */}
          <AnimatePresence>
            {statusUpdate && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-6 bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm font-medium text-primary">
                  Order status updated to <strong>{statusConfig[statusUpdate as Order["status"]]?.label || statusUpdate}</strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Timeline */}
              {order.status !== "cancelled" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="font-display text-lg font-bold text-foreground mb-6">Order Progress</h2>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-4 left-0 right-0 h-1 bg-secondary -z-10" />
                    <div className="absolute top-4 left-0 h-1 bg-primary -z-10 transition-all duration-500"
                      style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                    {statusSteps.map((step, index) => {
                      const StepIcon = statusConfig[step].icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent   = index === currentStepIndex;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"} ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                            <StepIcon className="h-4 w-4" />
                          </div>
                          <span className={`font-body text-xs text-center ${isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}`}>{statusConfig[step].label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {order.status !== "delivered" && (
                    <p className="font-body text-sm text-muted-foreground mt-6 text-center">
                      Estimated delivery: {format(new Date(order.estimatedDelivery), "MMMM d, yyyy")}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Cancelled notice */}
              {order.status === "cancelled" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-destructive" />
                    <div>
                      <h2 className="font-display text-lg font-bold text-destructive">Order Cancelled</h2>
                      <p className="font-body text-sm text-destructive/80">This order has been cancelled and will not be fulfilled.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Order Items */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-foreground mb-6">Order Items ({order.items.length})</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                        <p className="font-body text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                      </div>
                      <span className="font-display font-semibold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment method */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-foreground mb-4">Payment Method</h2>
                <div className="flex items-center gap-3">
                  {order.paymentMethod === "card" ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><CreditCard className="h-5 w-5 text-primary" /></div>
                      <div><p className="font-display font-semibold text-foreground">Credit/Debit Card</p><p className="font-body text-sm text-muted-foreground">•••• •••• •••• ••••</p></div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Banknote className="h-5 w-5 text-primary" /></div>
                      <div><p className="font-display font-semibold text-foreground">Cash on Delivery</p><p className="font-body text-sm text-muted-foreground">Pay when you receive</p></div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Order summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{order.subtotal.toFixed(2)}</span></div>
                  {order.discount > 0 && (
                    <div className="flex justify-between font-body text-sm"><span className="text-primary">Discount {order.promoCode && `(${order.promoCode})`}</span><span className="text-primary">-₹{order.discount.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Tax</span><span className="text-foreground">₹{order.tax.toFixed(2)}</span></div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-display font-bold text-foreground">Total</span>
                    <span className="font-display text-xl font-bold text-primary">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Shipping address */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-foreground mb-4">Shipping Address</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="font-body text-sm">
                      <p className="text-foreground font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                      <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    </div>
                  </div>
                  {order.shippingAddress.email && (
                    <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="font-body text-sm text-muted-foreground">{order.shippingAddress.email}</span></div>
                  )}
                  {order.shippingAddress.phone && (
                    <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="font-body text-sm text-muted-foreground">{order.shippingAddress.phone}</span></div>
                  )}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
                <Button className="w-full" onClick={() => {
                  order.items.forEach((item) => addItem({ id: item.id, name: item.name, price: item.price, unit: item.unit || "each", image: item.image, category: "" }));
                  toast({ title: "Items added to cart!", description: `${order.items.length} item(s) added.` });
                }}>
                  <RefreshCw className="h-4 w-4 mr-2" />Reorder All Items
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default OrderDetail;
