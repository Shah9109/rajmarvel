import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Home, Info, Wrench, Briefcase, Mail, LogOut, User,
  FolderOpen, CreditCard, FileText, LayoutDashboard, FolderKanban
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Public links (guests)
  const publicNavLinks = [
    { name: 'Home',     path: '/',         icon: <Home size={20} /> },
    { name: 'Services', path: '/services', icon: <Wrench size={20} /> },
    { name: 'Portfolio',path: '/projects', icon: <Briefcase size={20} /> },
    { name: 'About',    path: '/about',    icon: <Info size={20} /> },
    { name: 'Contact',  path: '/contact',  icon: <Mail size={20} /> },
  ];

  // User dashboard nav
  const userNavLinks = [
    { name: 'Projects', path: '/dashboard?tab=projects', icon: <FolderOpen size={22} /> },
    { name: 'Payments', path: '/dashboard?tab=payments', icon: <CreditCard size={22} /> },
    { name: 'Bills',    path: '/dashboard?tab=bills',    icon: <FileText size={22} /> },
    { name: 'Profile',  path: '/dashboard?tab=profile',  icon: <User size={22} /> },
  ];

  // Admin dashboard nav
  const adminNavLinks = [
    { name: 'Overview', path: '/admin?tab=overview',  icon: <LayoutDashboard size={22} /> },
    { name: 'Projects', path: '/admin?tab=projects',  icon: <FolderKanban size={22} /> },
    { name: 'Payments', path: '/admin?tab=payments',  icon: <CreditCard size={22} /> },
    { name: 'Profile',  path: '/admin?tab=profile',   icon: <User size={22} /> },
  ];

  // Active link check (handles ?tab= query params)
  const isActive = (path) => {
    const [pathname, search] = path.split('?');
    if (!search) return location.pathname === pathname;
    return location.pathname === pathname && location.search === `?${search}`;
  };

  // Pick which bottom nav to render
  const mobileNavLinks = !user
    ? publicNavLinks
    : user.role === 'admin'
    ? adminNavLinks
    : userNavLinks;

  const cols = mobileNavLinks.length === 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <>
      {/* ── Mobile Top Header ── */}
      <div className="md:hidden bg-white shadow-sm fixed top-0 w-full z-50 h-14 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.png" alt="Raj Marvel Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#f9a8d4]">
              Raj Marvel
            </span>
            <span className="text-[9px] font-semibold tracking-widest text-gray-400 uppercase">Exterior Designs</span>
          </div>
        </Link>
        {user ? (
          <button onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 text-xs font-semibold border border-red-200 px-2.5 py-1.5 rounded-lg">
            <LogOut size={14} /> Logout
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-gray-600 font-medium hover:text-primary">Login</Link>
            <Link to="/register" className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow">Sign Up</Link>
          </div>
        )}
      </div>

      {/* ── Desktop Navbar ── */}
      <nav className="hidden md:flex bg-white shadow-md fixed top-0 w-full z-50 h-16 items-center px-8 justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/favicon.png" alt="Raj Marvel Logo" className="w-11 h-11 object-contain drop-shadow-md" />
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#f9a8d4]">
              Raj Marvel
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mt-0.5">Exterior Designs</span>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {publicNavLinks.map((link) => (
            <Link key={link.name} to={link.path}
              className={`font-medium hover:text-primary transition-colors ${
                location.pathname === link.path ? 'text-primary' : 'text-gray-600'}`}>
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                <User size={18} /> {user.name}
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-sm">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 font-medium hover:text-primary transition-colors">Login</Link>
              <Link to="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 hover:shadow-lg transition-all">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 h-16">
        <div className={`grid h-full ${cols}`}>
          {mobileNavLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link key={link.name} to={link.path}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors
                  ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                <div className={`p-1 rounded-xl transition-colors ${active ? 'bg-primary/10' : ''}`}>
                  {link.icon}
                </div>
                <span className="text-[10px] font-semibold">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
