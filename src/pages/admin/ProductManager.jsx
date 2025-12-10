import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Plus, Trash2, Image as ImageIcon, Loader, X, Star, Edit2, UploadCloud } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '', category: 'Tablet', composition: '', uses: '', pack_size: '', description: '', is_top_seller: false
  });
  
  // New State for Multiple Images
  const [imageFiles, setImageFiles] = useState([]); // Files to upload
  const [previewUrls, setPreviewUrls] = useState([]); // Previews for UI
  const [existingImages, setExistingImages] = useState([]); // URLs already in DB (for editing)

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, category: product.category, composition: product.composition,
      uses: product.uses, pack_size: product.pack_size, description: product.description,
      is_top_seller: product.is_top_seller
    });
    // Load existing images from the Array column
    setExistingImages(product.images || []); 
    setImageFiles([]); 
    setPreviewUrls([]);
    setShowForm(true);
    window.scrollTo(0,0);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]); // Add to existing selection
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (urlToRemove) => {
    setExistingImages(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setUploading(true);

    let finalImageUrls = [...existingImages]; // Start with what we kept

    // 1. Upload New Images
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: imageError } = await supabase.storage.from('medicine-images').upload(fileName, file);
        if (imageError) { alert(`Failed to upload ${file.name}`); continue; }
        
        const { data: urlData } = supabase.storage.from('medicine-images').getPublicUrl(fileName);
        finalImageUrls.push(urlData.publicUrl);
      }
    }

    // Validation: Must have at least one image
    if (finalImageUrls.length === 0) {
      alert("Product must have at least one image!");
      setUploading(false);
      return;
    }

    const productData = { ...formData, images: finalImageUrls };

    let error;
    if (editingProduct) {
      const { error: updateError } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('products').insert([productData]);
      error = insertError;
    }

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(editingProduct ? "Product updated!" : "Product added!");
      resetForm();
      fetchProducts();
    }
    setUploading(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', category: 'Tablet', composition: '', uses: '', pack_size: '', description: '', is_top_seller: false });
    setImageFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Product Management</h2>
        <button 
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-colors text-sm"
        >
          {showForm ? <X size={18}/> : <Plus size={18}/>} {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8">
          <h3 className="text-lg font-bold mb-4 dark:text-white">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
             <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white">
               <option>Tablet</option><option>Capsule</option><option>Syrup</option><option>Injection</option><option>Ointment</option><option>Powder</option><option>Oil</option><option>Dry Syrup</option>
             </select>
             <input required placeholder="Composition" value={formData.composition} onChange={e => setFormData({...formData, composition: e.target.value})} className="p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
             <input required placeholder="Uses" value={formData.uses} onChange={e => setFormData({...formData, uses: e.target.value})} className="p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
             <input required placeholder="Pack Size" value={formData.pack_size} onChange={e => setFormData({...formData, pack_size: e.target.value})} className="p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
             
             <div className="md:col-span-2">
                <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white" rows="3"></textarea>
             </div>
             
             {/* MULTI IMAGE UPLOAD AREA */}
             <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Images (Upload Multiple)</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="text-medical-500" size={32} />
                    <span className="text-sm text-slate-500">Click to select images</span>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {/* Existing Images (From DB) */}
                  {existingImages.map((url, idx) => (
                    <div key={`exist-${idx}`} className="relative w-20 h-20 shrink-0">
                      <img src={url} className="w-full h-full object-cover rounded-lg border border-blue-400" />
                      <button type="button" onClick={() => removeExistingImage(url)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                    </div>
                  ))}
                  {/* New Previews (Local) */}
                  {previewUrls.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative w-20 h-20 shrink-0">
                      <img src={url} className="w-full h-full object-cover rounded-lg border border-green-400" />
                      <button type="button" onClick={() => removePreview(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                    </div>
                  ))}
                </div>
             </div>

             <div className="md:col-span-2 flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer" onClick={() => setFormData({...formData, is_top_seller: !formData.is_top_seller})}>
               <div className={`w-6 h-6 rounded border flex items-center justify-center ${formData.is_top_seller ? 'bg-yellow-400 border-yellow-400' : 'bg-white border-slate-300'}`}>
                 {formData.is_top_seller && <Star size={16} className="text-white fill-white" />}
               </div>
               <label className="cursor-pointer font-bold text-slate-700 dark:text-slate-200 select-none text-sm">Mark as Top Seller</label>
             </div>

             <button type="submit" disabled={uploading} className="md:col-span-2 w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl flex justify-center items-center gap-2">
                {uploading ? <Loader className="animate-spin"/> : (editingProduct ? "Update Product" : "Save Product")}
             </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-3 items-center relative shadow-sm">
            {/* Display the first image from the array */}
            <img 
              src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/150"} 
              alt={product.name} 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-slate-100 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base">{product.name}</h4>
              <p className="text-xs text-slate-500 truncate">{product.category}</p>
              {product.is_top_seller && <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold mt-1">Top Seller</span>}
            </div>
            <div className="flex gap-1 sm:gap-2 shrink-0">
               <button onClick={() => handleEditClick(product)} className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                 <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
               </button>
               <button onClick={() => handleDelete(product.id)} className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                 <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}