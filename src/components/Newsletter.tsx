import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: "Welcome to The Organic Foods House!", description: "You'll receive fresh updates and exclusive offers." });
      setEmail("");
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-primary">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
            <Leaf className="h-4 w-4" />
            <span className="font-body text-xs sm:text-sm font-medium">Join Our Community</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6">
            Get Fresh Updates
          </h2>
          <p className="font-body text-sm sm:text-base text-primary-foreground/70 mb-6 sm:mb-10 max-w-xl mx-auto">
            Subscribe for harvest updates, seasonal recipes, exclusive discounts, and healthy living tips.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 sm:h-14 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground text-sm sm:text-base"
              required
            />
            <Button type="submit" variant="gold" size="xl" className="group bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base h-12 sm:h-14">
              Subscribe
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <p className="font-body text-[10px] sm:text-xs text-primary-foreground/50 mt-4 sm:mt-6">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
