import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get data passed from Home
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
        
        // --- DEEP LINKING LOGIC ---
        // Checks if Home page sent a Product ID to open
        if (location.state?.openProductId) {
          const targetProduct = data.find(p => p.id === location.state.openProductId);
          if (targetProduct) {
            setSelectedProduct(targetProduct);
            // Clear history state so refresh doesn't reopen it
            window.history.replaceState({}, document.title);
          }
        }
      } catch (error) { 
        console.error("Error", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProducts();
  }, []);

  const openLightbox = (product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  const categories = ["All", ...new Set(products.map(p => p.category || "Other"))];

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const searchLower = searchTerm.toLowerCase();
      const name = product.name?.toLowerCase() || "";
      const uses = product.uses?.toLowerCase() || "";
      const comp = product.composition?.toLowerCase() || "";
      const matchesSearch = name.includes(searchLower) || uses.includes(searchLower) || comp.includes(searchLower);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      if (sortOrder === "asc") return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });

  // --- SKELETON LOADER COMPONENT ---
  const ProductSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[300px] animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-800"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Complete Product <span className="text-medical-500">Catalog</span>
          </h2>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 justify-between items-center">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-medical-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-medical-500'}`}>{cat}</button>
            ))}
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-medical-500 cursor-pointer">
               <option value="asc">Name (A-Z)</option>
               <option value="desc">Name (Z-A)</option>
             </select>
             <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none" />
             </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {loading ? (
             // Show Skeletons while loading
             [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <motion.div layout key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all cursor-pointer" onClick={() => openLightbox(product)}>
                  <div className="h-32 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    <img 
                      src={product.images?.[0] || "https://via.placeholder.com/400"} 
                      alt={product.name} 
                      loading="lazy" // <--- PERFORMANCE BOOST
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-medical-600 border border-slate-200">{product.category}</div>
                  </div>
                  <div className="p-3 sm:p-6">
                    <h3 className="text-sm sm:text-xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 truncate">{product.name}</h3>
                    <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 mb-2 sm:mb-4 font-medium truncate">{product.composition}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] sm:text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{product.pack_size}</span>
                      <span className="hidden sm:flex items-center gap-1 text-sm font-semibold text-medical-600">Details <ChevronRight size={16} /></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 p-2 bg-slate-100/50 dark:bg-black/50 hover:bg-slate-200 dark:hover:bg-black/80 rounded-full backdrop-blur"><X size={20} /></button>
                
                <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col">
                  <div className="flex-1 relative flex items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4 group">
                     <img src={selectedProduct.images?.[activeImageIndex]} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-125 cursor-zoom-in" alt={selectedProduct.name}/>
                  </div>
                  <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar justify-center">
                     {selectedProduct.images?.map((img, idx) => (
                       <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 ${activeImageIndex === idx ? 'border-medical-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                         <img src={img} className="w-full h-full object-cover" />
                       </button>
                     ))}
                  </div>
                </div>

                <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
                  <div className="inline-block px-3 py-1 bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-300 rounded-full text-xs font-bold mb-4">{selectedProduct.category}</div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedProduct.name}</h2>
                  <p className="text-lg text-medical-600 font-medium mb-6">{selectedProduct.composition}</p>
                  <div className="space-y-6">
                    <div><h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Uses</h4><p className="text-slate-700 dark:text-slate-300 text-lg">{selectedProduct.uses}</p></div>
                    <div><h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Description</h4><p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedProduct.description}</p></div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-3 rounded-lg flex gap-3 items-start"><AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} /><p className="text-xs text-red-600 dark:text-red-300"><strong>Disclaimer:</strong> Schedule H drug. To be sold by retail on the prescription of a Registered Medical Practitioner only. B2B Info only.</p></div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800"><button onClick={() => navigate('/contact', { state: { prefill: selectedProduct.name } })} className="w-full py-4 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-medical-500/25">Add to Inquiry & Contact</button></div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}