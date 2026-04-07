import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../../hooks';
import { ThemeContext, THEMES } from '../../context/ThemeContext';
import { BookOpen, Layers, LibraryBig, Presentation, Palette, ShoppingCart, User, LogOut, Settings, LayoutDashboard, Shield, BookMarked, Home, Baby, GraduationCap, School } from 'lucide-react';
import { StaggeredMenu } from '../animations/StaggeredMenu';
import { getDashboardRouteForRole } from '../../utils/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext);
  const dashboardRoute = getDashboardRouteForRole(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home', link: '/' },
    { label: 'Books', ariaLabel: 'Browse books', link: '/books' },
    { label: 'Courses', ariaLabel: 'All courses', link: '/courses' },
    { label: 'Mentor', ariaLabel: 'Become a mentor', link: '/mentor' },
    ...(user ? [{ label: 'Dashboard', ariaLabel: 'User dashboard', link: dashboardRoute }] : [
      { label: 'Login', ariaLabel: 'Login to account', link: '/login' },
      { label: 'Sign Up', ariaLabel: 'Create new account', link: '/signup' }
    ])
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://instagram.com' },
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-sm border-b border-base-200 sticky top-0 z-[100] px-4 lg:px-8">
      <div className="navbar-start gap-4">
        <Link to="/" className="btn btn-ghost text-xl font-bold flex gap-2 items-center z-50">
          <img src="/photo/e-learning.png" alt="Logo" className="h-8" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="hidden sm:inline">Coursiva</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium gap-2 text-base items-center">
          <li><Link to="/" className="hover:text-primary transition-colors flex items-center gap-2 px-4"><Home className="w-5 h-5"/> Home</Link></li>
          {user && <li><Link to={dashboardRoute} className="hover:text-primary transition-colors flex items-center gap-2 px-4"><BookMarked className="w-5 h-5"/> My Courses</Link></li>}
          <li><Link to="/books" className="hover:text-primary transition-colors flex items-center gap-2 px-4"><BookOpen className="w-5 h-5"/> Books</Link></li>
          <li>
            <details>
              <summary className="hover:text-primary transition-colors flex items-center gap-2 px-4"><Layers className="w-5 h-5"/> Categories</summary>
              <ul className="p-3 shadow-xl bg-base-100/90 backdrop-blur-lg rounded-box w-56 z-50 gap-1 border border-base-200 mt-4">
                <li><Link to="/courses?cat=kindergarten" className="py-2 flex items-center"><Baby className="w-4 h-4 mr-2"/> Kindergarten</Link></li>
                <li><Link to="/courses?cat=highschool" className="py-2 flex items-center"><School className="w-4 h-4 mr-2"/> High School</Link></li>
                <li><Link to="/courses?cat=college" className="py-2 flex items-center"><GraduationCap className="w-4 h-4 mr-2"/> College</Link></li>
              </ul>
            </details>
          </li>
          <li><Link to="/courses" className="hover:text-primary transition-colors flex items-center gap-2 px-4"><LibraryBig className="w-5 h-5"/> Courses</Link></li>
          <li><Link to="/mentor" className="text-primary font-bold hover:bg-primary/10 rounded-full px-5 py-2 transition-colors flex items-center gap-2"><Presentation className="w-5 h-5"/> Become a Mentor</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end gap-4">
        {/* Theme Controller */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" title="Change Theme">
            <Palette className="w-5 h-5 text-base-content/80" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-3 shadow-xl bg-base-100/90 backdrop-blur-lg rounded-box w-56 gap-1 border border-base-200 mt-4">
            <li className="menu-title px-4 py-2 text-xs uppercase tracking-wider font-bold opacity-60">Themes</li>
            {THEMES.map(theme => (
              <li key={theme.value}>
                <button 
                  className={`py-3 ${themeCtx?.theme === theme.value ? 'bg-primary/10 text-primary font-bold' : ''}`}
                  onClick={() => {
                    themeCtx?.setTheme(theme.value as any);
                    (document.activeElement as HTMLElement)?.blur();
                  }}
                >
                  <span className="text-lg mr-2">{theme.emoji}</span> {theme.label.replace(theme.emoji, '').trim()}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Cart */}
        <Link to="/cart" className="btn btn-ghost btn-circle relative">
          <ShoppingCart className="w-5 h-5 text-base-content/80" />
          {cart.totalItems > 0 && (
            <span className="badge badge-error badge-sm absolute top-0 right-0 font-bold border-2 border-base-100 shadow-sm">
              {cart.totalItems}
            </span>
          )}
        </Link>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center">
          <StaggeredMenu 
            isFixed={true} 
            items={menuItems} 
            socialItems={socialItems}
            accentColor="oklch(var(--p))"
            colors={['oklch(var(--b2))', 'oklch(var(--b1))']}
            menuButtonColor="oklch(var(--bc))"
            openMenuButtonColor="oklch(var(--bc))"
          />
        </div>

        {/* Account */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-primary/10 text-primary rounded-full w-10 flex items-center justify-center border-2 border-primary/20 hover:border-primary/50 transition-colors">
              {user ? (
                <span className="font-bold text-lg">{user.username?.charAt(0).toUpperCase()}</span>
              ) : (
                <User className="w-5 h-5 text-base-content/70" />
              )}
            </div>
          </div>
          <ul tabIndex={0} className="mt-4 z-[1] p-3 shadow-xl menu menu-md dropdown-content bg-base-100/90 backdrop-blur-lg rounded-box w-64 gap-1 border border-base-200">
            {user ? (
              <>
                <li className="menu-title px-4 py-2">
                  <span className="block text-xs opacity-70 uppercase tracking-wider font-bold mb-1">Signed in as</span>
                  <strong className="block truncate text-base-content text-sm">{user.email}</strong>
                  <span className={`badge badge-sm mt-2 font-bold ${user.role === 'admin' ? 'badge-error' : user.role === 'mentor' ? 'badge-secondary' : 'badge-primary'}`}>
                    {user.role}
                  </span>
                </li>
                <div className="divider my-1 opacity-30"></div>
                {user.role === 'admin' && <li><Link to="/admin" className="py-3"><Shield className="w-5 h-5 mr-3 text-error"/> Admin Dashboard</Link></li>}
                {(user.role === 'mentor' || user.role === 'admin') && <li><Link to="/mentor-dashboard" className="py-3"><LayoutDashboard className="w-5 h-5 mr-3 text-secondary"/> Mentor Dashboard</Link></li>}
                <li><Link to={dashboardRoute} className="py-3"><BookMarked className="w-5 h-5 mr-3 text-primary"/> My Learning</Link></li>
                <li><Link to="/profile" className="py-3"><Settings className="w-5 h-5 mr-3 base-content/70"/> Profile Settings</Link></li>
                <div className="divider my-1 opacity-30"></div>
                <li><button className="text-error font-medium hover:bg-error/10 py-3" onClick={handleLogout}><LogOut className="w-5 h-5 mr-3"/> Sign Out</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="py-3 font-medium"><User className="w-5 h-5 mr-3"/> Login</Link></li>
                <li><Link to="/signup" className="text-primary font-bold py-3"><User className="w-5 h-5 mr-3"/> Sign Up Free</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
