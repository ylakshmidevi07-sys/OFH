import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Sprout, MapPin, Award, Users, Leaf, Sun } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import bannerFarms from "@/assets/banner-farms.jpg";

const Farms = () => {
  const farms = [
    { name: "Krishna Organic Farms", location: "Kolhapur, Maharashtra", specialty: "Organic Jaggery", since: 2010, image: "🪵", description: "Traditional jaggery made from single-origin organic sugarcane using age-old methods." },
    { name: "Kaveri Rice Fields", location: "Thanjavur, Tamil Nadu", specialty: "Organic Rice", since: 2005, image: "🍚", description: "Pesticide-free rice varieties grown in the fertile Kaveri delta with traditional irrigation." },
    { name: "Sahyadri Vegetable Farms", location: "Nashik, Maharashtra", specialty: "Fresh Vegetables", since: 2012, image: "🥬", description: "Seasonal organic vegetables including tomatoes, okra, brinjal, and drumstick." },
    { name: "Godavari Sugarcane Co-op", location: "East Godavari, AP", specialty: "Jaggery Syrup & Powder", since: 2015, image: "🫙", description: "Specializing in organic jaggery syrup and powder made from hand-pressed sugarcane juice." },
    { name: "Nilgiri Organic Growers", location: "Ooty, Tamil Nadu", specialty: "Hill Vegetables", since: 2008, image: "🥕", description: "High-altitude organic vegetables grown in the cool Nilgiri climate without chemicals." },
    { name: "Deccan Organic Fields", location: "Warangal, Telangana", specialty: "Organic Rice & Millets", since: 2011, image: "🌾", description: "Heritage rice and millet varieties cultivated using regenerative organic practices." },
  ];

  const stats = [
    { number: "100+", label: "Partner Farms" },
    { number: "12", label: "States Covered" },
    { number: "50km", label: "Avg. Farm Distance" },
    { number: "100%", label: "Organic Certified" },
  ];

  const practices = [
    { icon: Sprout, title: "No Chemical Inputs", description: "All partner farms use natural pest control, organic manure, and zero synthetic fertilizers." },
    { icon: Sun, title: "Traditional Methods", description: "Jaggery is made using traditional open-pan boiling; rice is sun-dried naturally." },
    { icon: Users, title: "Fair Trade Practices", description: "We ensure fair prices for farmers, cutting out middlemen for direct partnerships." },
    { icon: Leaf, title: "Sustainable Agriculture", description: "Crop rotation, composting, and water-efficient methods protect soil and resources." },
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Our Farms | OFH - The Organic Foods House</title>
        <meta name="description" content="Meet the organic farms behind our jaggery, rice, and vegetables across India." />
      </Helmet>

      <div className="min-h-screen bg-background pb-mobile-nav">
        <Navbar />

        <main>
          {/* Hero Banner */}
          <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center">
            <img src={bannerFarms} alt="Traditional jaggery making in sugarcane farm" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/60" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 text-center px-4 sm:px-6">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-primary-foreground/20">
                <Sprout className="h-4 w-4" />
                Our Farm Partners
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6">
                From Indian Farms
                <br />
                to Your Kitchen
              </h1>
              <p className="font-body text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                100+ certified organic farms across India — from sugarcane fields in Maharashtra to rice paddies in Tamil Nadu.
              </p>
            </motion.div>
          </section>

          {/* Stats */}
          <section className="py-8 sm:py-12 bg-primary">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
                    <p className="font-display text-2xl sm:text-4xl font-bold text-primary-foreground mb-1">{stat.number}</p>
                    <p className="font-body text-xs sm:text-base text-primary-foreground/80">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Farms */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Featured Farm Partners</h2>
                <p className="font-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Meet the farmers who grow your organic jaggery, rice, and vegetables with care.</p>
              </motion.div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {farms.map((farm, index) => (
                  <motion.div key={farm.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="h-28 sm:h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-4xl sm:text-6xl">{farm.image}</div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        {farm.location}
                      </div>
                      <h3 className="font-display text-base sm:text-xl font-semibold text-foreground mb-1">{farm.name}</h3>
                      <p className="font-body text-xs sm:text-sm text-primary font-medium mb-2 sm:mb-3">{farm.specialty} • Since {farm.since}</p>
                      <p className="font-body text-xs sm:text-sm text-muted-foreground">{farm.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Standards */}
          <section className="py-12 sm:py-16 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Farming Standards</h2>
              </motion.div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {practices.map((practice, index) => (
                  <motion.div key={practice.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-card rounded-2xl p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <practice.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{practice.title}</h3>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground">{practice.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Become a Partner */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-primary/5 rounded-3xl p-6 sm:p-8 md:p-12 text-center">
                <Award className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Are You an Organic Farmer?</h2>
                <p className="font-body text-sm sm:text-base text-muted-foreground mb-6 max-w-xl mx-auto">
                  Join our network and reach thousands of health-conscious families across India.
                </p>
                <a href="/contact" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base">
                  Become a Partner
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

export default Farms;
