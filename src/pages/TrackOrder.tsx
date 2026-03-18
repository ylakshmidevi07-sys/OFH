import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Search, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useTrackOrderMutation } from "@/hooks/queries";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const { toast } = useToast();
  const trackMutation = useTrackOrderMutation();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) {
      toast({ title: "Please enter an order number", variant: "destructive" });
      return;
    }

    try {
      const order = await trackMutation.mutateAsync(trimmed);
      if (order) {
        navigate(`/orders/${order.orderNumber || trimmed}`);
        return;
      }
    } catch {
      // order not found or not accessible
    }

    toast({
      title: "Order not found",
      description: "Please check the order number and try again.",
      variant: "destructive",
    });
  };

  const isSearching = trackMutation.isPending;

  return (
    <PageTransition>
      <Helmet>
        <title>Track Order | OFH - The Organic Foods House</title>
        <meta name="description" content="Track your organic food order delivery status in real-time." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Track Your Order
            </h1>
            <p className="font-body text-muted-foreground">
              Enter your order number to see real-time delivery status updates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-8 shadow-soft"
          >
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orderNumber" className="font-display font-semibold">
                  Order Number
                </Label>
                <Input
                  id="orderNumber"
                  placeholder="e.g. ORD-M5X8K2-AB3C"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="text-lg h-12"
                  maxLength={50}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isSearching}
              >
                <Search className="h-4 w-4" />
                {isSearching ? "Searching..." : "Track Order"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="font-body text-sm text-muted-foreground text-center mb-4">
                You can find your order number in the confirmation email or on your orders page.
              </p>
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate("/account/orders")}
                >
                  View All My Orders
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate("/auth")}
                >
                  Sign in to view order history
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default TrackOrder;
