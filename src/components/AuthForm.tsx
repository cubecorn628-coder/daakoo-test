import React, { useState } from 'react';
import { login, register } from '../lib/api';
import { cn } from '../lib/utils';

export default function AuthForm({ onAuthSuccess }: { onAuthSuccess: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await login({ email: formData.email, password: formData.password });
      } else {
        user = await register(formData);
      }
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex mb-6 bg-m3-surface-variant/50 rounded-full p-1">
        <button
          className={cn("flex-1 py-2 rounded-full font-medium transition-colors", isLogin ? "bg-m3-surface shadow-sm" : "hover:bg-m3-surface/50")}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={cn("flex-1 py-2 rounded-full font-medium transition-colors", !isLogin ? "bg-m3-surface shadow-sm" : "hover:bg-m3-surface/50")}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl bg-m3-surface border border-m3-outline/20 focus:border-m3-primary focus:ring-1 focus:ring-m3-primary transition-colors"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 rounded-xl bg-m3-surface border border-m3-outline/20 focus:border-m3-primary focus:ring-1 focus:ring-m3-primary transition-colors"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 rounded-xl bg-m3-surface border border-m3-outline/20 focus:border-m3-primary focus:ring-1 focus:ring-m3-primary transition-colors"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-m3-primary text-m3-on-primary font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
    </div>
  );
}
