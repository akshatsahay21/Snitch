import React, { useEffect, useState } from 'react'
import { useProduct } from '../hooks/useProduct';
import { useParams, useNavigate } from 'react-router';

// Helper icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

const SellerProductDetails = () => {
  const [ product, setProduct ] = useState(null);
  const [ localVariants, setLocalVariants ] = useState([]);
  const [ isAddingVariant, setIsAddingVariant ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  // New grouped variant state
  const [ variantGroup, setVariantGroup ] = useState({
    primaryAttributeKey: 'Color',
    primaryAttributeValue: '',
    images: []
  });

  const [ subVariants, setSubVariants ] = useState([
    { subAttributeKey: 'Size', subAttributeValue: '', stock: 0, priceAmount: '' }
  ]);

  const { productId } = useParams();
  const { handleGetProductById, handleAddProductVariant, handleDeleteProduct, handleUpdateProduct } = useProduct();
  const navigate = useNavigate ? useNavigate() : null;

  // Edit listing state
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editForm, setEditForm ] = useState({ title: '', description: '', priceAmount: '' });
  const [ editSaving, setEditSaving ] = useState(false);
  const [ deleteConfirm, setDeleteConfirm ] = useState(false);
  const [ deleting, setDeleting ] = useState(false);

  async function fetchProductDetails() {
    setLoading(true);
    try {
      const data = await handleGetProductById(productId);
      const prod = data?.product || data;
      setProduct(prod);
      // Initialize variants locally
      if (prod?.variants) {
        setLocalVariants(prod.variants);
      }
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [ productId ]);

  // Open edit form with current values
  const openEdit = () => {
    setEditForm({
      title: product?.title ?? '',
      description: product?.description ?? '',
      priceAmount: product?.price?.amount ?? ''
    });
    setIsEditing(true);
  };

  const saveEdit = async () => {
    setEditSaving(true);
    try {
      const updated = await handleUpdateProduct(productId, editForm);
      setProduct(prev => ({ ...prev, ...updated }));
      setIsEditing(false);
    } catch (e) {
      alert('Failed to update product.');
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await handleDeleteProduct(productId);
      navigate('/seller/dashboard');
    } catch (e) {
      alert('Failed to delete product.');
      setDeleting(false);
    }
  };

  // Handlers for modifying existing variant stock natively
  const handleStockChange = (index, newStock) => {
    const updatedVariants = [ ...localVariants ];
    updatedVariants[ index ] = { ...updatedVariants[ index ], stock: Number(newStock) };
    setLocalVariants(updatedVariants);
  };

  // Handlers for Grouped Variant Form
  const handleAddNewVariantGroup = async () => {
    // Validate primary attribute
    if (!variantGroup.primaryAttributeKey.trim() || !variantGroup.primaryAttributeValue.trim()) {
      alert("Primary attribute (e.g. Color) and its value are required.");
      return;
    }

    // Validate subVariants
    const validSubVariants = subVariants.filter(sv => sv.subAttributeKey.trim() && sv.subAttributeValue.trim());
    if (validSubVariants.length === 0) {
      alert("At least one sub-variant (e.g. Size) with a value is required.");
      return;
    }

    // Prepare images
    const cleanImages = variantGroup.images.map(img => ({ url: img.previewUrl, file: img.file }));

    // Prepare variantsData array
    const variantsData = validSubVariants.map(sv => ({
      stock: Number(sv.stock) || 0,
      priceAmount: sv.priceAmount ? Number(sv.priceAmount) : undefined,
      attributes: {
        [variantGroup.primaryAttributeKey.trim()]: variantGroup.primaryAttributeValue.trim(),
        [sv.subAttributeKey.trim()]: sv.subAttributeValue.trim()
      }
    }));

    // Local state update for immediate UI feedback
    const variantsToSaveLocal = variantsData.map(vd => ({
      images: cleanImages,
      stock: vd.stock,
      attributes: vd.attributes,
      price: vd.priceAmount ? { amount: vd.priceAmount, currency: 'INR' } : undefined
    }));

    setLocalVariants([ ...localVariants, ...variantsToSaveLocal ]);
    setIsAddingVariant(false);

    const payload = {
      images: cleanImages,
      variantsData: variantsData
    };

    await handleAddProductVariant(productId, payload);

    // Reset form
    setVariantGroup({ primaryAttributeKey: 'Color', primaryAttributeValue: '', images: [] });
    setSubVariants([ { subAttributeKey: 'Size', subAttributeValue: '', stock: 0, priceAmount: '' } ]);
  };

  const handleAddSubVariant = () => {
    setSubVariants(prev => [ ...prev, { subAttributeKey: 'Size', subAttributeValue: '', stock: 0, priceAmount: '' } ]);
  };

  const handleSubVariantChange = (index, field, value) => {
    const updated = [ ...subVariants ];
    updated[ index ][ field ] = value;
    setSubVariants(updated);
  };

  const handleRemoveSubVariant = (index) => {
    setSubVariants(subVariants.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 7 - variantGroup.images.length;
    const filesToAdd = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(`You can only upload up to 7 images. ${filesToAdd.length} added.`);
    }

    const newImageObjects = filesToAdd.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setVariantGroup(prev => ({
      ...prev,
      images: [ ...prev.images, ...newImageObjects ]
    }));

    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = variantGroup.images[ index ];
    if (imageToRemove?.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    const updatedImages = variantGroup.images.filter((_, i) => i !== index);
    setVariantGroup(prev => ({ ...prev, images: updatedImages }));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center text-[#1b1c1a] font-serif">Loading gallery...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center text-[#1b1c1a] font-serif">Product Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-sans pb-24">
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-10 bg-[#fbf9f6]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl tracking-wide uppercase">{product.title?.substring(0, 20)}{product.title?.length > 20 ? '...' : ''}</h1>
        <div className="flex gap-3">
          <button
            id="edit-listing-btn"
            onClick={openEdit}
            className="px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
            style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6' }}
          >
            Edit Listing
          </button>
          <button
            id="delete-listing-btn"
            onClick={() => setDeleteConfirm(true)}
            className="px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
            style={{ border: '1px solid #ba1a1a', color: '#ba1a1a', backgroundColor: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ba1a1a'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ba1a1a' }}
          >
            Delete
          </button>
        </div>
      </header>

      {/* ── Edit Form Panel ── */}
      {isEditing && (
        <div className="max-w-2xl mx-auto px-6 py-8 mb-8 mt-4" style={{ backgroundColor: '#f5f3f0' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[11px] uppercase tracking-[0.22em] font-medium" style={{ color: '#7A6E63' }}>Edit Listing</h2>
            <button onClick={() => setIsEditing(false)} className="text-[10px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>Cancel</button>
          </div>
          <div className="flex flex-col gap-6">
            {[
              { label: 'Title', key: 'title', placeholder: 'Product title' },
              { label: 'Description', key: 'description', placeholder: 'Product description' },
              { label: 'Price (INR)', key: 'priceAmount', placeholder: 'e.g. 1299', type: 'number' },
            ].map(f => (
              <div key={f.key} className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.16em]" style={{ color: '#7A6E63' }}>{f.label}</label>
                <input
                  type={f.type ?? 'text'}
                  value={editForm[f.key]}
                  onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-transparent outline-none py-2 text-sm"
                  style={{ color: '#1b1c1a', borderBottom: '1px solid #d0c5b5', fontFamily: "'Inter', sans-serif" }}
                  onFocus={e => e.target.style.borderBottomColor = '#C9A96E'}
                  onBlur={e => e.target.style.borderBottomColor = '#d0c5b5'}
                />
              </div>
            ))}
            <button
              id="save-edit-btn"
              onClick={saveEdit}
              disabled={editSaving}
              className="px-10 py-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-all duration-300 mt-2"
              style={{ backgroundColor: editSaving ? '#d0c5b5' : '#1b1c1a', color: '#fbf9f6' }}
              onMouseEnter={e => { if (!editSaving) { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a' } }}
              onMouseLeave={e => { if (!editSaving) { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6' } }}
            >
              {editSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(27,28,26,0.6)' }}>
          <div className="p-10 max-w-sm w-full mx-4" style={{ backgroundColor: '#fbf9f6' }}>
            <p className="text-[10px] uppercase tracking-[0.22em] mb-4 font-medium" style={{ color: '#ba1a1a' }}>Confirm Delete</p>
            <p className="text-2xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
              Delete this listing?
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#7A6E63' }}>
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                id="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-medium"
                style={{ backgroundColor: '#ba1a1a', color: '#fff' }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-medium"
                style={{ border: '1px solid #d0c5b5', color: '#7A6E63' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-8">

        {/* Base Product Info */}
        <section className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="w-full md:w-1/2">
            {/* Gallery placeholder */}
            <div className="w-full aspect-[4/5] bg-[#f5f3f0] overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[ 0 ].url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7f7668]">No Image</div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {product.images.slice(1).map((img, i) => (
                  <img key={i} src={img.url} alt={`Thumb ${i}`} className="w-16 h-20 object-cover bg-[#f5f3f0] shrink-0" />
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4 uppercase">{product.title}</h2>
            <p className="text-[#6e6258] text-lg mb-6 leading-relaxed max-w-md">{product.description}</p>
            <div className="text-2xl tracking-wide font-light mb-8">
              {product.price?.amount} {product.price?.currency}
            </div>
          </div>
        </section>

        {/* Variants & Inventory */}
        <section className="bg-[#f5f3f0] p-6 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h3 className="font-serif text-3xl uppercase">Variants & Inventory</h3>
            {!isAddingVariant && (
              <button
                onClick={() => setIsAddingVariant(true)}
                className="bg-[#745a27] text-[#ffffff] px-6 py-3 uppercase tracking-wider text-sm hover:bg-[#5a4312] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusIcon /> Add New Variant
              </button>
            )}
          </div>

          {/* Add New Variant Form */}
          {isAddingVariant && (
            <div className="bg-[#ffffff] p-6 md:p-8 mb-12 shadow-[0_20px_40px_rgba(27,28,26,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-serif text-xl uppercase">Create Variant</h4>
                <button
                  onClick={() => setIsAddingVariant(false)}
                  className="text-[#7f7668] hover:text-[#1b1c1a] text-sm uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Left Col: Primary Attribute & Images */}
                <div className="space-y-6">
                  {/* Primary Attribute */}
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-3">Primary Attribute (e.g., Color) *</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Key (e.g., Color)"
                        value={variantGroup.primaryAttributeKey}
                        onChange={(e) => setVariantGroup(prev => ({ ...prev, primaryAttributeKey: e.target.value }))}
                        className="w-1/2 bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., Dark Brown)"
                        value={variantGroup.primaryAttributeValue}
                        onChange={(e) => setVariantGroup(prev => ({ ...prev, primaryAttributeValue: e.target.value }))}
                        className="w-1/2 bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <label className="block text-sm uppercase tracking-wider text-[#6e6258]">Variant Images (Max 7, Optional)</label>
                      <span className="text-xs text-[#7f7668]">{variantGroup.images.length}/7</span>
                    </div>

                    {variantGroup.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {variantGroup.images.map((img, index) => (
                          <div key={index} className="relative aspect-[4/5] bg-[#f5f3f0]">
                            <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-white/80 p-1 text-[#ba1a1a] hover:bg-white transition-colors cursor-pointer"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {variantGroup.images.length < 7 && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="block w-full text-sm text-[#6e6258]
                            file:mr-4 file:py-2 file:px-4
                            file:border-0 file:bg-[#f5f3f0] file:text-[#1b1c1a]
                            hover:file:bg-[#e4e2df] file:cursor-pointer file:uppercase file:text-xs file:tracking-wider file:font-serif
                            cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Right Col: Sub-variants */}
                <div>
                  <label className="block text-sm uppercase tracking-wider text-[#6e6258] mb-3">Sub-variants (e.g., Sizes) *</label>
                  <div className="space-y-6">
                    {subVariants.map((sv, index) => (
                      <div key={index} className="p-4 border border-[#e4e2df] bg-[#fdfdfc] relative">
                        {subVariants.length > 1 && (
                          <button 
                            onClick={() => handleRemoveSubVariant(index)} 
                            className="absolute top-2 right-2 text-[#ba1a1a] hover:text-red-700 p-1"
                          >
                            <TrashIcon />
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <input
                            type="text"
                            placeholder="Key (e.g., Size)"
                            value={sv.subAttributeKey}
                            onChange={(e) => handleSubVariantChange(index, 'subAttributeKey', e.target.value)}
                            className="bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5] text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g., M)"
                            value={sv.subAttributeValue}
                            onChange={(e) => handleSubVariantChange(index, 'subAttributeValue', e.target.value)}
                            className="bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5] text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[#7f7668] mb-1">Stock</label>
                            <input
                              type="number"
                              value={sv.stock}
                              onChange={(e) => handleSubVariantChange(index, 'stock', e.target.value)}
                              className="w-full bg-transparent border-b border-[#d0c5b5] py-1 focus:outline-none focus:border-[#745a27] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[#7f7668] mb-1">Price (Optional)</label>
                            <input
                              type="number"
                              value={sv.priceAmount}
                              onChange={(e) => handleSubVariantChange(index, 'priceAmount', e.target.value)}
                              placeholder="Default"
                              className="w-full bg-transparent border-b border-[#d0c5b5] py-1 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddSubVariant}
                    className="mt-4 text-[#745a27] text-sm uppercase tracking-wider flex items-center gap-1 hover:text-[#5a4312] cursor-pointer"
                  >
                    <PlusIcon /> Add Size / Option
                  </button>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleAddNewVariantGroup}
                  className="bg-gradient-to-r from-[#745a27] to-[#c9a96e] text-[#ffffff] px-8 py-3 uppercase tracking-wider text-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Save Variants
                </button>
              </div>
            </div>
          )}

          {/* Variants List */}
          {localVariants.length === 0 ? (
            <div className="py-12 text-center text-[#6e6258]">
              <p>No variants have been created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {localVariants.map((variant, idx) => (
                <div key={idx} className="bg-[#ffffff] flex flex-col pt-4 shadow-[0_20px_40px_rgba(27,28,26,0.02)]">
                  <div className="px-6 flex gap-4 h-24 mb-4">
                    {/* Variant Thumb */}
                    <div className="w-16 h-20 bg-[#f5f3f0] shrink-0">
                      {variant.images && variant.images.length > 0 ? (
                        <img src={variant.images[ 0 ].url} alt="Variant" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#7f7668]">N/A</div>
                      )}
                    </div>
                    {/* Attributes */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Object.entries(variant.attributes || {}).map(([ key, val ]) => (
                          <span key={key} className="bg-[#f5f3f0] px-2 py-1 text-xs uppercase tracking-wider text-[#4d463a]">
                            <span className="text-[#a8a094]">{key}:</span> {val}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm font-light">
                        {variant.price?.amount ? `${variant.price.amount} ${variant.price.currency}` : 'Base Price'}
                      </div>
                    </div>
                  </div>

                  {/* Stock Management Row */}
                  <div className="mt-auto border-t border-[#f5f3f0] bg-[#fbf9f6] flex items-center px-6 py-3 justify-between">
                    <label className="text-sm text-[#6e6258] uppercase tracking-wider">Current Stock</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={variant.stock || 0}
                        onChange={(e) => handleStockChange(idx, e.target.value)}
                        className="w-20 bg-transparent border-b border-[#d0c5b5] py-1 text-right focus:outline-none focus:border-[#745a27] font-serif text-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  )
}

export default SellerProductDetails