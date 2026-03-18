import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { HelpCircle, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      category: "Orders & Delivery",
      faqs: [
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 2-4 business days. Express delivery is available for next-day delivery if ordered before 2 PM. Same-day delivery is available in select metro areas for orders placed before 12 PM.",
        },
        {
          question: "What are your delivery fees?",
          answer: "Standard delivery is $4.99, Express is $9.99, and Same-day is $14.99. Orders over $50 qualify for FREE standard shipping!",
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order ships, you'll receive an email with a tracking link. You can also track your order in real-time through your account dashboard.",
        },
        {
          question: "Do you deliver to my area?",
          answer: "We deliver to most areas across the country. Enter your zip code at checkout to confirm delivery availability and estimated delivery times for your location.",
        },
        {
          question: "What if I'm not home during delivery?",
          answer: "Our drivers will leave your package in a safe location or with a neighbor if possible. You can also add delivery instructions during checkout. If undeliverable, we'll attempt redelivery the next business day.",
        },
      ],
    },
    {
      category: "Products & Quality",
      faqs: [
        {
          question: "Are all your products organic?",
          answer: "Yes! All products sold on OFH are 100% certified organic. We work only with USDA certified organic farms and suppliers who meet our strict quality standards.",
        },
        {
          question: "How do you ensure product freshness?",
          answer: "We source directly from local farms and use temperature-controlled storage and delivery. Produce is typically harvested within 24-48 hours of shipping. All perishables are packed with ice packs in insulated boxes.",
        },
        {
          question: "Where does your produce come from?",
          answer: "We partner with over 100 local and regional organic farms. We prioritize seasonal, locally-grown produce to minimize food miles and maximize freshness.",
        },
        {
          question: "Do you have products for special diets?",
          answer: "Yes! We offer a wide range of products suitable for various dietary needs including gluten-free, vegan, keto, paleo, and dairy-free options. Use our filters to find products that fit your diet.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 100% satisfaction guarantee. If you're not happy with any item, contact us within 24 hours of delivery with photos, and we'll provide a full refund or replacement.",
        },
        {
          question: "How do I report a damaged item?",
          answer: "Contact our support team via email or chat within 24 hours of delivery. Please include photos of the damaged item and your order number. We'll process your refund or send a replacement immediately.",
        },
        {
          question: "How long do refunds take?",
          answer: "Refunds are processed within 24 hours of approval and typically appear in your account within 3-5 business days depending on your bank. Store credit is issued instantly.",
        },
      ],
    },
    {
      category: "Account & Payment",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, Amex, Discover), PayPal, Apple Pay, Google Pay, and OFH store credit.",
        },
        {
          question: "Is my payment information secure?",
          answer: "Absolutely. We use bank-level 256-bit SSL encryption and never store your full payment details. All transactions are processed through PCI-compliant payment processors.",
        },
        {
          question: "Can I save my address and payment for faster checkout?",
          answer: "Yes! Create an account to save multiple addresses, payment methods, and track your order history. You can also set up recurring orders for your favorite items.",
        },
      ],
    },
    {
      category: "Subscriptions & Savings",
      faqs: [
        {
          question: "Do you offer subscription boxes?",
          answer: "Yes! Our subscription boxes deliver fresh organic produce weekly or bi-weekly. You can customize your box, skip weeks, or cancel anytime. Subscribers save 10% on all orders.",
        },
        {
          question: "How do I use a promo code?",
          answer: "Enter your promo code in the 'Promo Code' field during checkout. The discount will be applied automatically. Only one promo code can be used per order.",
        },
        {
          question: "Do you have a loyalty program?",
          answer: "Yes! Our Green Rewards program gives you points on every purchase. Earn 1 point per $1 spent. Redeem 100 points for $5 off your next order. Sign up for free in your account settings.",
        },
      ],
    },
  ];

  const allFaqs = faqCategories.flatMap((cat) =>
    cat.faqs.map((faq) => ({ ...faq, category: cat.category }))
  );

  const filteredFaqs = searchQuery
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <PageTransition>
      <Helmet>
        <title>FAQ | OFH - The Organic Foods House</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about ordering, delivery, returns, and more at The Organic Foods House."
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
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Frequently Asked Questions
                </h1>
                <p className="font-body text-lg text-muted-foreground mb-8">
                  Find answers to common questions about our products, delivery, and services.
                </p>

                {/* Search */}
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-background"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ Content */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                {filteredFaqs ? (
                  // Search Results
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="font-body text-muted-foreground mb-6">
                      Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} for "{searchQuery}"
                    </p>
                    <Accordion type="single" collapsible className="space-y-3">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`search-${index}`}
                          className="bg-card rounded-xl border border-border px-4"
                        >
                          <AccordionTrigger className="font-display text-left hover:no-underline">
                            <div>
                              <span className="text-xs text-primary font-medium">{faq.category}</span>
                              <p className="text-foreground">{faq.question}</p>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="font-body text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                ) : (
                  // All Categories
                  faqCategories.map((category, catIndex) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                      className="mb-10"
                    >
                      <h2 className="font-display text-xl font-bold text-foreground mb-4">
                        {category.category}
                      </h2>
                      <Accordion type="single" collapsible className="space-y-3">
                        {category.faqs.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`${catIndex}-${index}`}
                            className="bg-card rounded-xl border border-border px-4"
                          >
                            <AccordionTrigger className="font-display text-left hover:no-underline text-foreground">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="font-body text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Still Need Help */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Still Have Questions?
                </h2>
                <p className="font-body text-muted-foreground mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Contact Support
                </a>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default FAQ;
