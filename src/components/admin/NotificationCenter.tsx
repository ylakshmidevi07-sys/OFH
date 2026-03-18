import { useState, useEffect, useCallback } from "react";
import { useBrowserNotifications } from "@/hooks/useBrowserNotifications";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  ShoppingCart,
  AlertTriangle,
  UserPlus,
  X,
  Check,
  CheckCheck,
  Volume2,
  VolumeX,
  Trash2,
  Package,
  BellRing,
  BellOff,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AdminNotification {
  id: string;
  type: "order" | "low_stock" | "signup" | "return";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, unknown>;
}

// Simulated data generators
const customerNames = ["Sarah Johnson", "Mike Chen", "Emma Wilson", "David Kim", "Lisa Anderson", "James Brown"];
const products = ["Organic Avocado", "Fresh Eggs", "Raw Honey", "Almond Milk", "Organic Spinach", "Wild Blueberries"];

const generateOrderNotification = (): AdminNotification => ({
  id: `order-${Date.now()}`,
  type: "order",
  title: "New Order Received",
  message: `${customerNames[Math.floor(Math.random() * customerNames.length)]} placed an order for $${(Math.random() * 150 + 20).toFixed(2)}`,
  timestamp: new Date(),
  read: false,
  data: { orderId: `ORD-${Math.floor(Math.random() * 10000)}` },
});

const generateLowStockNotification = (): AdminNotification => ({
  id: `stock-${Date.now()}`,
  type: "low_stock",
  title: "Low Stock Alert",
  message: `${products[Math.floor(Math.random() * products.length)]} is running low (${Math.floor(Math.random() * 10 + 1)} units left)`,
  timestamp: new Date(),
  read: false,
  data: { productId: `PROD-${Math.floor(Math.random() * 1000)}` },
});

const generateSignupNotification = (): AdminNotification => ({
  id: `signup-${Date.now()}`,
  type: "signup",
  title: "New Customer Signup",
  message: `${customerNames[Math.floor(Math.random() * customerNames.length)]} just created an account`,
  timestamp: new Date(),
  read: false,
  data: { customerId: `CUST-${Math.floor(Math.random() * 10000)}` },
});

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    playNotificationSound,
  } = useBrowserNotifications();

  const {
    preferences,
    updatePreferences,
    shouldShowPushForType,
    shouldShowInAppForType,
  } = useNotificationPreferences();

  const togglePushNotifications = async () => {
    if (!preferences.pushEnabled) {
      // Requesting to enable
      if (permission === "granted") {
        updatePreferences({ pushEnabled: true });
      } else {
        const result = await requestPermission();
        if (result === "granted") {
          updatePreferences({ pushEnabled: true });
          toast.success("Push notifications enabled", {
            description: "You'll receive alerts when the tab is not active",
          });
        } else {
          toast.error("Permission denied", {
            description: "Please enable notifications in your browser settings",
          });
        }
      }
    } else {
      // Disabling
      updatePreferences({ pushEnabled: false });
    }
  };

  // Simulate real-time notifications
  useEffect(() => {
    // Initial notifications
    const initial: AdminNotification[] = [
      { ...generateOrderNotification(), timestamp: new Date(Date.now() - 60000) },
      { ...generateLowStockNotification(), timestamp: new Date(Date.now() - 120000) },
      { ...generateSignupNotification(), timestamp: new Date(Date.now() - 180000) },
    ];
    setNotifications(initial);

    // Simulate new notifications coming in
    const intervals = [
      setInterval(() => {
        const newNotification = generateOrderNotification();
        addNotification(newNotification);
      }, 45000), // New order every 45 seconds
      setInterval(() => {
        const newNotification = generateLowStockNotification();
        addNotification(newNotification);
      }, 90000), // Low stock every 90 seconds
      setInterval(() => {
        const newNotification = generateSignupNotification();
        addNotification(newNotification);
      }, 60000), // New signup every 60 seconds
    ];

    return () => intervals.forEach(clearInterval);
  }, []);

  const addNotification = useCallback((notification: AdminNotification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 50));
    
    // Play sound if enabled
    if (preferences.soundEnabled) {
      playNotificationSound();
    }

    // Show browser notification if enabled and tab is not active
    if (shouldShowPushForType(notification.type) && document.hidden) {
      const icons: Record<AdminNotification["type"], string> = {
        order: "🛒",
        low_stock: "⚠️",
        signup: "👤",
        return: "📦",
      };

      showNotification({
        title: `${icons[notification.type]} ${notification.title}`,
        body: notification.message,
        tag: notification.id,
        onClick: () => {
          setIsOpen(true);
        },
      });
    }

    // Show toast for new notifications if in-app is enabled for this type
    if (shouldShowInAppForType(notification.type)) {
      const icons = {
        order: <ShoppingCart className="h-4 w-4 text-primary" />,
        low_stock: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        signup: <UserPlus className="h-4 w-4 text-green-500" />,
        return: <Package className="h-4 w-4 text-blue-500" />,
      };

      toast(notification.title, {
        description: notification.message,
        icon: icons[notification.type],
      });
    }
  }, [preferences.soundEnabled, shouldShowPushForType, shouldShowInAppForType, playNotificationSound, showNotification]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "orders") return n.type === "order";
    if (activeTab === "stock") return n.type === "low_stock";
    if (activeTab === "signups") return n.type === "signup";
    return true;
  });

  const getIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "low_stock":
        return <AlertTriangle className="h-4 w-4" />;
      case "signup":
        return <UserPlus className="h-4 w-4" />;
      case "return":
        return <Package className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: AdminNotification["type"]) => {
    switch (type) {
      case "order":
        return "bg-primary/10 text-primary";
      case "low_stock":
        return "bg-amber-500/10 text-amber-500";
      case "signup":
        return "bg-green-500/10 text-green-500";
      case "return":
        return "bg-blue-500/10 text-blue-500";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] p-0 bg-popover" 
        align="end" 
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
              title={preferences.soundEnabled ? "Mute notifications" : "Unmute notifications"}
            >
              {preferences.soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            {notifications.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={clearAll}
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Push Notification Settings */}
        {isSupported && (
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 gap-2">
            <div className="flex items-center gap-2">
              {preferences.pushEnabled ? (
                <BellRing className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
              <div className="flex flex-col">
                <Label htmlFor="push-toggle" className="text-xs font-medium cursor-pointer">
                  Push when inactive
                </Label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                to="/admin/settings" 
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Notification Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <Switch
                id="push-toggle"
                checked={preferences.pushEnabled}
                onCheckedChange={togglePushNotifications}
                className="scale-75"
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="stock"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Stock
            </TabsTrigger>
            <TabsTrigger
              value="signups"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Signups
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[400px]">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        layout
                        className={cn(
                          "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer group",
                          !notification.read && "bg-primary/5"
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div
                          className={cn(
                            "flex-shrink-0 p-2 rounded-lg",
                            getIconColor(notification.type)
                          )}
                        >
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "text-sm",
                                !notification.read && "font-semibold"
                              )}
                            >
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
