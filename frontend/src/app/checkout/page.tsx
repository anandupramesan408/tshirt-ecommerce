'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cartStore';
import { ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Lock, CheckCircle } from 'lucide-react';

const schema = z.object({
  shipping_name: z.string().min(2, 'Required'),
  shipping_address1: z.string().min(3, 'Required'),
  shipping_address2: z.string().optional(),
  shipping_city: z.string().min(2, 'Required'),
  shipping_state: z.string().min(2, 'Required'),
  shipping_postal_code: z.string().min(3, 'Required'),
  shipping_country: z.string().min(2, 'Required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { cart } = useCartStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { shipping_country: 'US' }
  });

  const subtotal = Number(cart?.total || 0);
  const shipping = subtotal >= 75 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await ordersApi.checkout(data);
      // In production: use Stripe.js to complete payment with res.data.client_secret
      // For demo, we mark as success directly
      await ordersApi.confirmPayment(res.data.order.stripe_payment_intent || 'demo');
      setOrderSuccess(res.data.order);
      toast.success('Order placed successfully!');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Checkout failed. Please try again.');
    }
    setSubmitting(false);
  };

  if (orderSuccess) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md py-16">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-5" />
          <h2 className="font-display text-3xl font-bold text-stone-900 mb-3">Order Confirmed!</h2>
          <p className="text-stone-500 mb-2">Order <strong>#{orderSuccess.order_number}</strong> has been placed.</p>
          <p className="text-stone-500 mb-8">We'll send you a confirmation email shortly.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/orders')} className="btn-primary">View Orders</button>
            <button onClick={() => router.push('/shop')} className="btn-outline">Keep Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-5 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-5">
          <div className="card bg-white p-6">
            <h2 className="font-semibold text-stone-900 mb-5">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input {...register('shipping_name')} className="input" placeholder="John Doe" />
                {errors.shipping_name && <p className="text-xs text-red-500 mt-1">{errors.shipping_name.message}</p>}
              </div>
              <div>
                <label className="label">Address Line 1</label>
                <input {...register('shipping_address1')} className="input" placeholder="123 Main Street" />
                {errors.shipping_address1 && <p className="text-xs text-red-500 mt-1">{errors.shipping_address1.message}</p>}
              </div>
              <div>
                <label className="label">Address Line 2 <span className="font-normal normal-case text-stone-400">(optional)</span></label>
                <input {...register('shipping_address2')} className="input" placeholder="Apt, suite, etc." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <input {...register('shipping_city')} className="input" placeholder="New York" />
                  {errors.shipping_city && <p className="text-xs text-red-500 mt-1">{errors.shipping_city.message}</p>}
                </div>
                <div>
                  <label className="label">State</label>
                  <input {...register('shipping_state')} className="input" placeholder="NY" />
                  {errors.shipping_state && <p className="text-xs text-red-500 mt-1">{errors.shipping_state.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">ZIP / Postal Code</label>
                  <input {...register('shipping_postal_code')} className="input" placeholder="10001" />
                  {errors.shipping_postal_code && <p className="text-xs text-red-500 mt-1">{errors.shipping_postal_code.message}</p>}
                </div>
                <div>
                  <label className="label">Country</label>
                  <input {...register('shipping_country')} className="input" placeholder="US" />
                  {errors.shipping_country && <p className="text-xs text-red-500 mt-1">{errors.shipping_country.message}</p>}
                </div>
              </div>
              <div>
                <label className="label">Order Notes <span className="font-normal normal-case text-stone-400">(optional)</span></label>
                <textarea {...register('notes')} className="input" rows={2} placeholder="Special instructions..." />
              </div>
            </div>
          </div>

          <div className="card bg-white p-6">
            <h2 className="font-semibold text-stone-900 mb-3">Payment</h2>
            <div className="bg-stone-50 border border-stone-200 p-4 text-sm text-stone-600 flex items-center gap-2">
              <Lock size={14} className="text-stone-400" />
              Stripe payment integration — enter card details via the Stripe.js widget in production.
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
            <Lock size={16} />
            {submitting ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="card bg-white p-6 sticky top-24">
            <h2 className="font-semibold text-stone-900 mb-4">Order Summary</h2>
            <div className="divide-y divide-stone-100">
              {cart?.items.map(item => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <div>
                    <p className="text-stone-800 font-medium line-clamp-1">{item.product_name}</p>
                    <p className="text-stone-400 text-xs">{item.variant.color} / {item.variant.size} × {item.quantity}</p>
                  </div>
                  <span className="font-medium">${Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-200 pt-4 mt-2 space-y-2 text-sm text-stone-700">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-3">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
