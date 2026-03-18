import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Leaf, Recycle, Droplets, Sun, Wind, TreePine, Target, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import bannerSustainability from "@/assets/banner-sustainability.jpg";

const Sustainability = () => {
  const initiatives = [
    { icon: Recycle, title: "Zero Waste Packaging", description: "Our jaggery and rice are packed in compostable jute bags and recycled paper.", stat: "100%", statLabel: "Plastic-Free" },
    { icon: Droplets, title: "Water Conservation", description: "Our farms use drip irrigation and rainwater harvesting, reducing water usage by 60%.", stat: "60%", statLabel: "Less Water" },
    { icon: Sun, title: "Traditional Processing", description: "Jaggery made using traditional open-pan boiling; rice is naturally sun-dried.", stat: "85%", statLabel: "Natural Energy" },
    { icon: TreePine, title: "Soil Regeneration", description: "Crop rotation between sugarcane and vegetables, returning organic matter to the soil.", stat: "200+", statLabel: "Acres Regenerated" },
  ];

  const goals = [
    { year: "2025", goal: "100% Compostable Packaging", progress: 80, status: "In Progress" },
    { year: "2026", goal: "Carbon Neutral Delivery Fleet", progress: 55, status: "On Track" },
    { year: "2027", goal: "Zero Landfill Operations", progress: 35, status: "Planning" },
    { year: "2030", goal: "Complete Farm-to-Table Traceability", progress: 20, status: "Early Stage" },
  ];

  const practices = [
    { title: "Chemical-Free Sugarcane", description: "All sugarcane for our jaggery is grown without pesticides in Nashik and Kolhapur." },
    { title: "Local Sourcing", description: "85% of our products come from farms within 200 km — reducing transport emissions." },
    { title: "Composting & Crop Rotation", description: "Sugarcane press-mud and vegetable waste are composted and returned to farms." },
    { title: "Fair Farmer Partnerships", description: "We pay organic farmers 20-30% above market rates for sustainable livelihoods." },
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Sustainability | OFH - The Organic Foods House</title>
        <meta name="description" content="Our commitment to sustainability — zero-waste packaging, traditional processing, and fair farmer partnerships." />
      </Helmet>

      <div className="min-h-screen bg-background pb-mobile-nav">
        <Navbar />

        <main>
          {/* Hero Banner */}
          <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center">
            <img src={bannerSustainability} alt="Sustainability and organic farming" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/60" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 text-center px-4 sm:px-6">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-primary-foreground/20">
                <Leaf className="h-4 w-4" />
                Our Commitment
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6">
                Rooted in
                <br />
                Sustainability
              </h1>
              <p className="font-body text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Every step of our supply chain honours traditional methods and respects the earth.
              </p>
            </motion.div>
          </section>

          {/* Key Initiatives */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Key Initiatives</h2>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {initiatives.map((initiative, index) => (
                  <motion.div key={initiative.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-card rounded-2xl p-4 sm:p-6 border border-border flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <initiative.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">{initiative.title}</h3>
                      <p className="font-body text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{initiative.description}</p>
                      <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-primary/10">
                        <span className="font-display font-bold text-primary text-sm sm:text-base">{initiative.stat}</span>
                        <span className="font-body text-xs sm:text-sm text-primary">{initiative.statLabel}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Impact Banner */}
          <section className="py-8 sm:py-12 bg-primary">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
                {[
                  { value: "200+", label: "Acres Organic" },
                  { value: "50+", label: "Partner Farms" },
                  { value: "0", label: "Chemicals Used" },
                  { value: "85%", label: "Local Sourcing" },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <p className="font-display text-2xl sm:text-4xl font-bold text-primary-foreground mb-1">{stat.value}</p>
                    <p className="font-body text-xs sm:text-base text-primary-foreground/80">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Goals */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Our Goals</h2>
                </div>
              </motion.div>
              <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                {goals.map((goal, index) => (
                  <motion.div key={goal.goal} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-card rounded-xl p-3 sm:p-4 border border-border">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <span className="font-display font-bold text-primary text-sm sm:text-base flex-shrink-0">{goal.year}</span>
                        <span className="font-body font-medium text-foreground text-xs sm:text-base truncate">{goal.goal}</span>
                      </div>
                      <span className="font-body text-xs text-muted-foreground flex-shrink-0">{goal.status}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${goal.progress}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-primary rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Practices */}
          <section className="py-12 sm:py-16 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Sustainable Practices</h2>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
                {practices.map((practice, index) => (
                  <motion.div key={practice.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1 text-sm sm:text-base">{practice.title}</h3>
                      <p className="font-body text-xs sm:text-sm text-muted-foreground">{practice.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-primary/5 rounded-3xl p-6 sm:p-8 md:p-12 text-center">
                <Wind className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Choose Traditional. Choose Organic.</h2>
                <p className="font-body text-sm sm:text-base text-muted-foreground mb-6 max-w-xl mx-auto">
                  Every purchase supports chemical-free farming and sustainable livelihoods for Indian farmers.
                </p>
                <a href="/products" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base">
                  Shop Organic
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

export default Sustainability;
