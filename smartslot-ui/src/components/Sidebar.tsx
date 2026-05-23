import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FolderLayers, BookOpen, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Create Offer', path: '/admin/offers/create', icon: PlusCircle },
    { name: 'Manage Offers', path: '/admin/offers/manage', icon: FolderLayers },
    { name: 'Manage Bookings', path: '/admin/bookings', icon: BookOpen },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen shadow-xl border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">SmartSlot Console</h1>
        <p className="text-xs text-slate-400 mt-1">Management Hub</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition text-left ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 py-2.5 px-4 rounded-lg transition text-sm font-medium"
        >
          <LogOut size={16} />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
