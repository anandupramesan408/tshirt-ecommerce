'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, loading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Invalid credentials');
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">Welcome back</h1>
          <p className="text-stone-500">Sign in to your ThreadCo account</p>
        </div>
        <div className="card bg-white p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input {...register('password')} type="password" className="input" placeholder="••••••••" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-5">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-brand-600 font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
