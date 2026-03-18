import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Leaf, Users, Award, Heart, Target, Sprout } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import bannerAbout from "@/assets/banner-about.jpg";

const About = () => {
  const values = [
    { icon: Leaf, title: "100% Organic", description: "Every product — from jaggery to vegetables — is certified organic, free from chemicals." },
    { icon: Users, title: "Farmer Partnerships", description: "We work directly with sugarcane farmers, rice growers, and vegetable cultivators across India." },
    { icon: Award, title: "Quality Assured", description: "Rigorous quality checks ensure only the purest jaggery, freshest rice, and crispest vegetables reach you." },
    { icon: Heart, title: "Health Focused", description: "Traditional foods like jaggery and organic rice provide natural nutrition without refined processing." },
  ];

  const team = [
    { name: "Ramesh Kumar", role: "Founder & CEO", image: "🌾" },
    { name: "Priya Sharma", role: "Head of Operations", image: "🥬" },
    { name: "Anand Reddy", role: "Farm Relations", image: "🪵" },
    { name: "Lakshmi Devi", role: "Quality Assurance", image: "🍚" },
  ];

  const milestones = [
    { year: "2018", event: "Founded OFH with a mission to bring pure organic jaggery and traditional foods to every home" },
    { year: "2019", event: "Partnered with 30+ organic sugarcane and rice farms across South India" },
    { year: "2020", event: "Launched home delivery of organic jaggery, rice, and fresh vegetables to 5,000+ families" },
    { year: "2021", event: "Introduced organic jaggery syrup and jaggery powder to expand our product line" },
    { year: "2022", event: "Expanded to 10 cities with same-day vegetable delivery" },
    { year: "2023", event: "Reached 50,000 happy customers and 100+ partner farms" },
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>About Us | OFH - The Organic Foods House</title>
        <meta name="description" content="Learn about The Organic Foods House - our mission to deliver pure organic jaggery, rice, and fresh vegetables from Indian farms to your table." />
      </Helmet>

      <div className="min-h-screen bg-background pb-mobile-nav">
        <Navbar />

        <main>
          {/* Hero Banner */}
          <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center">
            <img src={bannerAbout} alt="Organic farm landscape" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/60" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 text-center px-4 sm:px-6"
            >
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-primary-foreground/20">
                <Sprout className="h-4 w-4" />
                Our Story
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6">
                Pure Organic Foods,
                <br />
                Straight From the Farm
              </h1>
              <p className="font-body text-sm sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Families deserve access to pure, unprocessed foods — sourced directly from trusted organic farmers across India.
              </p>
            </motion.div>
          </section>

          {/* Mission Section */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-body text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">Our Mission</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    Reviving Traditional Foods, Supporting Organic Farmers
                  </h2>
                  <p className="font-body text-sm sm:text-base text-muted-foreground mb-4">
                    We're on a mission to bring back pure, traditional foods to Indian kitchens. Our organic jaggery is made from single-origin sugarcane, our rice is pesticide-free, and our vegetables are harvested fresh from organic farms.
                  </p>
                  <p className="font-body text-sm sm:text-base text-muted-foreground">
                    Every purchase directly supports small-scale organic farmers, reduces chemical dependency in agriculture, and promotes healthier eating habits.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative h-64 sm:h-80 rounded-3xl overflow-hidden"
                >
                  <img src={bannerAbout} alt="Organic farm" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-12 sm:py-16 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
                <p className="font-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                  These principles guide everything we do — from selecting the finest organic jaggery to delivering the freshest vegetables.
                </p>
              </motion.div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {values.map((value, index) => (
                  <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-card rounded-2xl p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <value.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{value.title}</h3>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
                <p className="font-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Passionate individuals dedicated to bringing you the purest organic foods from farm to table.</p>
              </motion.div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {team.map((member, index) => (
                  <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-2xl sm:text-4xl">
                      {member.image}
                    </div>
                    <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="py-12 sm:py-16 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Journey</h2>
              </motion.div>
              <div className="max-w-3xl mx-auto">
                {milestones.map((milestone, index) => (
                  <motion.div key={milestone.year} initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center">
                      <span className="font-display font-bold text-primary-foreground text-xs sm:text-sm">{milestone.year}</span>
                    </div>
                    <div className="flex-1 pt-2 sm:pt-4">
                      <p className="font-body text-sm sm:text-base text-foreground">{milestone.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default About;
