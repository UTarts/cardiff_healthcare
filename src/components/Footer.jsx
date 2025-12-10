import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, ArrowRight, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Footer() {
  const { user } = useAuth();
  const location = useLocation();
  // Check if we are currently on the admin dashboard
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    // Added dynamic class: if isAdminPage is true, add 'md:ml-64' to push footer right
    <footer className={`bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-all duration-300 ${isAdminPage ? 'md:ml-64' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Company Info */}
          <div>
            {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
            {/* Replace the old 'C' div with this Image tag */}
            <img 
              src="/logo.webp" 
              alt="Cardiff Healthcare" 
              className="h-9 w-auto object-contain" 
            />
            <span className="font-bold text-xl text-slate-800 dark:text-white">Cardiff <span className="text-medical-500">Healthcare</span></span>
          </Link>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Committed to Health, Dedicated to Care. An ISO Certified Pharmaceutical Company delivering quality medicines since 2018.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-medical-500 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-medical-500 hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:bg-medical-500 hover:text-white transition-all"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-medical-500 transition-colors flex items-center gap-2"><ArrowRight size={14}/> Home</Link></li>
              <li><Link to="/products" className="hover:text-medical-500 transition-colors flex items-center gap-2"><ArrowRight size={14}/> Our Products</Link></li>
              <li><Link to="/about" className="hover:text-medical-500 transition-colors flex items-center gap-2"><ArrowRight size={14}/> About Us</Link></li>
              <li><Link to="/contact" className="hover:text-medical-500 transition-colors flex items-center gap-2"><ArrowRight size={14}/> Contact Support</Link></li>
              {/* ADDED ADMIN LOGIN LINK */}
              <li>
                {user ? (
                  <Link to="/admin" className="hover:text-medical-500 transition-colors flex items-center gap-2 font-semibold text-medical-600">
                    <Lock size={14}/> Admin Panel
                  </Link>
                ) : (
                  <Link to="/login" className="hover:text-medical-500 transition-colors flex items-center gap-2 font-semibold text-slate-400">
                    <Lock size={14}/> Admin Login
                  </Link>
                )}
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-medical-500 mt-1 shrink-0" size={18} />
                <span>Near Diptyganj Railway Crossing, Nilmatha Cantt., Lucknow, UP - 226002</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-medical-500 shrink-0" size={18} />
                <a href="tel:+919876543210" className="hover:text-medical-500 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-medical-500 shrink-0" size={18} />
                <a href="mailto:info@cardiffhealthcare.in" className="hover:text-medical-500 transition-colors">info@cardiffhealthcare.in</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 mb-2 font-bold">CIN Number:</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono mb-4">U85100UP2018PTC106333</p>
              <p className="text-xs text-slate-500 mb-2 font-bold">Registration No:</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">106333</p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
          <a href="https://www.utarts.in" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 text-center no-underline">
            <img src="https://utarts.in/images/poweredbyutarts.webp" alt="Powered by UT Arts" className="h-[50px] w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs text-slate-400 group-hover:text-medical-500 transition-colors">visit www.utarts.in</span>
          </a>
          <p className="mt-4 text-xs text-slate-400">© {new Date().getFullYear()} Cardiff Healthcare Pvt Ltd. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}