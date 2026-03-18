import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Package, ChevronRight, Clock, Truck, CheckCircle2, XCircle, ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useAuthStore } from "@/stores/authStore";
import { useCartFacade } from "@/hooks/useCartFacade";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/queries";
import { format } from "date-fns/format";

interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  items: OrderItem[];
  total: number;
  status: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_method: "card" | "cod";
  created_at: string;
}

const statusConfig: Record<Order["status"], { label: string; icon: React.ElementType; className: string }> = {
  processing: {
    label: "Processing",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const AccountOrders = () => {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const { addItem } = useCartFacade();
  const { toast } = useToast();

  const { data, isLoading: queryLoading } = useOrders({ page: 1 });
  const loading = authLoading || queryLoading;

  const orders: Order[] = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.map((order: any) => ({
      id: order.id,
      order_number: order.orderNumber,
      items: (order.items || []).map((item: any) => ({
        id: item.id,
        productId: item.productId,
        name: item.product?.name || "",
        price: item.price,
        image: item.product?.images?.[0] || "/placeholder.svg",
        quantity: item.quantity,
      })),
      total: order.totalAmount,
      status: String(order.status).toLowerCase() as Order["status"],
      payment_method: "cod" as const,
      created_at: order.createdAt,
    }));
  }, [data]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (loading) {
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
        <title>Order History | OFH</title>
        <meta name="description" content="View your past orders and track their status." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" className="mb-4" onClick={() => navigate("/account")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Order History
            </h1>
            <p className="font-body text-muted-foreground mt-2">
              Track and view your past orders
            </p>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-16"
            >
              <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                No orders yet
              </h2>
              <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
                Once you place an order, it will appear here so you can track its status.
              </p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/account/orders/${order.order_number}`}
                      className="block bg-card rounded-2xl p-6 shadow-soft hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-foreground">
                              {order.order_number}
                            </h3>
                            <p className="font-body text-sm text-muted-foreground">
                              {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-body text-sm text-muted-foreground">
                                {order.items.length} {order.items.length === 1 ? "item" : "items"}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-display font-semibold text-foreground">
                                ${Number(order.total).toFixed(2)}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-body text-sm text-muted-foreground capitalize">
                                {order.payment_method === "cod" ? "Cash on Delivery" : "Card"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              order.items.forEach((item) => {
                                addItem({
                                  id: item.productId || item.id,
                                  name: item.name,
                                  price: item.price,
                                  unit: "each",
                                  image: item.image,
                                  category: "",
                                });
                              });
                              toast({
                                title: "Items added to cart!",
                                description: `${order.items.length} item(s) reordered.`,
                              });
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reorder
                          </Button>
                          <Badge
                            variant="outline"
                            className={`${statusConfig[order.status].className} gap-1.5`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusConfig[order.status].label}
                          </Badge>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>

                      {/* Order items preview */}
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {order.items.slice(0, 4).map((item) => (
                          <img
                            key={item.id}
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                            <span className="font-body text-sm text-muted-foreground">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
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

export default AccountOrders;
