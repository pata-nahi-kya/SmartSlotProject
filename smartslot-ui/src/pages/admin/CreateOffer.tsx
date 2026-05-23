import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';

export default function CreateOffer() {
  const [businesses, setBusinesses] = useState([]);
  const [form, setForm] = useState({
    businessId: '', title: '', description: '', category: '',
    originalPrice: 0, offerPrice: 0, startDate: '', endDate: '', termsAndConditions: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiClient.get('/business').then(res => setBusinesses(res.data)).catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/offer', form);
      setMessage('Offer compiled and pushed successfully!');
      setForm({ businessId: '', title: '', description: '', category: '', originalPrice: 0, offerPrice: 0, startDate: '', endDate: '', termsAndConditions: '' });
    } catch (err) {
      setMessage('Execution error pushing offer pipeline.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Create Strategic Offer Slot</h2>
        {message && <div className="p-4 rounded-xl mb-6 font-medium text-sm bg-blue-50 text-blue-700 border border-blue-100">{message}</div>}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Target Business Profile</label>
              <select value={form.businessId} onChange={e => setForm({...form, businessId: e.target.value})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500">
                <option value="">Select Business Account</option>
                {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Offer Title Name</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Category Tag</label>
              <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Original Base Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: Number(e.target.value)})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Campaign Promotional Price (₹)</label>
              <input type="number" value={form.offerPrice} onChange={e => setForm({...form, offerPrice: Number(e.target.value)})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Campaign Activation Start Date</label>
              <input type="datetime-local" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700">Campaign Expiration End Date</label>
              <input type="datetime-local" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Marketing Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700">Terms And Conditions Contract Statement</label>
            <textarea value={form.termsAndConditions} onChange={e => setForm({...form, termsAndConditions: e.target.value})} required rows={2} className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/10">
            Commit Scheme Records
          </button>
        </form>
      </main>
    </div>
  );
}
