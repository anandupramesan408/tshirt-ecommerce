'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ShoppingBag, Minus, Plus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { Product, ProductVariant } from '@/types';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItem, loading: cartLoading } = useCartStore();

  useEffect(() => {
    productsApi.detail(params.slug)
      .then(r => { setProduct(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return (
    <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-square bg-stone-200" />
        <div className="space-y-4">
          <div className="h-6 bg-stone-200 rounded w-1/3" />
          <div className="h-8 bg-stone-200 rounded w-2/3" />
          <div className="h-6 bg-stone-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="pt-32 text-center text-stone-500">Product not found.</div>;

  const uniqueColors = [...new Map((product.variants || []).map(v => [v.color, v])).values()];
  const availableSizes = (product.variants || [])
    .filter(v => !selectedColor || v.color === selectedColor)
    .map(v => v.size);

  const selectedVariant = (product.variants || []).find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(selectedVariant.id, quantity);
  };

  const avgRating = product.avg_rating || 0;

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 mb-8">
          <ChevronLeft size={16} /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div>
            <div className="aspect-square bg-stone-100 relative overflow-hidden mb-3">
              {product.images && product.images[activeImage] ? (
                <Image src={product.images[activeImage].image} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                  <ShoppingBag size={64} />
                </div>
              )}
              {product.discount_percentage > 0 && (
                <span className="absolute top-4 left-4 badge bg-brand-500 text-white">-{product.discount_percentage}%</span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={img.id} onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 relative border-2 transition-colors ${activeImage === i ? 'border-stone-900' : 'border-transparent'}`}>
                    <Image src={img.image} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Link href={`/shop?category=${product.category.slug}`} className="text-xs tracking-widest uppercase text-brand-500 font-semibold hover:text-brand-600">
                {product.category.name}
              </Link>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-stone-300'} />
                ))}
              </div>
              <span className="text-sm text-stone-500">({product.review_count || 0} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold text-stone-900">${Number(product.price).toFixed(2)}</span>
              {product.compare_price && (
                <span className="text-lg text-stone-400 line-through">${Number(product.compare_price).toFixed(2)}</span>
              )}
            </div>

            <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>

            {/* Color Selector */}
            {uniqueColors.length > 0 && (
              <div className="mb-6">
                <label className="label">Color {selectedColor && <span className="normal-case font-normal text-stone-500">— {selectedColor}</span>}</label>
                <div className="flex gap-2.5 flex-wrap">
                  {uniqueColors.map(v => (
                    <button key={v.color} onClick={() => { setSelectedColor(v.color); setSelectedSize(''); }}
                      title={v.color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === v.color ? 'border-stone-900 scale-110' : 'border-transparent hover:border-stone-400'}`}
                      style={{ backgroundColor: v.color_hex }} />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {selectedColor && (
              <div className="mb-6">
                <label className="label">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(s => {
                    const available = availableSizes.includes(s);
                    const variant = (product.variants || []).find(v => v.color === selectedColor && v.size === s);
                    return (
                      <button key={s} onClick={() => available && setSelectedSize(s)}
                        disabled={!available}
                        className={`px-3 py-2 text-sm font-medium border transition-colors ${selectedSize === s ? 'bg-stone-900 text-white border-stone-900' : available ? 'border-stone-300 text-stone-700 hover:border-stone-900' : 'border-stone-200 text-stone-300 cursor-not-allowed line-through'}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
                {selectedVariant && (
                  <p className="text-xs text-stone-500 mt-1.5">{selectedVariant.stock} in stock</p>
                )}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 items-center mb-4">
              <div className="flex items-center border border-stone-300">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-3 text-stone-600 hover:bg-stone-50">
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-3 text-stone-600 hover:bg-stone-50">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={handleAddToCart} disabled={!selectedVariant || cartLoading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                <ShoppingBag size={16} />
                {!selectedColor ? 'Select a color' : !selectedSize ? 'Select a size' : 'Add to Cart'}
              </button>
            </div>

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-12 border-t border-stone-200 pt-8">
                <h3 className="font-semibold text-stone-900 mb-5">Customer Reviews ({product.review_count})</h3>
                <div className="space-y-5">
                  {product.reviews.slice(0, 4).map(r => (
                    <div key={r.id} className="border-b border-stone-100 pb-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'} />
                          ))}
                        </div>
                        <span className="text-xs text-stone-500">{r.user_name || r.user_email}</span>
                      </div>
                      <p className="font-medium text-sm text-stone-800">{r.title}</p>
                      <p className="text-sm text-stone-600 mt-1">{r.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
