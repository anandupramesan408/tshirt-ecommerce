'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import { ChevronLeft, Truck } from 'lucide-react';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.detail(Number(params.id))
      .then(r => { setOrder(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="pt-32 text-center text-stone-400">Loading...</div>;
  if (!order) return <div className="pt-32 text-center text-stone-500">Order not found.</div>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="pt-16 max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 mb-8">
        <ChevronLeft size={16} /> Back to orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900">Order #{order.order_number}</h1>
          <p className="text-stone-500 text-sm mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <span className={`badge ${STATUS_COLORS[order.status] || 'bg-stone-100 text-stone-600'}`}>{order.status}</span>
      </div>

      {/* Progress */}
      {!['cancelled', 'refunded'].includes(order.status) && (
        <div className="card bg-white p-5 mb-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-stone-200 -z-0" />
            <div className="absolute left-0 top-4 h-0.5 bg-brand-500 -z-0 transition-all"
              style={{ width: `${stepIndex >= 0 ? (stepIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%` }} />
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= stepIndex ? 'bg-brand-500 border-brand-500 text-white' : 'bg-white border-stone-300 text-stone-400'}`}>
                  {i + 1}
                </div>
                <span className="text-xs capitalize text-stone-500 hidden sm:block">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking */}
      {order.tracking_number && (
        <div className="card bg-white p-4 mb-5 flex items-center gap-3">
          <Truck size={18} className="text-brand-500" />
          <div>
            <p className="text-sm font-medium text-stone-800">Tracking Number</p>
            <p className="text-sm text-stone-500 font-mono">{order.tracking_number}</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        {/* Shipping */}
        <div className="card bg-white p-5">
          <h3 className="font-semibold text-stone-900 mb-3">Shipping Address</h3>
          <address className="text-sm text-stone-600 not-italic leading-relaxed">
            {order.shipping_name}<br />
            {order.shipping_address1}<br />
            {order.shipping_address2 && <>{order.shipping_address2}<br /></>}
            {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}<br />
            {order.shipping_country}
          </address>
        </div>
        {/* Summary */}
        <div className="card bg-white p-5">
          <h3 className="font-semibold text-stone-900 mb-3">Payment Summary</h3>
          <div className="space-y-2 text-sm text-stone-700">
            <div className="flex justify-between"><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{Number(order.shipping_cost) === 0 ? <span className="text-green-600">Free</span> : `$${Number(order.shipping_cost).toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${Number(order.tax).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-2">
              <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card bg-white p-5">
        <h3 className="font-semibold text-stone-900 mb-4">Items ({order.items.length})</h3>
        <div className="divide-y divide-stone-100">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-stone-800">{item.product_name}</p>
                <p className="text-xs text-stone-500">{item.color} / {item.size} · SKU: {item.variant_sku}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-stone-900">${Number(item.subtotal).toFixed(2)}</p>
                <p className="text-xs text-stone-500">${Number(item.unit_price).toFixed(2)} × {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
