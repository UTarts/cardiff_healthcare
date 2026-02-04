import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Send, Plus, X, ShoppingBag, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    phone: '', // Added Phone
    email: '', 
    message: ''
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('name');
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  // Handle Prefill from Products Page
  useEffect(() => {
    if (location.state?.prefill && !selectedProducts.includes(location.state.prefill)) {
      setSelectedProducts([location.state.prefill]);
    }
  }, [location.state]);

  const addProduct = (e) => {
    const p = e.target.value;
    if (p && !selectedProducts.includes(p)) setSelectedProducts([...selectedProducts, p]);
    setDropdownValue("");
  };

  const removeProduct = (p) => setSelectedProducts(selectedProducts.filter(i => i !== p));

  // --- CORE SUBMISSION LOGIC ---
  const processSubmission = async (openWhatsApp = false) => {
    if (!formData.firstName || !formData.phone || !formData.email || !formData.message) {
      alert("Please fill in all required fields (Name, Phone, Email, Message).");
      return;
    }

    setLoading(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const productList = selectedProducts.join(', ');

    const { error } = await supabase.from('inquiries').insert([{
      customer_name: fullName,
      customer_email: formData.email,
      customer_phone: formData.phone, 
      message: formData.message,    
      selected_products: productList,
      status: 'New'
    }]);

    if (error) {
      alert("Error saving data: " + error.message);
      setLoading(false);
      return;
    }

    // 2. SEND EMAIL (EmailJS)
    const serviceID = 'YOUR_SERVICE_ID'; 
    const templateID = 'YOUR_TEMPLATE_ID'; 
    const publicKey = 'YOUR_PUBLIC_KEY';

    const emailParams = {
      to_name: "Admin",
      from_name: fullName,
      phone: formData.phone, 
      message: formData.message,
      products: productList,
      reply_to: formData.email
    };

    emailjs.send(serviceID, templateID, emailParams, publicKey)
      .then(() => console.log('Email sent'))
      .catch((err) => console.error('Email failed', err));

    // 3. OPTIONAL: OPEN WHATSAPP
    if (openWhatsApp) {
      const text = `*New Inquiry*\nName: ${fullName}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nMsg: ${formData.message}\nProducts: ${productList}`;
      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
    }

    // Cleanup
    alert(openWhatsApp ? "Redirecting to WhatsApp..." : "Inquiry Submitted Successfully!");
    setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' });
    setSelectedProducts([]);
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Get in <span className="text-medical-500">Touch</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* --- LEFT COLUMN: INFO + MAP --- */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
             
             {/* Contact Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Phone className="text-medical-500 mb-4" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white">Call Us</h3>
                <a href="tel:+919876543210" className="text-slate-500 text-sm hover:text-medical-500">+91 98765 43210</a>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Mail className="text-medical-500 mb-4" size={24} />
                <h3 className="font-bold text-slate-900 dark:text-white">Email Us</h3>
                <a href="mailto:info@cardiffhealthcare.in" className="text-slate-500 text-sm hover:text-medical-500">info@cardiffhealthcare.in</a>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
              <MapPin className="text-medical-500 shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Registered Office</h3>
                <p className="text-slate-500 text-sm">Near Diptyganj Railway Crossing, Nilmatha Cantt., Lucknow - 226002</p>
              </div>
            </div>

            {/* MAP MOVED HERE (Left Side) */}
            <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.106662236655!2d80.9695!3d26.8365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUwJzExLjQiTiA4MMKwNTgnMTAuMiJF!5e0!3m2!1sen!2sin!4v1631234567890!5m2!1sen!2sin" // Use valid embed link here
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
            </div>

          </motion.div>

          {/* --- RIGHT COLUMN: FORM ONLY --- */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 h-fit">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <ShoppingBag className="text-medical-500"/> Request Quote
            </h3>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              
              {/* Product Selection */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-4 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Interested Products</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedProducts.map((p) => (
                    <span key={p} className="bg-medical-100 dark:bg-medical-900 text-medical-700 dark:text-medical-300 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      {p} <button type="button" onClick={() => removeProduct(p)}><X size={14} /></button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                   <select value={dropdownValue} onChange={addProduct} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 outline-none dark:text-white appearance-none">
                     <option value="" disabled>+ Add another product...</option>
                     {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                   </select>
                   <Plus className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={18}/>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">First Name *</label>
                   <input required placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none dark:text-white" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                   <input placeholder="Optional" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none dark:text-white" />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase">Phone Number *</label>
                 <input required type="tel" placeholder="+91 98765..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none dark:text-white" />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase">Email Address *</label>
                 <input required type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none dark:text-white" />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase">Message *</label>
                 <textarea required rows="4" placeholder="How can we help you?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 outline-none dark:text-white resize-none"></textarea>
              </div>

              {/* TWO BUTTONS SECTION */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button 
                  onClick={() => processSubmission(false)} // Just Submit
                  disabled={loading}
                  className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                   {loading ? "Sending..." : "Submit Inquiry"} <Send size={18} />
                </button>

                <button 
                  onClick={() => processSubmission(true)} // Submit + WhatsApp
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                   Submit on WhatsApp <MessageCircle size={18} />
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}