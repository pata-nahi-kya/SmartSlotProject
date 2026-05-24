import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";
import apiClient from "../../api/apiClient";
import { type PublicBookingTrackerDto } from "../../types/apiTypes";
import { formatSlotTimeRange } from "../../utils/formatters";
import { Search, Calendar, Clock, Users } from "lucide-react";

export default function TrackBooking() {
  const location = useLocation();
  const initialRef = (location.state as { reference?: string })?.reference || "";
  const [reference, setReference] = useState(initialRef);
  const [booking, setBooking] = useState<PublicBookingTrackerDto | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const lookup = async (ref: string) => {
    setError("");
    setBooking(null);
    if (!ref.trim()) {
      setError("Enter your booking reference");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.get(`/booking/reference/${encodeURIComponent(ref.trim())}`);
      setBooking(res.data);
    } catch {
      setError("No booking found with that reference. Check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      lookup(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(reference);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <PublicNavbar />

      <main className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
          <Search className="h-7 w-7 text-blue-600" />
          Track Your Booking
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Enter the reference from your confirmation email or page (e.g. BK-...)
        </p>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl border shadow-lg p-6 space-y-4">
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="BK-638745612345678900"
            className="w-full px-4 py-3 border rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Find Booking"}
          </button>
        </form>

        {booking && (
          <div className="mt-8 bg-white rounded-2xl border shadow-lg p-6 space-y-3">
            <p className="font-mono text-sm font-bold text-blue-600">{booking.bookingReference}</p>
            <h2 className="text-xl font-bold text-gray-900">{booking.offerTitle}</h2>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatSlotTimeRange(booking.slotStartTime, booking.slotEndTime)}
            </p>
            <p className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              {booking.peopleCount} guests · {booking.customerName}
            </p>
            <p className="text-xs text-gray-500">Contact: {booking.maskedPhone}</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
              {booking.status}
            </span>
            <p className="text-xs text-gray-400 pt-2 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Booked {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
