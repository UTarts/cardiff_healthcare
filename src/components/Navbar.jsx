import { useState } from 'react';
import { Menu, X, Sun, Moon, Phone, Info, Home, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom'; // We use Link for pages
import useTheme from '../hooks/useTheme';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation(); // To check which page is active

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Products", path: "/products", icon: <Package size={18} /> },
    { name: "About", path: "/about", icon: <Info size={18} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={18} /> },
  ];

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <img 
              src="/logo.webp" 
              alt="Cardiff Healthcare" 
              className="h-14 w-auto object-contain" 
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-2 font-medium transition-colors
                  ${isActive(link.path) 
                    ? 'text-medical-600 dark:text-medical-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-medical-500'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="text-slate-800 dark:text-yellow-400"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-800 dark:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-all
                    ${isActive(link.path)
                      ? 'bg-medical-50 dark:bg-medical-900/20 text-medical-600 dark:text-medical-400'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-slate-800'
                    }`}
                  onClick={() => setIsOpen(false)} // Close menu when clicked
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}