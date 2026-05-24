import { useLocation, useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";
import { CheckCircle, ArrowLeft, Calendar, Search } from "lucide-react";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingReference = (location.state as { bookingReference?: string })?.bookingReference;
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <PublicNavbar />
      <div className="flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-6">
          Your reservation has been successfully placed. Save your reference number for check-in.
        </p>
        {bookingReference && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
            <p className="font-mono text-lg font-bold text-blue-700">{bookingReference}</p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition"
            >
              <Calendar className="h-4 w-4" />
              View My Bookings
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition"
            >
              Sign in to manage bookings
            </button>
          )}
          <button
            onClick={() => navigate("/track-booking", { state: { reference: bookingReference } })}
            className="w-full flex items-center justify-center gap-2 border border-blue-200 text-blue-700 font-medium py-3 rounded-xl hover:bg-blue-50 transition"
          >
            <Search className="h-4 w-4" />
            Track This Booking
          </button>
          <button
            onClick={() => navigate("/offers")}
            className="w-full flex items-center justify-center gap-2 text-gray-600 py-2 hover:text-blue-600 transition"
          >
            <Calendar className="h-4 w-4" />
            Browse More Offers
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 text-gray-500 py-2 hover:text-gray-700 transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
