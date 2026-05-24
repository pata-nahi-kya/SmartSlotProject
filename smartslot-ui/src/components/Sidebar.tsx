import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FolderArchive, 
  BookOpen, 
  LogOut,
  Sparkles,
  ChevronRight,
  Settings,
  HelpCircle,
  Bell,
  User,
  Building2,
} from 'lucide-react';
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, color: 'blue' },
    { name: 'Create Business', path: '/admin/business/create', icon: Building2, color: 'cyan' },
    { name: 'Create Offer', path: '/admin/offers/create', icon: PlusCircle, color: 'green' },
    { name: 'Manage Offers', path: '/admin/offers/manage', icon: FolderArchive, color: 'purple' },
    { name: 'Manage Slots', path: '/admin/offers/slots', icon: PlusCircle, color: 'indigo' },
    { name: 'Manage Bookings', path: '/admin/bookings', icon: BookOpen, color: 'amber' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/admin/login');
  };

  const getIconColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'text-blue-400',
      green: 'text-green-400',
      purple: 'text-purple-400',
      amber: 'text-amber-400',
      indigo: 'text-indigo-400',
      cyan: 'text-cyan-400',
    };
    return colors[color] || 'text-gray-400';
  };

  return (
    <aside className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex flex-col min-h-screen shadow-2xl border-r border-white/10">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none"></div>
      
      {/* Header Section */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              SmartSlot
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Management Console</p>
          </div>
        </div>
        
        {/* User info (optional) */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center ring-2 ring-gray-700">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin User</p>
              <p className="text-[10px] text-gray-500 truncate">administrator@smartslot.com</p>
            </div>
            <div className="relative">
              <Bell className="w-4 h-4 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="relative flex-1 p-4 space-y-2">
        <div className="mb-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">Main Menu</p>
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const iconColor = getIconColor(item.color);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white shadow-lg border border-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  size={18} 
                  className={`transition-all duration-200 ${
                    isActive ? iconColor : 'group-hover:text-white'
                  }`} 
                />
                <span className="text-sm">{item.name}</span>
              </div>
              {isActive && (
                <ChevronRight size={14} className="text-blue-400 animate-pulse" />
              )}
              {!isActive && (
                <div className="absolute left-0 w-0.5 h-0 bg-blue-500 rounded-full transition-all duration-300 group-hover:h-6"></div>
              )}
            </button>
          );
        })}
        
        {/* Divider */}
        <div className="my-4 border-t border-white/10"></div>
        
        {/* Additional Menu Items */}
        <div className="mb-2">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">Support</p>
        </div>
        
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5"
        >
          <HelpCircle size={18} />
          <span className="text-sm">Help & Support</span>
        </button>
        
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5"
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>
      </nav>

      {/* Logout Section */}
      <div className="relative p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-gradient-to-r hover:from-red-600/80 hover:to-red-700/80 text-gray-400 hover:text-white py-2.5 px-4 rounded-xl transition-all duration-200 text-sm font-medium border border-white/10 hover:border-red-500/50"
        >
          <LogOut size={16} className="group-hover:rotate-180 transition-transform duration-300" />
          <span>Logout Session</span>
        </button>
        
        {/* Version info */}
        <p className="text-center text-[10px] text-gray-600 mt-4">
          Version 2.0.0 | © 2024
        </p>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </aside>
  );
}