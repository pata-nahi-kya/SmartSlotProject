import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import apiClient from "../../api/apiClient";
import { type OfferResponseDto, type SlotResponseDto } from "../../types/apiTypes";
import { formatSlotTimeRange } from "../../utils/formatters";
import { Clock, Plus, Tag } from "lucide-react";

export default function ManageSlots() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedOfferId = (location.state as { offerId?: string })?.offerId || "";
  const [offers, setOffers] = useState<OfferResponseDto[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState(preselectedOfferId);
  const [slots, setSlots] = useState<SlotResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    capacity: 10,
  });

  useEffect(() => {
    apiClient.get("/offer").then((res) => setOffers(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedOfferId) {
      setSlots([]);
      return;
    }
    setIsLoading(true);
    apiClient
      .get(`/slot/offer/${selectedOfferId}`)
      .then((res) => setSlots(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedOfferId]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferId) return;

    setIsSubmitting(true);
    setMessage(null);
    try {
      await apiClient.post("/slot", {
        offerId: selectedOfferId,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        capacity: form.capacity,
      });
      setMessage({ type: "success", text: "Time slot created successfully." });
      setForm({ startTime: "", endTime: "", capacity: 10 });
      const res = await apiClient.get(`/slot/offer/${selectedOfferId}`);
      setSlots(res.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create slot.";
      setMessage({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOffer = offers.find((o) => o.id === selectedOfferId);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-6 w-6 text-blue-600" />
            <h2 className="text-3xl font-black text-gray-900">Manage Time Slots</h2>
          </div>
          <p className="text-gray-500">Create and view availability slots for your offers</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border-l-4 ${
              message.type === "success"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-red-50 border-red-500 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-gray-800">Select Offer</h3>
            <select
              value={selectedOfferId}
              onChange={(e) => setSelectedOfferId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an offer...</option>
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} ({o.status})
                </option>
              ))}
            </select>

            {selectedOffer && (
              <form onSubmit={handleCreateSlot} className="space-y-4 pt-4 border-t">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New Slot
                </h3>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Start</label>
                  <input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">End</label>
                  <input
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    required
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Slot"}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border shadow-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Existing Slots
              {selectedOffer && <span className="text-sm font-normal text-gray-500">— {selectedOffer.title}</span>}
            </h3>
            {!selectedOfferId ? (
              <p className="text-gray-500 text-sm">Select an offer to view its slots.</p>
            ) : isLoading ? (
              <p className="text-gray-500 text-sm">Loading slots...</p>
            ) : slots.length === 0 ? (
              <p className="text-gray-500 text-sm">No slots yet. Create one using the form.</p>
            ) : (
              <ul className="space-y-3">
                {slots.map((slot) => (
                  <li
                    key={slot.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {formatSlotTimeRange(slot.startTime, slot.endTime)}
                      </p>
                      <p className="text-xs text-gray-500">Capacity: {slot.capacity}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        slot.isAvailable
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {slot.isAvailable ? "Available" : "Full"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/offers/manage")}
          className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Manage Offers
        </button>
      </main>
    </div>
  );
}
