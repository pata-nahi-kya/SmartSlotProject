import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import apiClient from '../../api/apiClient';
import { 
  Plus, 
  Building2, 
  Tag, 
  DollarSign, 
  Calendar, 
  FileText, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function CreateOffer() {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    businessId: '', 
    title: '', 
    description: '', 
    category: '',
    originalPrice: 0, 
    offerPrice: 0, 
    startDate: '', 
    endDate: '', 
    termsAndConditions: ''
  });

  useEffect(() => {
    setIsFetching(true);
    apiClient.get('/business')
      .then(res => {
        setBusinesses(res.data);
        setIsFetching(false);
      })
      .catch(err => {
        console.error(err);
        setIsFetching(false);
        setMessage({ type: 'error', text: 'Failed to load businesses. Please refresh the page.' });
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (form.originalPrice <= form.offerPrice) {
      setMessage({ type: 'error', text: 'Offer price must be less than original price to provide a discount!' });
      return;
    }
    
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setMessage({ type: 'error', text: 'End date must be after start date!' });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      await apiClient.post('/offer', form);
      setMessage({ type: 'success', text: '🎉 Offer created successfully! Your campaign is now live.' });
      setForm({
        businessId: '', 
        title: '', 
        description: '', 
        category: '',
        originalPrice: 0, 
        offerPrice: 0, 
        startDate: '', 
        endDate: '', 
        termsAndConditions: ''
      });
      // Reset form
      const formElement = document.getElementById('offer-form') as HTMLFormElement;
      if (formElement) formElement.reset();
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to create offer. Please check your inputs and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const discountPercentage = form.originalPrice > form.offerPrice 
    ? Math.round(((form.originalPrice - form.offerPrice) / form.originalPrice) * 100)
    : 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Create Strategic Offer Slot
              </h2>
            </div>
            <p className="text-gray-500 mt-1">Launch a new promotional campaign to attract more customers</p>
          </div>

          {/* Message Alerts */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border-l-4 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-500 text-green-700' 
                : 'bg-red-50 border-red-500 text-red-700'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
                <div className="ml-auto">
                  <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-600">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview Card (Live Preview) */}
          {form.title && form.category && (form.originalPrice > 0 || form.offerPrice > 0) && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-gray-800">Live Preview</h3>
                </div>
                <span className="text-xs text-gray-500">How your offer will appear</span>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {form.category || 'Category'}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Save {discountPercentage}%
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">{form.title || 'Offer Title'}</h4>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-gray-900">₹{form.offerPrice || 0}</span>
                  <span className="text-sm text-gray-400 line-through">₹{form.originalPrice || 0}</span>
                </div>
                {form.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{form.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Main Form */}
          <form id="offer-form" onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 lg:p-8 space-y-6">
            {/* Business Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <Building2 className="inline h-3 w-3 mr-1" /> Target Business Profile
                </label>
                {isFetching ? (
                  <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                ) : (
                  <select 
                    value={form.businessId} 
                    onChange={e => setForm({...form, businessId: e.target.value})} 
                    required 
                    className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                  >
                    <option value="">Select Business Account</option>
                    {businesses.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.name}{b.city ? ` — ${b.city}` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <Tag className="inline h-3 w-3 mr-1" /> Offer Title Name
                </label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  required 
                  placeholder="e.g., Weekend Special Brunch"
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Category and Pricing */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Category Tag
                </label>
                <input 
                  type="text" 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                  required 
                  placeholder="e.g., Food, Spa, Adventure"
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <DollarSign className="inline h-3 w-3 mr-1" /> Original Price (₹)
                </label>
                <input 
                  type="number" 
                  value={form.originalPrice} 
                  onChange={e => setForm({...form, originalPrice: Number(e.target.value)})} 
                  required 
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Offer Price (₹)
                </label>
                <input 
                  type="number" 
                  value={form.offerPrice} 
                  onChange={e => setForm({...form, offerPrice: Number(e.target.value)})} 
                  required 
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
                {discountPercentage > 0 && (
                  <p className="text-xs text-green-600 mt-1">✨ {discountPercentage}% discount for customers</p>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <Calendar className="inline h-3 w-3 mr-1" /> Campaign Start Date
                </label>
                <input 
                  type="datetime-local" 
                  value={form.startDate} 
                  onChange={e => setForm({...form, startDate: e.target.value})} 
                  required 
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <Clock className="inline h-3 w-3 mr-1" /> Campaign End Date
                </label>
                <input 
                  type="datetime-local" 
                  value={form.endDate} 
                  onChange={e => setForm({...form, endDate: e.target.value})} 
                  required 
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                <FileText className="inline h-3 w-3 mr-1" /> Marketing Description
              </label>
              <textarea 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                required 
                rows={3} 
                placeholder="Describe your offer in detail. What makes it special? What can customers expect?"
                className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.description.length}/500 characters
              </p>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                <FileText className="inline h-3 w-3 mr-1" /> Terms & Conditions
              </label>
              <textarea 
                value={form.termsAndConditions} 
                onChange={e => setForm({...form, termsAndConditions: e.target.value})} 
                required 
                rows={2} 
                placeholder="e.g., Valid on weekdays only. Prior booking required. Cannot be combined with other offers."
                className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Offer...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Commit Scheme Records</span>
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  setForm({
                    businessId: '', title: '', description: '', category: '',
                    originalPrice: 0, offerPrice: 0, startDate: '', endDate: '', termsAndConditions: ''
                  });
                  setMessage(null);
                }}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Clear Form
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
              <p>All fields are required. Ensure offer price is less than original price to provide a valid discount.</p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}