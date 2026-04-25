'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { productsApi } from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';
import { Product, Category, PaginatedResponse } from '@/types';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    is_featured: searchParams.get('is_featured') || '',
    ordering: searchParams.get('ordering') || '-created_at',
    page: 1,
  });

  useEffect(() => {
    productsApi.categories().then(r => setCategories(r.data));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await productsApi.list(params) as { data: PaginatedResponse<Product> };
      setProducts(data.results);
      setTotal(data.count);
    } catch {}
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key: string, value: string) =>
    setFilters(f => ({ ...f, [key]: value, page: 1 }));

  const clearFilters = () =>
    setFilters({ search: '', category: '', size: '', min_price: '', max_price: '', is_featured: '', ordering: '-created_at', page: 1 });

  const activeFilterCount = [filters.category, filters.size, filters.min_price, filters.max_price, filters.is_featured].filter(Boolean).length;

  return (
    <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="py-10 border-b border-stone-200 mb-8">
        <h1 className="section-title">All T-Shirts</h1>
        <p className="text-stone-500 text-sm">{total} products</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="label">Category</h3>
              <div className="space-y-1.5">
                <button onClick={() => setFilter('category', '')}
                  className={`block text-sm w-full text-left py-1 ${!filters.category ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900'}`}>
                  All
                </button>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setFilter('category', c.slug)}
                    className={`block text-sm w-full text-left py-1 ${filters.category === c.slug ? 'text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-900'}`}>
                    {c.name} <span className="text-stone-400 text-xs">({c.product_count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="label">Size</h3>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setFilter('size', filters.size === s ? '' : s)}
                    className={`px-2.5 py-1 text-xs font-medium border transition-colors ${filters.size === s ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 text-stone-700 hover:border-stone-900'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="label">Price Range</h3>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min" value={filters.min_price}
                  onChange={e => setFilter('min_price', e.target.value)}
                  className="input text-xs py-2" />
                <span className="text-stone-400">–</span>
                <input type="number" placeholder="Max" value={filters.max_price}
                  onChange={e => setFilter('max_price', e.target.value)}
                  className="input text-xs py-2" />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filters.is_featured === 'true'}
                  onChange={e => setFilter('is_featured', e.target.checked ? 'true' : '')}
                  className="accent-brand-500" />
                <span className="text-sm text-stone-700">Featured only</span>
              </label>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                <X size={14} /> Clear filters ({activeFilterCount})
              </button>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex-1 max-w-xs">
              <input type="text" placeholder="Search t-shirts..." value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
                className="input text-sm py-2.5" />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-stone-700 border border-stone-300 px-3 py-2.5">
                <SlidersHorizontal size={15} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <select value={filters.ordering} onChange={e => setFilter('ordering', e.target.value)}
                className="input text-sm py-2.5 w-auto">
                <option value="-created_at">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-avg_rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-stone-50 border border-stone-200 p-5 mb-6 space-y-5">
              <div className="flex flex-wrap gap-1.5">
                <span className="label w-full">Size</span>
                {SIZES.map(s => (
                  <button key={s} onClick={() => setFilter('size', filters.size === s ? '' : s)}
                    className={`px-2.5 py-1 text-xs font-medium border transition-colors ${filters.size === s ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 text-stone-700'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min price" value={filters.min_price}
                  onChange={e => setFilter('min_price', e.target.value)} className="input text-xs py-2" />
                <span>–</span>
                <input type="number" placeholder="Max price" value={filters.max_price}
                  onChange={e => setFilter('max_price', e.target.value)} className="input text-xs py-2" />
              </div>
            </div>
          )}

          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}
