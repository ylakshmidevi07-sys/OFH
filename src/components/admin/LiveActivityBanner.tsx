import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, UserPlus, TrendingUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveEvent {
  id: string;
  type: "order" | "signup" | "sale" | "shipment";
  message: string;
}

const eventMessages = {
  order: [
    "New order #{{id}} placed",
    "Order #{{id}} confirmed",
    "Express order received",
  ],
  signup: [
    "New customer joined",
    "Customer verified email",
    "New account created",
  ],
  sale: [
    "Flash sale item sold",
    "Bestseller purchased",
    "Premium item ordered",
  ],
  shipment: [
    "Order #{{id}} shipped",
    "Package delivered",
    "Express shipment sent",
  ],
};

const LiveActivityBanner = () => {
  const [currentEvent, setCurrentEvent] = useState<LiveEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const generateEvent = (): LiveEvent => {
      const types: LiveEvent["type"][] = ["order", "signup", "sale", "shipment"];
      const type = types[Math.floor(Math.random() * types.length)];
      const messages = eventMessages[type];
      const message = messages[Math.floor(Math.random() * messages.length)]
        .replace("{{id}}", Math.floor(Math.random() * 9000 + 1000).toString());

      return {
        id: `event-${Date.now()}`,
        type,
        message,
      };
    };

    const showEvent = () => {
      const event = generateEvent();
      setCurrentEvent(event);
      setIsVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Show first event after 5 seconds
    const initialTimeout = setTimeout(showEvent, 5000);

    // Then show events every 15-30 seconds
    const interval = setInterval(() => {
      showEvent();
    }, Math.random() * 15000 + 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const getIcon = (type: LiveEvent["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-3.5 w-3.5" />;
      case "signup":
        return <UserPlus className="h-3.5 w-3.5" />;
      case "sale":
        return <TrendingUp className="h-3.5 w-3.5" />;
      case "shipment":
        return <Package className="h-3.5 w-3.5" />;
    }
  };

  const getColors = (type: LiveEvent["type"]) => {
    switch (type) {
      case "order":
        return "bg-primary/10 text-primary border-primary/20";
      case "signup":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "sale":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "shipment":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 lg:bottom-6 lg:left-auto lg:right-6">
      <AnimatePresence>
        {isVisible && currentEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full border shadow-lg backdrop-blur-sm",
              getColors(currentEvent.type)
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
            </span>
            {getIcon(currentEvent.type)}
            <span className="text-xs font-medium">{currentEvent.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivityBanner;
