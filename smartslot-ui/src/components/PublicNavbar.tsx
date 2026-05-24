import { useNavigate } from "react-router-dom";
import { Sparkles, LogOut, Calendar, LayoutDashboard, User, LogIn, UserPlus, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, isCustomer, email, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/offers");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/offers")}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition">
            SmartSlot
          </span>
        </button>

        <nav className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/offers")}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Offers
          </button>

          <button
            onClick={() => navigate("/track-booking")}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            Track Booking
          </button>

          {isCustomer && (
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center gap-1.5"
            >
              <Calendar className="h-4 w-4" />
              My Bookings
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Panel
            </button>
          )}

          {isLoggedIn ? (
            <>
              {email && (
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 bg-gray-50 rounded-lg">
                  <User className="h-3.5 w-3.5" />
                  {email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition flex items-center gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition flex items-center gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition flex items-center gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
