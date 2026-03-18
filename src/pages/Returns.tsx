import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { RotateCcw, ShieldCheck, Clock, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Returns = () => {
  const process = [
    {
      step: 1,
      title: "Contact Us",
      description: "Reach out within 24 hours of delivery with photos of the issue.",
    },
    {
      step: 2,
      title: "Get Approved",
      description: "Our team will review and approve your request within 2 hours.",
    },
    {
      step: 3,
      title: "Choose Resolution",
      description: "Select a full refund, store credit, or replacement delivery.",
    },
    {
      step: 4,
      title: "Resolution Complete",
      description: "Refunds processed in 3-5 days. Replacements shipped priority.",
    },
  ];

  const eligibleItems = [
    "Damaged or bruised produce",
    "Items past expiration date on arrival",
    "Wrong items delivered",
    "Missing items from your order",
    "Products with quality issues",
    "Temperature-compromised items",
  ];

  const ineligibleItems = [
    "Items damaged after delivery (user handling)",
    "Change of mind after 24 hours",
    "Products correctly described but not to taste",
    "Items on final sale or clearance",
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Returns & Refunds | OFH - The Organic Foods House</title>
        <meta
          name="description"
          content="Learn about our hassle-free returns and refund policy. Your satisfaction is our priority at The Organic Foods House."
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
                  <RotateCcw className="h-4 w-4" />
                  Returns Policy
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Hassle-Free Returns
                </h1>
                <p className="font-body text-lg text-muted-foreground">
                  Your satisfaction is our top priority. If something isn't right with your order, 
                  we'll make it right – guaranteed.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Guarantee Banner */}
          <section className="py-12 bg-primary">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                <ShieldCheck className="h-12 w-12 text-primary-foreground" />
                <div>
                  <h2 className="font-display text-2xl font-bold text-primary-foreground mb-1">
                    100% Satisfaction Guarantee
                  </h2>
                  <p className="font-body text-primary-foreground/80">
                    Not happy? Get a full refund or replacement, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  How It Works
                </h2>
                <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                  Our simple 4-step process makes returns easy and stress-free.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-6">
                {process.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                      <span className="font-display text-lg font-bold text-primary-foreground">
                        {item.step}
                      </span>
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border" />
                    )}
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Eligible */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Eligible for Returns
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {eligibleItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Ineligible */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Not Eligible
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {ineligibleItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body text-muted-foreground">
                        <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Important Info */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                  Important Details
                </h2>
                <div className="space-y-4">
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h4 className="font-display font-semibold text-foreground">
                        24-Hour Window
                      </h4>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">
                      For perishable items, please report any issues within 24 hours of delivery. 
                      Take photos of the issue and your order receipt.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <RotateCcw className="h-5 w-5 text-primary" />
                      <h4 className="font-display font-semibold text-foreground">
                        Refund Processing
                      </h4>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">
                      Refunds are processed to your original payment method within 3-5 business days. 
                      Store credit is issued instantly and never expires.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <h4 className="font-display font-semibold text-foreground">
                        Need Help?
                      </h4>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">
                      Our customer service team is available 7 days a week. Contact us via chat, 
                      email, or phone for immediate assistance.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Need to Start a Return?
                </h2>
                <p className="font-body text-muted-foreground mb-6">
                  Contact our support team and we'll get you sorted right away.
                </p>
                <Button asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Returns;
