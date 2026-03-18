import { useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useAuthStore } from "@/stores/authStore";
import { useSignOut } from "@/hooks/useAuthActions";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Order History",
    description: "View and track your orders",
    icon: Package,
    href: "/account/orders",
  },
  {
    title: "Saved Addresses",
    description: "Manage your delivery addresses",
    icon: MapPin,
    href: "/account/addresses",
  },
  {
    title: "Payment Methods",
    description: "Manage your saved payment methods",
    icon: CreditCard,
    href: "/account/payments",
  },
  {
    title: "Profile Settings",
    description: "Edit your profile information",
    icon: User,
    href: "/account/profile",
  },
];

const Account = () => {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
    navigate("/");
  };

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

  if (!user) return null;

  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : user.email?.[0]?.toUpperCase() || "U";

  return (
    <PageTransition>
      <Helmet>
        <title>My Account | OFH</title>
        <meta name="description" content="Manage your OFH account, orders, addresses, and payment methods." />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-24 md:pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : "Welcome!"}
            </h1>
            <p className="font-body text-muted-foreground">{user.email}</p>
          </motion.div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-soft hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Sign Out Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8"
          >
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Account;
