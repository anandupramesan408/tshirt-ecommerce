import Link from 'next/link';
import { ArrowRight, Shield, Truck, RefreshCw, Star } from 'lucide-react';
import { productsApi } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { Product, Category } from '@/types';

async function getData() {
  try {
    const [featuredRes, categoriesRes] = await Promise.all([
      productsApi.featured(),
      productsApi.categories(),
    ]);
    return {
      featured: featuredRes.data as Product[],
      categories: categoriesRes.data as Category[],
    };
  } catch {
    return { featured: [], categories: [] };
  }
}

export default async function HomePage() {
  const { featured, categories } = await getData();

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 md:py-44">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.3em] uppercase text-brand-400 mb-4 font-medium">New Collection 2025</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Wear What<br />Moves You
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed mb-8">
              Premium quality t-shirts designed for real life. Soft fabrics, timeless fits, and colors that last.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary flex items-center gap-2">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/shop?is_featured=true" className="btn-outline border-white text-white hover:bg-white hover:text-stone-900">
                View Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-stone-100 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
            {[
              { icon: Truck, title: 'Free Shipping', text: 'On orders over $75' },
              { icon: RefreshCw, title: '30-Day Returns', text: 'Hassle-free exchanges' },
              { icon: Shield, title: 'Premium Quality', text: '100% organic cotton' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-4 px-6 py-5">
                <Icon size={22} className="text-brand-500 shrink-0" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{title}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Browse by</p>
              <h2 className="section-title">Categories</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                className="group relative aspect-square bg-stone-200 overflow-hidden card">
                <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/60 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <p className="font-display font-bold text-xl text-center">{cat.name}</p>
                  <p className="text-xs mt-1 text-white/70">{cat.product_count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">Handpicked</p>
              <h2 className="section-title">Featured Pieces</h2>
            </div>
            <Link href="/shop?is_featured=true" className="text-sm font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="bg-brand-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Get 10% Off Your First Order</h2>
            <p className="text-brand-100">Join our newsletter and get exclusive deals straight to your inbox.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto min-w-72">
            <input type="email" placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/30 text-white placeholder:text-white/60 px-4 py-3 text-sm focus:outline-none focus:bg-white/20" />
            <button className="bg-white text-brand-600 px-5 py-3 font-semibold text-sm hover:bg-brand-50 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
