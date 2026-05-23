import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { OfferResponseDto, SlotResponseDto } from '../../types/apiTypes';

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<OfferResponseDto | null>(null);
  const [slots, setSlots] = useState<SlotResponseDto[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [bookingForm, setBookingForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', peopleCount: 1, specialNote: '' });
  const [err, setErr] = useState('');

  useEffect(() => {
    apiClient.get(`/offer/${id}`).then(res => setOffer(res.data)).catch(e => console.error(e));
    apiClient.get(`/slot/offer/${id}`).then(res => setSlots(res.data)).catch(e => console.error(e));
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) return setErr('Please specify an allocated target time slot.');
    try {
      const response = await apiClient.post('/booking', { offerId: id, slotId: selectedSlotId, ...bookingForm });
      navigate('/bookings/confirmation', { state: { booking: response.data } });
    } catch (e: any) {
      setErr(e.response?.data?.message || 'Transaction reservation aborted.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 border-r border-slate-100 flex flex-col justify-between bg-slate-50/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{offer?.title}</h2>
            <p className="text-slate-500 mt-4 text-sm leading-relaxed">{offer?.description}</p>
            <div className="mt-6 p-4 bg-white border border-slate-200 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contractual Terms</h4>
              <p className="text-slate-600 text-xs mt-1 leading-normal">{offer?.termsAndConditions}</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-900">₹{offer?.offerPrice}</span>
            <span className="text-slate-400 line-through text-lg">₹{offer?.originalPrice}</span>
          </div>
        </div>

        <form onSubmit={handleBooking} className="p-8 space-y-5">
          <h3 className="text-xl font-bold text-slate-900">Reserve Allocation Seat</h3>
          {err && <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100">{err}</div>}
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Available Time Slots</label>
            <select value={selectedSlotId} onChange={e => setSelectedSlotId(e.target.value)} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="">Select Time Window</option>
              {slots.map(s => <option key={s.id} value={s.id} disabled={s.bookedCount >= s.capacity}>{s.slotDate.split('T')[0]} ({s.startTime} - {s.endTime}) - {s.capacity - s.bookedCount} Free</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Full Name</label>
            <input type="text" value={bookingForm.customerName} onChange={e => setBookingForm({...bookingForm, customerName: e.target.value})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Phone Contact</label>
            <input type="text" value={bookingForm.customerPhone} onChange={e => setBookingForm({...bookingForm, customerPhone: e.target.value})} required className="mt-1 block w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Party headcount size (Pax)</label>
            <input type="number" min={1} value={bookingForm.peopleCount} onChange={e => setBookingForm({...bookingForm, peopleCount: Number(e.target.value)})} required className="mt-1 block w-full rounded-xl border border-slate-3
