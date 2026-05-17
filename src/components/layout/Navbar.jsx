import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plane, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../services/authService';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-all">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg">
              Wander<span className="gradient-text">Family</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-slate-300">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}

          {!user && (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="text-slate-300 hover:text-white text-sm transition-colors">Sign in</Link>
              <Link to="/signup" className="btn-primary text-sm px-4 py-2">Get started</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-navy-900 px-4 py-3 space-y-2">
          {user ? (
            <>
              <div className="text-sm text-slate-400 pb-2">{user.displayName || user.email}</div>
              <button onClick={handleLogout} className="w-full text-left text-sm text-slate-300 hover:text-white py-2">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm text-slate-300 py-2" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" className="block text-sm text-teal-400 py-2" onClick={() => setMenuOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
