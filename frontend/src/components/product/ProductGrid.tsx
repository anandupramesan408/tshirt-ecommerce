import { Product } from '@/types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-stone-200 mb-3" />
            <div className="h-3 bg-stone-200 rounded mb-2 w-1/3" />
            <div className="h-4 bg-stone-200 rounded mb-2" />
            <div className="h-4 bg-stone-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-24 text-stone-400">
        <p className="text-lg font-medium mb-2">No products found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
