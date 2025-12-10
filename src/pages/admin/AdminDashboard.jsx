import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Package, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import InquiryManager from './InquiryManager';
import ProductManager from './ProductManager';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inquiries');
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 pt-16 overflow-x-hidden">
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto`}>
        
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <img 
              src={profile?.avatar_url || "https://via.placeholder.com/150"} 
              alt="Admin" 
              className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover"
            />
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{profile?.full_name || "Admin User"}</p>
              <p className="text-xs text-medical-500 font-medium">{profile?.position || "Manager"}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('inquiries'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'inquiries' ? 'bg-medical-50 text-medical-600 dark:bg-medical-900/20 dark:text-medical-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <MessageSquare size={20} /> Inquiries
          </button>
          <button 
            onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'products' ? 'bg-medical-50 text-medical-600 dark:bg-medical-900/20 dark:text-medical-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Package size={20} /> Products
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* FIXED: Changed p-6 to p-3 md:p-6 so it doesn't overflow on mobile */}
      <main className={`flex-1 md:ml-64 transition-all duration-300 p-3 md:p-6 w-full max-w-[100vw]`}>
        
        {/* Mobile Header */}
        <div className="md:hidden mb-4 flex items-center justify-between">
           <h1 className="font-bold text-xl dark:text-white">Dashboard</h1>
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>

        {/* Large Profile Card */}
        {/* FIXED: Added flex-col for mobile, reduced padding, ensured w-full */}
        <div className="bg-gradient-to-r from-medical-600 to-medical-800 rounded-2xl p-4 sm:p-6 mb-6 text-white flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xl w-full">
           <img 
              src={profile?.avatar_url || "https://via.placeholder.com/150"} 
              alt="Admin" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 shadow-lg object-cover"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold">{profile?.full_name || "Admin User"}</h2>
              <p className="text-medical-100 text-base sm:text-lg">{profile?.position || "Director"}</p>
              <p className="text-sm opacity-70 mt-1">Welcome back to your dashboard.</p>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[500px] p-3 sm:p-6">
          {activeTab === 'inquiries' && <InquiryManager />}
          {activeTab === 'products' && <ProductManager />}
        </div>
      </main>
    </div>
  );
}