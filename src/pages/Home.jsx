import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { ArrowRight, X, Pill } from 'lucide-react'; // Added X and Pill icons
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion'; // Added for animations

export default function Home() {
  const [topProducts, setTopProducts] = useState([]);
  const [articles, setArticles] = useState([]); // State for articles
  const [selectedArticle, setSelectedArticle] = useState(null); // State for modal
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch Top Sellers (Your existing logic)
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('is_top_seller', true)
      .limit(3);

    if (productError) {
      console.error('Error fetching top products:', productError);
    } else {
      setTopProducts(productData || []);
    }

    // 2. Fetch Articles (New Logic)
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .limit(3);

    if (articleError) {
      console.error('Error fetching articles:', articleError);
    } else {
      setArticles(articleData || []);
    }

    setLoading(false);
  };

  return (
    <>
      <Hero />
      
      {/* Best Sellers Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Top Selling <span className="text-medical-500">Medicines</span></h2>
              <p className="text-slate-500 mt-2">Trusted by doctors and patients across UP.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-medical-600 font-semibold hover:gap-3 transition-all">
              View All Products <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading best sellers...</div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl">
              No products marked as "Top Seller" in Admin Panel yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topProducts.map(product => (
                <div key={product.id} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                  <img 
                    src={product.images?.[0] || "https://via.placeholder.com/400"}
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-xl mb-4 bg-white" 
                  />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{product.composition}</p>
                  <Link to="/products" className="block text-center w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-medical-50 dark:hover:bg-slate-700 transition-colors">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {/* Mobile View All Button */}
          <div className="mt-8 text-center sm:hidden">
             <Link to="/products" className="inline-flex items-center gap-2 text-medical-600 font-semibold">
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- NEW: HEALTH TIPS & ARTICLES SECTION --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Health & <span className="text-medical-500">Wellness</span></h2>
            <p className="text-slate-600 dark:text-slate-400">Expert advice and tips to keep you and your family healthy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <motion.div 
                key={article.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer group"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="h-48 overflow-hidden">
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-medical-600 font-bold text-sm group-hover:gap-3 transition-all">
                    Read Article <ArrowRight size={16} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW: ARTICLE LIGHTBOX (MODAL) --- */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur"
              >
                <X size={20} />
              </button>

              {/* Image */}
              <div className="h-56 shrink-0 bg-slate-200">
                <img src={selectedArticle.image_url} className="w-full h-full object-cover" />
              </div>

              {/* Scrollable Text */}
              <div className="p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{selectedArticle.title}</h2>
                
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-4 whitespace-pre-line leading-relaxed">
                  {selectedArticle.content}
                </div>

                {/* Recommended Product Box */}
                {selectedArticle.recommended_product && (
                  <div className="mt-10 p-6 bg-medical-50 dark:bg-medical-900/20 rounded-xl border border-medical-100 dark:border-medical-800 flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm text-medical-500">
                      <Pill size={32} />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-xs font-bold text-medical-600 uppercase mb-1">Our Recommendation</p>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Try {selectedArticle.recommended_product}</h4>
                      <p className="text-sm text-slate-500">Effective for the symptoms mentioned above.</p>
                    </div>
                    <button 
                      onClick={() => navigate('/products')}
                      className="px-6 py-2 bg-medical-600 text-white font-semibold rounded-lg hover:bg-medical-700 transition-colors shadow-lg shadow-medical-500/20"
                    >
                      View Product
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}