import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import apiClient from '../../api/apiClient';
import { type OfferResponseDto, type SlotResponseDto } from '../../types/apiTypes';
import { Clock, Users, Phone, Mail, User, MessageSquare, Tag, Sparkles, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { formatSlotTimeRange } from '../../utils/formatters';

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<OfferResponseDto | null>(null);
  const [slots, setSlots] = useState<SlotResponseDto[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    customerName: '', 
    customerPhone: '', 
    customerEmail: '', 
    peopleCount: 1, 
    specialNote: '' 
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, customerEmail: savedEmail }));
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      apiClient.get(`/offer/${id}`).then(res => setOffer(res.data)).catch(e => console.error(e)),
      apiClient.get(`/slot/offer/${id}`).then(res => setSlots(res.data)).catch(e => console.error(e))
    ]).finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) {
      alert("Please choose a time slot to secure your booking.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        offerId: id,
        slotId: selectedSlotId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        peopleCount: formData.peopleCount,
        specialNote: formData.specialNote || undefined,
      };

      const res = await apiClient.post("/booking", payload);
      navigate("/bookings/confirmation", {
        state: { bookingReference: res.data.bookingReference },
      });
    } catch (err: any) {
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        const errorMessages = Object.values(backendErrors).flat().join(" ");
        setError(errorMessages || "Validation failed. Check your data.");
      } else {
        setError("Something went wrong while processing your booking.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <Tag className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Offer not found</h3>
          <p className="text-gray-500 mb-4">The offer you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/offers')} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Browse Offers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <PublicNavbar />
      <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto mb-4">
        <button 
          onClick={() => navigate('/offers')} 
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Offers</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column - Offer Details */}
            <div className="p-8 lg:p-10 bg-linear-to-br from-gray-50 to-white border-r border-gray-100">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full mb-6">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{offer.category}</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-4">
                {offer.title}
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {offer.description}
              </p>
              
              {/* Terms & Conditions */}
              <div className="mb-6 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Terms & Conditions</h4>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {offer.termsAndConditions || "Standard terms apply. Please read carefully before booking."}
                </p>
              </div>

              {/* Price Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl lg:text-5xl font-black text-gray-900">₹{offer.offerPrice}</span>
                  <span className="text-gray-400 line-through text-lg">₹{offer.originalPrice}</span>
                  <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    Save {Math.round(offer.discountPercentage)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    style={{ width: `${offer.discountPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-5">
              <div className="mb-2">
                <h3 className="text-2xl font-bold text-gray-900">Reserve Your Spot</h3>
                <p className="text-gray-500 text-sm mt-1">Fill in your details to confirm booking</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Updated Step 1: Time Slot Selection Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" /> Choose Time Slot
                </label>
                
                {slots.length === 0 ? (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl font-medium">
                    No time slots are currently configured for this deal.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {slots.map((slot) => {
                      const unavailable = !slot.isAvailable;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={unavailable}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`p-3 text-left border rounded-xl text-sm font-semibold transition-all duration-150 ${
                            unavailable
                              ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                              : selectedSlotId === slot.id
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-2 ring-indigo-600/20"
                              : "border-gray-200 hover:border-gray-400 text-gray-700 bg-white"
                          }`}
                        >
                          <span className="block">{formatSlotTimeRange(slot.startTime, slot.endTime)}</span>
                          <span className="text-xs font-normal mt-0.5 block">
                            {unavailable ? "Fully booked" : `${slot.capacity} spots`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <User className="inline h-3 w-3 mr-1" /> Full Name
                </label>
                <input 
                  type="text" 
                  value={formData.customerName} 
                  onChange={e => setFormData({...formData, customerName: e.target.value})} 
                  required 
                  placeholder="Enter your full name"
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <Phone className="inline h-3 w-3 mr-1" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  value={formData.customerPhone} 
                  onChange={e => setFormData({...formData, customerPhone: e.target.value})} 
                  required 
                  placeholder="Enter your mobile number"
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <Mail className="inline h-3 w-3 mr-1" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={formData.customerEmail} 
                  onChange={e => setFormData({...formData, customerEmail: e.target.value})} 
                  required 
                  placeholder="Enter your email address"
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              {/* People Count */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <Users className="inline h-3 w-3 mr-1" /> Number of People
                </label>
                <input 
                  type="number" 
                  min={1} 
                  max={20}
                  value={formData.peopleCount} 
                  onChange={e => setFormData({...formData, peopleCount: Number(e.target.value)})} 
                  required 
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
                />
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  <MessageSquare className="inline h-3 w-3 mr-1" /> Special Requests (Optional)
                </label>
                <textarea 
                  value={formData.specialNote} 
                  onChange={e => setFormData({...formData, specialNote: e.target.value})} 
                  rows={3}
                  placeholder="Any special requirements or notes..."
                  className="mt-1 block w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 resize-none"
                />
              </div>

              {/* Updated Submit Button */}
              <button 
                type="submit" 
                disabled={submitting || slots.length === 0 || !selectedSlotId}
                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Reservation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>

              {/* Security Note */}
              <p className="text-center text-xs text-gray-400 mt-4">
                Use the same email as your account to see this booking under My Bookings
              </p>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}