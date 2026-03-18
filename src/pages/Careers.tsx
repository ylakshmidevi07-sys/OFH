import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Heart, Leaf, Users, Sparkles, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Careers = () => {
  const benefits = [
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision coverage for you and your family" },
    { icon: Leaf, title: "Organic Perks", description: "Free weekly organic produce box and 50% employee discount" },
    { icon: Coffee, title: "Flexible Work", description: "Remote-friendly roles, flexible hours, and unlimited PTO" },
    { icon: Users, title: "Growth Culture", description: "Learning stipend, mentorship programs, and career development" },
  ];

  const openings = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build scalable systems that power our farm-to-table operations.",
    },
    {
      title: "Supply Chain Manager",
      department: "Operations",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "Optimize logistics and ensure freshness from farm to doorstep.",
    },
    {
      title: "Marketing Coordinator",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Create campaigns that spread the organic food movement.",
    },
    {
      title: "Customer Success Specialist",
      department: "Support",
      location: "Remote",
      type: "Full-time",
      description: "Help our customers have the best organic shopping experience.",
    },
    {
      title: "Farm Partnership Lead",
      department: "Business Development",
      location: "Various Locations",
      type: "Full-time",
      description: "Build and maintain relationships with our organic farm partners.",
    },
    {
      title: "Delivery Driver",
      department: "Logistics",
      location: "Multiple Cities",
      type: "Part-time",
      description: "Deliver fresh organic goodness to our customers' doorsteps.",
    },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Sustainability First",
      description: "Every decision considers environmental impact",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "We support local farms and communities",
    },
    {
      icon: Heart,
      title: "Passionate Team",
      description: "United by our love for organic food",
    },
    {
      icon: Sparkles,
      title: "Innovation Minded",
      description: "Always finding better ways to serve",
    },
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>Careers | OFH - The Organic Foods House</title>
        <meta
          name="description"
          content="Join The Organic Foods House team. Explore career opportunities and help us bring fresh organic food to families everywhere."
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
                  <Briefcase className="h-4 w-4" />
                  Join Our Team
                </span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Grow Your Career With Us
                </h1>
                <p className="font-body text-lg text-muted-foreground">
                  Join a passionate team on a mission to make organic food accessible to everyone. 
                  We're building something meaningful, and we'd love for you to be part of it.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Culture Values */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Our Culture
                </h2>
                <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                  Values that guide how we work and grow together.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Benefits & Perks
                </h2>
                <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                  We take care of our team so they can take care of our customers.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Open Positions */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Open Positions
                </h2>
                <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                  Find your next opportunity and join our growing team.
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto space-y-4">
                {openings.map((job, index) => (
                  <motion.div
                    key={job.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {job.department}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                          {job.title}
                        </h3>
                        <p className="font-body text-sm text-muted-foreground">
                          {job.description}
                        </p>
                      </div>
                      <Button variant="outline" className="flex-shrink-0">
                        Apply Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                  Don't See the Right Role?
                </h2>
                <p className="font-body text-muted-foreground mb-6 max-w-xl mx-auto">
                  We're always looking for talented people. Send us your resume and we'll keep 
                  you in mind for future opportunities.
                </p>
                <Button asChild>
                  <a href="/contact">Get In Touch</a>
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

export default Careers;
