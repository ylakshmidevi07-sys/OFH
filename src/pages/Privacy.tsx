import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, address, phone number)",
        "Payment information (processed securely through third-party providers)",
        "Order history and shopping preferences",
        "Device information and browsing data when you use our website",
        "Communications you send to us (customer support inquiries)",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "To process and fulfill your orders",
        "To communicate about your orders and account",
        "To send promotional emails (with your consent)",
        "To improve our products and services",
        "To prevent fraud and ensure security",
        "To comply with legal obligations",
      ],
    },
    {
      title: "Information Sharing",
      content: [
        "We never sell your personal information to third parties",
        "We share data with delivery partners to fulfill orders",
        "We use secure payment processors for transactions",
        "We may share anonymized data for analytics purposes",
        "We comply with legal requests when required by law",
      ],
    },
    {
      title: "Data Security",
      content: [
        "All data is encrypted using 256-bit SSL encryption",
        "We use secure, PCI-compliant payment processing",
        "Regular security audits and vulnerability assessments",
        "Employee access is limited on a need-to-know basis",
        "We never store complete credit card numbers",
      ],
    },
    {
      title: "Your Rights",
      content: [
        "Access and receive a copy of your personal data",
        "Request correction of inaccurate information",
        "Request deletion of your personal data",
        "Opt-out of marketing communications at any time",
        "Object to certain processing of your data",
        "Data portability to transfer your data elsewhere",
      ],
    },
    {
      title: "Cookies & Tracking",
      content: [
        "We use essential cookies to operate our website",
        "Analytics cookies help us understand how you use our site",
        "Marketing cookies are used only with your consent",
        "You can manage cookie preferences in your browser settings",
        "Third-party services may set their own cookies",
      ],
    },
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Privacy Policy | OFH - The Organic Foods House</title>
        <meta
          name="description"
          content="Read our privacy policy to understand how The Organic Foods House collects, uses, and protects your personal information."
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
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Your Privacy Matters
                </h1>
                <p className="font-body text-lg text-muted-foreground">
                  We're committed to protecting your privacy. This policy explains how we collect, 
                  use, and safeguard your information.
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
              <div className="max-w-3xl mx-auto space-y-12">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 font-body text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-muted/50 rounded-2xl p-6"
                >
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Contact Us About Privacy
                  </h2>
                  <p className="font-body text-muted-foreground mb-4">
                    If you have questions about this privacy policy or want to exercise your rights, 
                    please contact our Data Protection Officer:
                  </p>
                  <div className="font-body text-foreground">
                    <p>Email: privacy@ofh.com</p>
                    <p>Address: 123 Organic Lane, Green Valley, CA 90210</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border-t border-border pt-8"
                >
                  <p className="font-body text-sm text-muted-foreground">
                    We may update this privacy policy from time to time. Any changes will be posted 
                    on this page with an updated revision date. We encourage you to review this 
                    policy periodically.
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

export default Privacy;
