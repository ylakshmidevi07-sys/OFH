import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Package, Leaf, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Delivery = () => {
  const deliveryOptions = [
    {
      icon: Truck,
      title: "Standard Delivery",
      time: "2-4 Business Days",
      price: "$4.99",
      description: "Eco-friendly packaging with temperature-controlled vehicles.",
    },
    {
      icon: Clock,
      title: "Express Delivery",
      time: "Next Day",
      price: "$9.99",
      description: "Order by 2 PM for next-day delivery to your doorstep.",
    },
    {
      icon: MapPin,
      title: "Same Day Delivery",
      time: "Within 4 Hours",
      price: "$14.99",
      description: "Available in select metro areas. Order by 12 PM.",
    },
  ];

  const features = [
    {
      icon: Leaf,
      title: "Eco-Friendly Packaging",
      description: "All our packaging is 100% recyclable or compostable. We use insulated boxes made from recycled materials.",
    },
    {
      icon: ShieldCheck,
      title: "Freshness Guaranteed",
      description: "Temperature-controlled delivery ensures your produce arrives as fresh as the day it was picked.",
    },
    {
      icon: Package,
      title: "Real-Time Tracking",
      description: "Track your order from our warehouse to your door with our live tracking system.",
    },
  ];

  const zones = [
    { zone: "Zone 1", areas: "Downtown, Midtown, Central Districts", time: "Same Day Available" },
    { zone: "Zone 2", areas: "Suburban Areas, Outer Districts", time: "Next Day Delivery" },
    { zone: "Zone 3", areas: "Extended Metro, Neighboring Cities", time: "2-3 Business Days" },
    { zone: "Zone 4", areas: "Rural & Remote Areas", time: "3-5 Business Days" },
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Delivery Information | OFH - The Organic Foods House</title>
        <meta
          name="description"
          content="Learn about our delivery options, zones, and commitment to eco-friendly shipping. Free delivery on orders over $50."
        />
      </Helmet>

      <div className="min-h-screen bg-background pb-mobile-nav">
        <Navbar />

        <main>
          {/* Hero Section */}
          <section className="py-20 bg-primary/5">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Truck className="h-4 w-4" />
                  Delivery Info
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Fresh to Your Door
                </h1>
                <p className="font-body text-lg text-muted-foreground">
                  We deliver organic goodness right to your doorstep with care. Free shipping on all 
                  orders over $50.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Delivery Options */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Delivery Options
                </h2>
                <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                  Choose the delivery speed that works best for you.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {deliveryOptions.map((option, index) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <option.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                      {option.title}
                    </h3>
                    <p className="font-body text-sm text-primary font-medium mb-2">{option.time}</p>
                    <p className="font-display text-2xl font-bold text-foreground mb-3">
                      {option.price}
                    </p>
                    <p className="font-body text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 bg-primary/10 rounded-2xl p-6 text-center"
              >
                <p className="font-display text-lg font-semibold text-foreground">
                  🎉 FREE Shipping on Orders Over $50!
                </p>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Delivery Zones */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Delivery Zones
                </h2>
                <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                  Delivery times vary based on your location. Enter your zip code at checkout for 
                  accurate delivery estimates.
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto">
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-display font-semibold text-foreground">
                    <span>Zone</span>
                    <span>Areas</span>
                    <span>Delivery Time</span>
                  </div>
                  {zones.map((zone, index) => (
                    <motion.div
                      key={zone.zone}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="grid grid-cols-3 gap-4 p-4 border-t border-border font-body text-sm"
                    >
                      <span className="font-semibold text-primary">{zone.zone}</span>
                      <span className="text-muted-foreground">{zone.areas}</span>
                      <span className="text-foreground">{zone.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                  Important Information
                </h2>
                <div className="space-y-4">
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <h4 className="font-display font-semibold text-foreground mb-2">
                      Perishable Items
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">
                      All perishable items are shipped in insulated packaging with ice packs to 
                      maintain freshness. We recommend refrigerating items immediately upon arrival.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <h4 className="font-display font-semibold text-foreground mb-2">
                      Delivery Windows
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">
                      You can select a preferred delivery window during checkout. We'll send you 
                      notifications with real-time updates on your delivery status.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <h4 className="font-display font-semibold text-foreground mb-2">
                      Missed Deliveries
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">
                      If you miss a delivery, our driver will attempt redelivery the next business 
                      day. You can also contact us to arrange a pickup or reschedule.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Delivery;
