import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using The Organic Foods House ("OFH") website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
    },
    {
      title: "2. Account Registration",
      content: `To make purchases, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account. You must provide accurate and complete information and keep it updated. We reserve the right to suspend or terminate accounts that violate these terms.`,
    },
    {
      title: "3. Products and Pricing",
      content: `All products are subject to availability. We strive to display accurate product descriptions and pricing, but errors may occur. We reserve the right to correct any errors and to change or update information at any time without prior notice. Prices are in USD and do not include applicable taxes or delivery fees unless stated otherwise.`,
    },
    {
      title: "4. Orders and Payment",
      content: `By placing an order, you are making an offer to purchase products. All orders are subject to acceptance and availability. We accept major credit cards, PayPal, and other payment methods as displayed during checkout. Payment is processed at the time of order. We use secure, PCI-compliant payment processing.`,
    },
    {
      title: "5. Shipping and Delivery",
      content: `Delivery times are estimates and may vary based on location and circumstances beyond our control. Risk of loss and title for products pass to you upon delivery. Perishable items are shipped with appropriate packaging to maintain freshness. Please inspect items upon delivery and report any issues within 24 hours.`,
    },
    {
      title: "6. Returns and Refunds",
      content: `We offer a 100% satisfaction guarantee on all products. If you're not satisfied with any item, contact us within 24 hours of delivery with photos of the issue. We will provide a refund or replacement at our discretion. Refunds are processed within 3-5 business days to your original payment method.`,
    },
    {
      title: "7. Intellectual Property",
      content: `All content on this website, including text, graphics, logos, images, and software, is the property of OFH or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our written consent.`,
    },
    {
      title: "8. User Conduct",
      content: `You agree not to: use the service for any unlawful purpose; attempt to gain unauthorized access to our systems; interfere with or disrupt the service; transmit viruses or malicious code; impersonate any person or entity; or collect user information without consent.`,
    },
    {
      title: "9. Limitation of Liability",
      content: `To the maximum extent permitted by law, OFH shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the products giving rise to the claim.`,
    },
    {
      title: "10. Indemnification",
      content: `You agree to indemnify and hold harmless OFH, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your violation of these terms or your use of our services.`,
    },
    {
      title: "11. Privacy",
      content: `Your use of our services is also governed by our Privacy Policy, which is incorporated into these terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your information.`,
    },
    {
      title: "12. Modifications",
      content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after any changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.`,
    },
    {
      title: "13. Governing Law",
      content: `These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes shall be resolved in the state or federal courts located in California.`,
    },
    {
      title: "14. Contact Information",
      content: `If you have questions about these Terms of Service, please contact us at: legal@ofh.com or by mail at 123 Organic Lane, Green Valley, CA 90210.`,
    },
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Terms of Service | OFH - The Organic Foods House</title>
        <meta
          name="description"
          content="Read the Terms of Service for The Organic Foods House. Understand your rights and responsibilities when using our website and services."
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
                  <FileText className="h-4 w-4" />
                  Legal
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Terms of Service
                </h1>
                <p className="font-body text-lg text-muted-foreground">
                  Please read these terms carefully before using our services.
                </p>
                <p className="font-body text-sm text-muted-foreground mt-4">
                  Last updated: January 1, 2025
                </p>
              </motion.div>
            </div>
          </section>

          {/* Content */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto space-y-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <h2 className="font-display text-xl font-bold text-foreground mb-3">
                      {section.title}
                    </h2>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border-t border-border pt-8 mt-12"
                >
                  <p className="font-body text-sm text-muted-foreground">
                    By using The Organic Foods House website and services, you acknowledge that you 
                    have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Terms;
