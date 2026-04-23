'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function CartPage() {
  const { cart, fetchCart, updateItem, removeItem, loading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => { fetchCart(); }, []);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center py-24 px-4">
          <ShoppingBag size={56} className="text-stone-300 mx-auto mb-5" />
          <h2 className="font-display text-3xl font-bold text-stone-900 mb-3">Your cart is empty</h2>
          <p className="text-stone-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = Number(cart.total);
  const shipping = subtotal >= 75 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-8">Shopping Cart <span className="text-stone-400 text-2xl font-normal">({cart.item_count})</span></h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 card bg-white">
              <div className="w-24 h-24 bg-stone-100 relative shrink-0 overflow-hidden">
                {item.product_image ? (
                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${item.product_slug}`} className="font-medium text-stone-900 hover:text-brand-600 transition-colors line-clamp-2">
                  {item.product_name}
                </Link>
                <p className="text-xs text-stone-500 mt-1">{item.variant.color} / {item.variant.size}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-stone-200">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)} className="px-2.5 py-1.5 text-stone-500 hover:bg-stone-50">
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)} className="px-2.5 py-1.5 text-stone-500 hover:bg-stone-50">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-stone-900">${Number(item.subtotal).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card bg-white p-6 sticky top-24">
            <h2 className="font-semibold text-stone-900 mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm text-stone-700 mb-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-stone-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {subtotal < 75 && (
              <p className="text-xs text-stone-500 bg-stone-50 p-3 mb-4">
                Add <strong>${(75 - subtotal).toFixed(2)}</strong> more for free shipping!
              </p>
            )}
            {isAuthenticated ? (
              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login?redirect=/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                  Login to Checkout <ArrowRight size={16} />
                </Link>
                <p className="text-center text-xs text-stone-500">or <Link href="/auth/register" className="underline">create an account</Link></p>
              </div>
            )}
            <Link href="/shop" className="btn-ghost w-full text-center block mt-3 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
