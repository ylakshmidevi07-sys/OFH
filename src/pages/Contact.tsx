import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      subtext: "Mon-Fri 8am to 6pm",
    },
    {
      icon: Mail,
      title: "Email",
      details: "hello@ofh.com",
      subtext: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      title: "Address",
      details: "123 Organic Lane",
      subtext: "Green Valley, CA 90210",
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon-Sat: 8am-8pm",
      subtext: "Sunday: 10am-6pm",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Contact Us | OFH - The Organic Foods House</title>
        <meta
          name="description"
          content="Get in touch with The Organic Foods House. We're here to help with your orders, questions about our organic products, or partnership inquiries."
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
                  <MessageSquare className="h-4 w-4" />
                  Get In Touch
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  We'd Love to Hear From You
                </h1>
                <p className="font-body text-lg text-muted-foreground">
                  Have a question about our products, your order, or interested in partnering with us? 
                  Reach out and we'll get back to you as soon as possible.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Info Cards */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-2xl p-6 text-center border border-border"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {info.title}
                    </h3>
                    <p className="font-body text-foreground">{info.details}</p>
                    <p className="font-body text-sm text-muted-foreground">{info.subtext}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form & Map */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-sm font-medium text-foreground mb-2 block">
                          Your Name
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <label className="font-body text-sm font-medium text-foreground mb-2 block">
                          Email Address
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="bg-background"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-foreground mb-2 block">
                        Subject
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm font-medium text-foreground mb-2 block">
                        Message
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                        className="bg-background"
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </motion.div>

                {/* Map Placeholder */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 min-h-[400px] flex items-center justify-center"
                >
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      Visit Our Store
                    </h3>
                    <p className="font-body text-muted-foreground">
                      123 Organic Lane, Green Valley, CA 90210
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FAQ CTA */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary/5 rounded-3xl p-8 md:p-12 text-center"
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Have More Questions?
                </h2>
                <p className="font-body text-muted-foreground mb-6 max-w-xl mx-auto">
                  Check out our frequently asked questions for quick answers to common inquiries.
                </p>
                <Button asChild variant="outline">
                  <a href="/faq">View FAQ</a>
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

export default Contact;
