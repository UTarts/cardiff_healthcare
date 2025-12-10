import { ShieldCheck, Users, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Pioneering Healthcare in <span className="text-medical-500">Uttar Pradesh</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            Founded in 2018, Cardiff Healthcare Private Limited has grown from a small vision into a trusted name in pharmaceuticals. 
            Under the leadership of Mr. Alok Tripathi, we strive to make quality healthcare accessible to all.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { label: "Founded", value: "2018", icon: <Target /> },
            { label: "Products", value: "50+", icon: <Award /> },
            { label: "Compliance", value: "100%", icon: <ShieldCheck /> },
            { label: "Team", value: "Expert", icon: <Users /> },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm text-center border border-slate-200 dark:border-slate-800"
            >
              <div className="mx-auto w-12 h-12 bg-medical-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-medical-500 mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              To provide high-quality, affordable medicines that meet international standards. We believe that good health is a fundamental right, not a privilege.
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To become a leading pharmaceutical company in India, known for innovation, ethical business practices, and unwavering commitment to patient safety.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-medical-500 blur-[100px] opacity-20 rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" 
              alt="Medical Team" 
              className="relative rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-slate-800"
            />
          </div>
        </div>

      </div>
    </div>
  );
}