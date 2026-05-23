import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h2 className="text-3xl font-black text-center text-slate-900 tracking-tight mb-2">SmartSlot</h2>
        <p className="text-center text-slate-500 text-sm mb-8">Administrative Console Access</p>
        {error && <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
              className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required 
              className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-600/20">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
