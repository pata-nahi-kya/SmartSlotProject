import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import apiClient from '../../api/apiClient';
import { type OfferResponseDto } from '../../types/apiTypes';
import { Search, MapPin, Tag, Clock, TrendingUp } from 'lucide-react';

export default function OfferListing() {
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (city) params.append('city', city);

    setIsLoading(true);
    apiClient.get(`/offer/search?${params.toString()}`)
      .then(res => {
        setOffers(res.data.data || res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [search, city]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="relative md:w-64">
            <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by city..."
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Discover Amazing Offers</h2>
            <p className="text-gray-500 mt-1">Find the best deals and exclusive discounts near you</p>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">{offers.length} active offers found</span>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
            <p className="mt-4 text-gray-500">Loading amazing deals for you...</p>
          </div>
        )}

        {!isLoading && offers.length === 0 && (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No offers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {!isLoading && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Save {Math.round(offer.discountPercentage)}%
                  </div>
                </div>

                <div className="p-6 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                      {offer.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>Limited time</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {offer.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                    {offer.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-black text-gray-900">₹{offer.offerPrice}</span>
                      <span className="text-sm text-gray-400 line-through">₹{offer.originalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => navigate(`/offers/${offer.id}`)}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-blue-600 hover:to-indigo-600 font-bold py-3 rounded-xl transition shadow-md"
                  >
                    Check Slot Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
