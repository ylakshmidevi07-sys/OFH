import { useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Package, ChevronRight, Clock, Truck, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useOrders } from "@/hooks/queries/useOrders";
import { format } from "date-fns/format";
import { OrderStatus } from "@/types";

type DisplayStatus = "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";

const statusConfig: Record<DisplayStatus, { label: string; icon: React.ElementType; className: string }> = {
  processing: { label: "Processing", icon: Clock,         className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  confirmed:  { label: "Confirmed",  icon: CheckCircle2,  className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  shipped:    { label: "Shipped",    icon: Truck,         className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  delivered:  { label: "Delivered",  icon: CheckCircle2,  className: "bg-primary/10 text-primary border-primary/20" },
  cancelled:  { label: "Cancelled",  icon: XCircle,       className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const toDisplayStatus = (status: string): DisplayStatus => {
  const s = status.toLowerCase();
  if (s === "pending" || s === "processing") return "processing";
  if (s === "confirmed") return "confirmed";
  if (s === "shipped") return "shipped";
  if (s === "delivered") return "delivered";
  return "cancelled";
};

const OrderHistory = () => {
  const { data, isLoading } = useOrders({ page: 1 });
  const orders = useMemo(() => data?.orders || [], [data]);

  return (
    <PageTransition>
      <Helmet>
        <title>Order History | OFH - The Organic Foods House</title>
        <meta name="description" content="View your past orders and track their status." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Order History</h1>
            <p className="font-body text-muted-foreground mt-2">Track and view your past orders</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center py-16">
              <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">No orders yet</h2>
              <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">Once you place an order, it will appear here so you can track its status.</p>
              <Button asChild><Link to="/products">Start Shopping</Link></Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const displayStatus = toDisplayStatus(order.status);
                const cfg = statusConfig[displayStatus];
                const StatusIcon = cfg.icon;
                const firstImage = order.items?.[0]?.product?.images?.[0] || "/placeholder.svg";
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/orders/${order.orderNumber || order.id}`}
                      className="block bg-card rounded-2xl p-6 shadow-soft hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-body text-xs text-muted-foreground mb-1">Order Number</p>
                          <p className="font-display font-bold text-foreground">{order.orderNumber}</p>
                        </div>
                        <Badge variant="outline" className={cfg.className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <img src={firstImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-body text-sm text-foreground">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                          </p>
                          <p className="font-display font-bold text-primary">
                            ₹{order.totalAmount?.toFixed(2)}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <p className="font-body text-xs text-muted-foreground">
                        Placed on {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default OrderHistory;
