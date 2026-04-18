'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/actions/admin';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await adminLogin(email, password);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0f0f0f] border-[#2e2e2e] rounded-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold mb-2 text-[#fafafa] leading-tight">Admin Login</h1>
            <p className="text-[#898989] text-base">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-[#b4b4b4] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#171717] border-[#363636] rounded-lg px-4 py-3 text-[#fafafa] placeholder-[#898989] focus:outline-none focus:border-[#3ecf8e] transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#b4b4b4] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#171717] border-[#363636] rounded-lg px-4 py-3 text-[#fafafa] placeholder-[#898989] focus:outline-none focus:border-[#3ecf8e] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-[#2e2e2e] border-[#393939] rounded-lg px-4 py-3 text-[#fafafa] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3ecf8e] text-[#0f0f0f] border-[#3ecf8e] rounded-full px-8 py-3 font-medium hover:bg-[#00c573] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
