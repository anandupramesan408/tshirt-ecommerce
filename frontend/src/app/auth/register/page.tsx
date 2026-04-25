'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  username: z.string().min(3, 'Min 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  password2: z.string(),
}).refine(d => d.password === d.password2, { message: "Passwords don't match", path: ['password2'] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, login, loading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      await login(data.email, data.password);
      toast.success('Account created!');
      router.push('/');
    } catch (e: any) {
      const msg = e.response?.data;
      toast.error(typeof msg === 'object' ? Object.values(msg).flat().join(' ') : 'Registration failed');
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">Create account</h1>
          <p className="text-stone-500">Join ThreadCo for exclusive deals</p>
        </div>
        <div className="card bg-white p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input {...register('first_name')} className="input" placeholder="John" />
                {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="label">Last Name</label>
                <input {...register('last_name')} className="input" placeholder="Doe" />
                {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
              </div>
            </div>
            <div>
              <label className="label">Username</label>
              <input {...register('username')} className="input" placeholder="johndoe" />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input {...register('password')} type="password" className="input" placeholder="Min 8 characters" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input {...register('password2')} type="password" className="input" placeholder="Repeat password" />
              {errors.password2 && <p className="text-xs text-red-500 mt-1">{errors.password2.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
