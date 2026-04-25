'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import { Package, ChevronRight } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-stone-100 text-stone-600',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.list()
      .then(r => { setOrders(r.data.results || r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="pt-16 max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse border border-stone-200 p-5 mb-4">
          <div className="h-4 bg-stone-200 rounded w-1/4 mb-3" />
          <div className="h-3 bg-stone-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );

  if (!orders.length) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center py-24 px-4">
        <Package size={52} className="text-stone-300 mx-auto mb-5" />
        <h2 className="font-display text-3xl font-bold text-stone-900 mb-3">No orders yet</h2>
        <p className="text-stone-500 mb-8">Your orders will appear here once you've made a purchase.</p>
        <Link href="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="pt-16 max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-8">My Orders</h1>
      <div className="space-y-3">
        {orders.map(order => (
          <Link key={order.id} href={`/orders/${order.id}`}
            className="block card bg-white p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-stone-900">#{order.order_number}</p>
                  <span className={`badge text-xs ${STATUS_COLORS[order.status] || 'bg-stone-100 text-stone-600'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-stone-500">
                  {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-stone-900">${Number(order.total).toFixed(2)}</span>
                <ChevronRight size={16} className="text-stone-400" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {order.items.slice(0, 3).map(item => (
                <span key={item.id} className="text-xs bg-stone-100 text-stone-600 px-2 py-1">
                  {item.product_name} ({item.size}/{item.color})
                </span>
              ))}
              {order.items.length > 3 && (
                <span className="text-xs text-stone-400">+{order.items.length - 3} more</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
