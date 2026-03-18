import { motion } from "framer-motion";
import { ArrowRight, Leaf, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import bannerHero from "@/assets/banner-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center">
      {/* Full-width background banner */}
      <div className="absolute inset-0">
        <img
          src={bannerHero}
          alt="Organic sugarcane farm at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 sm:space-y-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-3 sm:px-4 py-2 rounded-full border border-primary-foreground/20"
            >
              <Leaf className="h-4 w-4" />
              <span className="font-body text-xs sm:text-sm font-medium">100% Certified Organic</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-primary-foreground"
            >
              Pure Organic
              <br />
              <span className="text-accent">From Farm</span>
              <br />
              <span className="text-primary-foreground/90">To Your Table</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-body text-sm sm:text-lg text-primary-foreground/80 max-w-md"
            >
              Traditional organic jaggery, chemical-free rice, and farm-fresh vegetables — delivered to your doorstep across India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Button variant="hero" size="xl" className="group text-sm sm:text-base" asChild>
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" className="text-sm sm:text-base" asChild>
                <Link to="/about">Our Story</Link>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-primary-foreground/20"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                <span className="font-body text-xs sm:text-sm text-primary-foreground/80">100% Chemical Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                <span className="font-body text-xs sm:text-sm text-primary-foreground/80">Free Delivery ₹499+</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                <span className="font-body text-xs sm:text-sm text-primary-foreground/80">Farm Direct</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
