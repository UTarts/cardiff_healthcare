import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Home() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    // Fetch products where 'is_top_seller' is set to TRUE
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_top_seller', true)
      .limit(3);

    if (error) {
      console.error('Error fetching top products:', error);
    } else {
      setTopProducts(data || []);
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
    </>
  );
}