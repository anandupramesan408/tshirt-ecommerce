'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';
import { Address } from '@/types';
import toast from 'react-hot-toast';
import { Plus, Trash2, MapPin, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, fetchProfile } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { register, handleSubmit, reset } = useForm({ defaultValues: user || {} });
  const addrForm = useForm<any>();

  useEffect(() => {
    fetchProfile();
    authApi.getAddresses().then(r => setAddresses(r.data));
  }, []);

  useEffect(() => { if (user) reset(user); }, [user]);

  const onProfileSave = async (data: any) => {
    try {
      await authApi.updateProfile(data);
      await fetchProfile();
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
  };

  const onAddAddress = async (data: any) => {
    try {
      const res = await authApi.createAddress(data);
      setAddresses(a => [...a, res.data]);
      addrForm.reset();
      setShowAddressForm(false);
      toast.success('Address saved!');
    } catch { toast.error('Failed to save address'); }
  };

  const deleteAddress = async (id: number) => {
    try {
      await authApi.deleteAddress(id);
      setAddresses(a => a.filter(x => x.id !== id));
      toast.success('Address removed');
    } catch { toast.error('Failed to remove'); }
  };

  return (
    <div className="pt-16 max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="section-title mb-8">My Profile</h1>

      {/* Profile Info */}
      <div className="card bg-white p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <h2 className="font-semibold text-stone-900">Personal Information</h2>
        </div>
        <form onSubmit={handleSubmit(onProfileSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input {...register('first_name')} className="input" />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input {...register('last_name')} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input bg-stone-50 text-stone-400 cursor-not-allowed" disabled />
          </div>
          <div>
            <label className="label">Phone</label>
            <input {...register('phone')} type="tel" className="input" placeholder="+1 234 567 8900" />
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      </div>

      {/* Addresses */}
      <div className="card bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center">
              <MapPin size={18} className="text-white" />
            </div>
            <h2 className="font-semibold text-stone-900">Saved Addresses</h2>
          </div>
          <button onClick={() => setShowAddressForm(v => !v)} className="btn-outline text-sm py-2 px-4 flex items-center gap-1">
            <Plus size={14} /> Add New
          </button>
        </div>

        {showAddressForm && (
          <form onSubmit={addrForm.handleSubmit(onAddAddress)} className="bg-stone-50 border border-stone-200 p-4 mb-5 space-y-3">
            <div>
              <label className="label">Full Name</label>
              <input {...addrForm.register('full_name', { required: true })} className="input" />
            </div>
            <div>
              <label className="label">Address Line 1</label>
              <input {...addrForm.register('address_line1', { required: true })} className="input" />
            </div>
            <div>
              <label className="label">Address Line 2</label>
              <input {...addrForm.register('address_line2')} className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">City</label>
                <input {...addrForm.register('city', { required: true })} className="input" />
              </div>
              <div>
                <label className="label">State</label>
                <input {...addrForm.register('state', { required: true })} className="input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Postal Code</label>
                <input {...addrForm.register('postal_code', { required: true })} className="input" />
              </div>
              <div>
                <label className="label">Country</label>
                <input {...addrForm.register('country')} className="input" defaultValue="US" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" {...addrForm.register('is_default')} className="accent-brand-500" />
              Set as default address
            </label>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm py-2">Save Address</button>
              <button type="button" onClick={() => setShowAddressForm(false)} className="btn-outline text-sm py-2">Cancel</button>
            </div>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-6">No saved addresses yet.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className="border border-stone-200 p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-stone-900 text-sm">{addr.full_name}</p>
                    {addr.is_default && <span className="badge bg-brand-100 text-brand-700 text-xs">Default</span>}
                  </div>
                  <address className="text-xs text-stone-500 not-italic leading-relaxed">
                    {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}<br />
                    {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                  </address>
                </div>
                <button onClick={() => deleteAddress(addr.id)} className="text-stone-400 hover:text-red-500 transition-colors ml-3 shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
