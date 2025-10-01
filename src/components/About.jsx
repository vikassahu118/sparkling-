import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  Shield,
  Award,
  Users,
  Sparkles,
  Shirt,
  Globe,
  Leaf,
  TrendingUp,
  Briefcase,
  GraduationCap,
} from "lucide-react";
// Assuming you have 'react-router-dom' installed and configured for navigation

const About = ({ onViewChange}) => {

  // This function handles the click event for the "Shop Now" button.
  // It directs the user to the "/shop" route.
  const handleShopNowClick = () => {
    if (onViewChange) {
      onViewChange('shop')
    }
    
  };

  const values = [
    {
      icon: Heart,
      title: "Made with Love",
      description:
        "Every piece is crafted with care and attention to detail, ensuring your little ones feel special in everything they wear.",
      color: "from-pink-400 to-rose-500",
      emoji: "💖",
    },
    {
      icon: Shield,
      title: "Safety First",
      description:
        "We use only premium, child-safe materials that are tested for quality and safety standards worldwide.",
      color: "from-blue-400 to-cyan-500",
      emoji: "🛡",
    },
    {
      icon: Sparkles,
      title: "Spark Imagination",
      description:
        "Our designs inspire creativity and imagination, helping children express their unique personalities.",
      color: "from-purple-400 to-violet-500",
      emoji: "✨",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description:
        "Committed to sustainable practices and eco-friendly materials for a better future for our children.",
      color: "from-green-400 to-emerald-500",
      emoji: "🌱",
    },
  ];

  const stats = [
    // Note: Placeholder numbers are used here, you can fill these in dynamically.
    { icon: Users, number: "250K+", label: "Happy Families", color: "text-pink-600" },
    { icon: Shirt, number: "500+", label: "Unique Designs", color: "text-purple-600" },
    { icon: Star, number: "4.9/5", label: "Customer Rating", color: "text-yellow-600" },
    { icon: TrendingUp, number: "90%", label: "Return Customers", color: "text-cyan-600" },
  ];

  const timeline = [
    {
      title: "Our Humble Beginnings",
      description: "Started as a small family business with a dream to create quality kids clothing.",
      icon: Briefcase,
    },
    {
      title: "First International Order",
      description: "Expanded our reach beyond borders, serving families worldwide.",
      icon: Globe,
    },
    {
      title: "Award Recognition",
      description: "Won multiple awards for sustainable fashion and innovative kidswear.",
      icon: Award,
    },
    {
      title: "Future Ahead",
      description: "Continuing our mission to make kids fashion safe, fun, and eco-friendly.",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="pt-20">
      {/* Core Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Our Core Values 💝
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do, from design to delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-pink-200/50 dark:border-purple-700/50 text-center"
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl mb-4 text-white shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                  <div className="text-3xl mb-3">{value.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-cyan-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Our Achievements 🏆
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Numbers that showcase our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center border border-pink-200/50 dark:border-purple-700/50"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl mb-3`}
                  >
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">
              Our Journey 📖
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Milestones that shaped who we are today
            </p>
          </motion.div>

          <div className="relative border-l border-purple-300 dark:border-purple-600 ml-6">
            {timeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="mb-10 ml-6"
                >
                  <div className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-purple-500">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Join Our Journey? 🚀
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg mb-8 max-w-2xl mx-auto"
          >
            Discover fashion that cares for your child and the planet.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100"
            onClick={handleShopNowClick} // Calls the function to navigate to "/shop"
          >
            Shop Now
          </motion.button>
        </div>
      </section>
    </div>
  );
}

export default About;
