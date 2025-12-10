import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 lg:pt-16 overflow-hidden">
      
      {/* Background Blob Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        {/* FIXED: Increased blur to 'blur-[100px]' and lowered opacity to 0.4 for mobile to avoid "blocky" look */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-medical-200 dark:bg-medical-900/30 rounded-full blur-[80px] lg:blur-3xl opacity-40 lg:opacity-60"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 100, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[250px] lg:w-[400px] h-[250px] lg:h-[400px] bg-teal-100 dark:bg-teal-900/20 rounded-full blur-[80px] lg:blur-3xl opacity-40 lg:opacity-60"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* LEFT SIDE: Text Content */}
        {/* FIXED: Added 'order-2 lg:order-1' to push this BELOW image on mobile, but keep it LEFT on desktop */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left z-10 order-2 lg:order-1"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-medical-50 dark:bg-medical-900/50 border border-medical-100 dark:border-medical-800 text-medical-600 dark:text-medical-300 text-sm font-medium mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-medical-500"></span>
            </span>
            Trusted Pharmaceutical Partner Since 2018
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Committed to <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-500 to-teal-400">Health</span>,<br />
            Dedicated to <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-500 to-teal-400">Care.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Cardiff Healthcare provides world-class pharmaceutical solutions. 
            ISO Certified and driven by a mission to make quality medicine accessible to everyone in India and beyond.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/products" 
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-medical-500/25 hover:-translate-y-1"
            >
              View Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Contact Us
            </Link>
          </motion.div>
          
          {/* Trust Badges Strip */}
          <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-center lg:text-left">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">50+</h3>
              <p className="text-sm text-slate-500">Products</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">7+</h3>
              <p className="text-sm text-slate-500">Years Exp.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">100%</h3>
              <p className="text-sm text-slate-500">Certified</p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Floating 3D Visual */}
        {/* FIXED: Added 'order-1 lg:order-2' so it appears FIRST on mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative flex justify-center items-center order-1 lg:order-2" 
        >
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            {/* FIXED: Changed width to 'w-64' (smaller) for mobile, full size for desktop */}
            <img 
              src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1000&auto=format&fit=crop" 
              alt="Medical Laboratory" 
              className="rounded-3xl shadow-2xl shadow-medical-500/20 border-4 border-white dark:border-slate-800 w-64 sm:w-80 lg:w-full max-w-md"
            />
            
            {/* Floating Badge 1 */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              // FIXED: Adjusted position to be centered properly on the smaller mobile image
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:-bottom-10 lg:-left-10 bg-white dark:bg-slate-800 p-3 lg:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 whitespace-nowrap"
            >
              <div className="p-2 lg:p-3 bg-green-100 rounded-full text-green-600">
                <ShieldCheck size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div>
                <p className="text-[10px] lg:text-xs text-slate-500">Status</p>
                <p className="text-sm lg:text-base font-bold text-slate-800 dark:text-white">GMP Certified</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}