import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';
import { OfferResponseDto } from '../../types/apiTypes';
import { Trash2 } from 'lucide-react';

export default function ManageOffers() {
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);

  const fetchOffers = () => {
    apiClient.get('/offer').then(res => setOffers(res.data)).catch(err => console.error(err));
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Confirm destructive deletion of offer schema reference?')) {
      await apiClient.delete(`/offer/${id}`);
      fetchOffers();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Manage Campaign Offers</h2>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th className="p-4">Offer Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Orig. Price</th>
                <th className="p-4">Promo Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {offers.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/40">
                  <td className="p-4 font-semibold text-slate-800">{o.title}</td>
                  <td className="p-4"><span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium">{o.category}</span></td>
                  <td className="p-4 text-slate-400 line-through">₹{o.originalPrice}</td>
                  <td className="p-4 font-bold text-green-600">₹{o.offerPrice}</td>
                  <td className="p-4"><span className="text-xs font-bold text-blue-600">{o.status}</span></td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(o.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
