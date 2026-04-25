import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block card animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        {product.primary_image ? (
          <Image src={product.primary_image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-300">
            <ShoppingBag size={48} />
          </div>
        )}
        {product.discount_percentage > 0 && (
          <span className="absolute top-3 left-3 badge bg-brand-500 text-white">
            -{product.discount_percentage}%
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-3 right-3 badge bg-stone-900 text-white">Featured</span>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-stone-900 text-white text-center py-3 text-sm font-medium tracking-wide">
          Quick View
        </div>
      </div>
      <div className="p-4">
        {product.category_name && (
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-1">{product.category_name}</p>
        )}
        <h3 className="font-medium text-stone-900 group-hover:text-brand-600 transition-colors leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900">${Number(product.price).toFixed(2)}</span>
            {product.compare_price && (
              <span className="text-sm text-stone-400 line-through">${Number(product.compare_price).toFixed(2)}</span>
            )}
          </div>
          {product.avg_rating && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={12} fill="currentColor" />
              <span className="text-xs text-stone-500">{product.avg_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-2.5">
            {product.colors.slice(0, 5).map(c => (
              <span key={c.color} title={c.color}
                className="w-3.5 h-3.5 rounded-full border border-stone-200"
                style={{ backgroundColor: c.color_hex }} />
            ))}
            {product.colors.length > 5 && <span className="text-xs text-stone-400">+{product.colors.length - 5}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
