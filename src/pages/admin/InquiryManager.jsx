import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Clock, Mail, MessageCircle, CheckCircle, Phone } from 'lucide-react';

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false }); // Newest first
    
    if (error) console.error('Error fetching inquiries:', error);
    else setInquiries(data);
    setLoading(false);
  };

  // Function to mark as 'Contacted'
  const markAsContacted = async (id) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status: 'Contacted' })
      .eq('id', id);
    
    if (!error) fetchInquiries(); // Refresh list
  };

  if (loading) return <div className="text-center py-10">Loading Inquiries...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Customer Inquiries</h2>
      
      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <p className="text-slate-500">No inquiries yet.</p>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
              <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{inquiry.customer_name}</h3>
                  
                  {/* Contact Details Row */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                    
                    {/* Email */}
                    <a href={`mailto:${inquiry.customer_email}`} className="flex items-center gap-1 hover:text-medical-600 transition-colors">
                      <Mail size={14} /> {inquiry.customer_email}
                    </a>

                    {/* Phone (New) */}
                    {inquiry.customer_phone && (
                      <a href={`tel:${inquiry.customer_phone}`} className="flex items-center gap-1 hover:text-medical-600 transition-colors">
                        <Phone size={14} /> {inquiry.customer_phone}
                      </a>
                    )}

                    {/* Date */}
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock size={14} /> 
                      {new Date(inquiry.created_at).toLocaleString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${inquiry.status === 'New' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {inquiry.status}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{inquiry.message}"</p>
              </div>

              {inquiry.selected_products && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Interested In:</p>
                  <div className="flex flex-wrap gap-2">
                    {inquiry.selected_products.split(', ').map((prod, idx) => (
                      <span key={idx} className="px-2 py-1 bg-medical-50 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400 text-xs rounded border border-medical-100 dark:border-medical-800">
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href={`mailto:${inquiry.customer_email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors dark:text-white"
                >
                  <Mail size={16} /> Reply via Email
                </a>
                {inquiry.status === 'New' && (
                  <button 
                    onClick={() => markAsContacted(inquiry.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={16} /> Mark as Done
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}