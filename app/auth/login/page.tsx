'use client';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError('Invalid username or password');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-xl font-semibold text-white mb-6">Sign in to continue</h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-4 py-3 rounded-xl mb-4"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-white/70 text-sm mb-2" htmlFor="username">Username</label>
          <input
            id="username"
            {...register('username')}
            placeholder="Enter your username"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all"
          />
          {errors.username && <p className="text-red-300 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-white/70 text-sm mb-2" htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          id="login-submit"
          className="w-full bg-[#FF7A00] hover:bg-[#E06500] text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : 'Sign In'}
        </button>
      </form>

      <p className="text-white/40 text-xs text-center mt-6">
        Progressive Smart Kids School — Admin Portal
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1F44] via-[#1a3a6b] to-[#0A1F44] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#E06500] shadow-2xl shadow-orange-500/40 mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-white">Progressive Smart Kids</h1>
          <p className="text-orange-300 text-sm mt-1">Admin Portal</p>
        </div>

        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
