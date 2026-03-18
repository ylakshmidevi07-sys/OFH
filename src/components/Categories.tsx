import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import jaggeryImage from "@/assets/category-jaggery.jpg";
import riceImage from "@/assets/category-rice.jpg";
import vegetablesImage from "@/assets/category-vegetables.jpg";

const categories = [
  { id: 1, name: "Organic Jaggery", description: "Pure & natural sweeteners", image: jaggeryImage, count: 3, href: "/products?category=Jaggery" },
  { id: 2, name: "Organic Rice", description: "Chemical-free grains", image: riceImage, count: 1, href: "/products?category=Rice" },
  { id: 3, name: "Fresh Vegetables", description: "Farm fresh daily", image: vegetablesImage, count: 4, href: "/products?category=Vegetables" },
];

const Categories = () => {
  return (
    <section id="collections" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <div>
            <p className="font-body text-xs sm:text-sm uppercase tracking-[0.2em] text-primary mb-3 sm:mb-4 font-semibold">Shop By Category</p>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">Organic Goodness</h2>
          </div>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-md">
            Explore certified organic products — from traditional jaggery to farm-fresh vegetables.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={category.href} className="group relative aspect-[4/3] sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer block">
                <img src={category.image} alt={`${category.name} - organic produce`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-body text-xs sm:text-sm text-primary-foreground/70 mb-0.5 sm:mb-1">{category.description}</p>
                      <h3 className="font-display text-xl sm:text-3xl font-bold text-primary-foreground">{category.name}</h3>
                      <p className="font-body text-xs sm:text-sm text-primary-foreground/70 mt-1 sm:mt-2">{category.count} Products</p>
                    </div>
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                      <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
