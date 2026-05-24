import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';
import { type OfferResponseDto } from '../../types/apiTypes';
import { Trash2, Plus, Eye, TrendingUp, Tag, AlertCircle, CheckCircle, Clock, Calendar } from 'lucide-react';

export default function ManageOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchOffers = () => {
    setIsLoading(true);
    apiClient.get('/offer')
      .then(res => {
        setOffers(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('This will permanently delete the offer and its slots. Continue?')) return;
    try {
      await apiClient.delete(`/offer/${id}`);
      fetchOffers();
    } catch (error) {
      console.error('Failed to delete offer:', error);
      alert('Unable to delete offer. It may have active dependencies.');
    }
  };

  // Filter offers based on search and category
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || offer.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(offers.map(offer => offer.category))];

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, { className: string; icon: typeof CheckCircle; text: string }> = {
      active: { className: 'bg-green-50 text-green-700', icon: CheckCircle, text: 'Active' },
      draft: { className: 'bg-gray-50 text-gray-700', icon: Clock, text: 'Draft' },
      expired: { className: 'bg-red-50 text-red-700', icon: AlertCircle, text: 'Expired' },
      paused: { className: 'bg-orange-50 text-orange-700', icon: Clock, text: 'Paused' },
      cancelled: { className: 'bg-red-50 text-red-700', icon: AlertCircle, text: 'Cancelled' },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.className}`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-6 w-6 text-blue-600" />
                <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Manage Campaign Offers
                </h2>
              </div>
              <p className="text-gray-500 mt-1">Create, edit, and manage your promotional offers</p>
            </div>
            
            <button 
              onClick={() => navigate('/admin/offers/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Create New Offer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Offers</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{offers.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Offers</p>
                <p className="text-2xl font-black text-green-600 mt-1">
                  {offers.filter(o => o.status?.toLowerCase() === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Categories</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{categories.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg. Discount</p>
                <p className="text-2xl font-black text-orange-600 mt-1">
                  {Math.round(offers.reduce((acc, o) => acc + (o.discountPercentage || 0), 0) / (offers.length || 1))}%
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
            />
          </div>
          <div className="sm:w-64">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-500">Loading your offers...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOffers.length === 0 && (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Tag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No offers found</h3>
            <p className="text-gray-500">
              {searchTerm || categoryFilter ? 'Try adjusting your filters' : 'Create your first offer to get started'}
            </p>
            {!searchTerm && !categoryFilter && (
              <button 
                onClick={() => navigate('/admin/offers/create')}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="h-4 w-4" />
                Create Offer
              </button>
            )}
          </div>
        )}

        {/* Offers Table */}
        {!isLoading && filteredOffers.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Offer Title</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Orig. Price</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Promo Price</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
                  {filteredOffers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 group">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {offer.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">
                            {offer.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {offer.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 line-through">₹{offer.originalPrice}</td>
                      <td className="p-4">
                        <span className="font-bold text-green-600">₹{offer.offerPrice}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            {Math.round(offer.discountPercentage)}% OFF
                          </span>
                          <div className="hidden sm:block w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                              style={{ width: `${Math.min(offer.discountPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={offer.status || 'draft'} />
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => navigate(`/offers/${offer.id}`)}
                            className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                            title="View Public Page"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => navigate('/admin/offers/slots', { state: { offerId: offer.id } })}
                            className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                            title="Manage Slots"
                          >
                            <Calendar size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(offer.id)}
                            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                            title="Delete Offer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {!isLoading && filteredOffers.length > 0 && (
          <div className="mt-4 text-center text-xs text-gray-500">
            Showing {filteredOffers.length} of {offers.length} offers
          </div>
        )}
      </main>
    </div>
  );
}