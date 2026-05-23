import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { OfferResponseDto } from '../../types/apiTypes';
import { Search, MapPin } from 'lucide-react';

export default function OfferListing() {
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (city) params.append('city', city);

    apiClient.get(`/offer/search?${params.toString()}`)
      .then(res => setOffers(res.data.data || res.data))
      .catch(err => console.error(err));
  }, [search, city]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="bg-white border-b border-slate-200 py-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-950 tracking-tight cursor-pointer" onClick={() => navigate('/offers')}>SmartSlot Marketplace</h1>
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search parameters..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div className="relative flex-1 md:w-48">
              <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Filter City..." value={city} onChange={e => setCity(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map(o => (
            <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group">
              <div className="p-6 flex-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{o.category}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition-colors">{o.title}</h3>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2">{o.description}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">₹{o.offerPrice}</span>
                  <span className="text-sm text-slate-400 line-through">₹{o.originalPrice}</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded ml-auto">Save {Math.round(o.discountPercentage)}%</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button onClick={() => navigate(`/offers/${o.id}`)} className="w-full bg-slate-900 text-white hover:bg-blue-600 font-bold py-3 rounded-xl transition shadow-md">
                  Check Slot Availability
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
