import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";
import apiClient from "../../api/apiClient";
import { type CustomerBookingDto } from "../../types/apiTypes";
import { formatSlotTimeRange } from "../../utils/formatters";
import { Calendar, Clock, Users, Tag, XCircle, RefreshCw } from "lucide-react";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<CustomerBookingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = () => {
    setIsLoading(true);
    apiClient
      .get("/booking/me")
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) navigate("/login");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this reservation?")) return;
    setCancellingId(id);
    try {
      await apiClient.put(`/booking/me/${id}/cancel`);
      fetchBookings();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not cancel booking";
      alert(msg);
    } finally {
      setCancellingId(null);
    }
  };

  const statusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "confirmed") return "bg-green-50 text-green-700";
    if (s === "cancelled") return "bg-red-50 text-red-700";
    if (s === "completed") return "bg-blue-50 text-blue-700";
    if (s === "pending") return "bg-amber-50 text-amber-700";
    return "bg-gray-50 text-gray-700";
  };

  const canCancel = (status: string) => {
    const s = status.toLowerCase();
    return s === "confirmed" || s === "pending";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              My Booked Slots
            </h1>
            <p className="text-gray-500 mt-1">View and manage your reservations</p>
          </div>
          <button
            onClick={fetchBookings}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-500">Loading your bookings...</p>
          </div>
        )}

        {!isLoading && bookings.length === 0 && (
          <div className="text-center py-16 bg-white/80 rounded-2xl border shadow-sm">
            <Calendar className="h-14 w-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No bookings yet</h3>
            <p className="text-gray-500 mt-1 text-sm max-w-sm mx-auto">
              Book a slot using the same email as your account so reservations appear here.
            </p>
            <button
              onClick={() => navigate("/offers")}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
            >
              Browse Offers
            </button>
          </div>
        )}

        {!isLoading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((b) => (
              <article
                key={b.id}
                className="bg-white/90 backdrop-blur rounded-2xl border shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {b.bookingReference}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{b.offerTitle}</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {formatSlotTimeRange(b.slotStartTime, b.slotEndTime)}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {b.peopleCount} guest{b.peopleCount > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-green-700">
                        <Tag className="h-4 w-4" />
                        ₹{b.offerPrice}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Booked on {new Date(b.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={() => navigate(`/offers/${b.offerId}`)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50"
                    >
                      View Offer
                    </button>
                    {canCancel(b.status) && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={cancellingId === b.id}
                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
