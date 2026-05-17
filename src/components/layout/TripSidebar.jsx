import { Link, useParams, useLocation } from 'react-router-dom';
import { CalendarDays, DollarSign, Map, Package, Users, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { useTripContext } from '../../context/TripContext';

const tabs = [
  { key: 'overview', label: 'Overview', icon: Map, path: '' },
  { key: 'itinerary', label: 'Itinerary', icon: CalendarDays, path: '/itinerary' },
  { key: 'budget', label: 'Budget', icon: DollarSign, path: '/budget' },
  { key: 'packing', label: 'Packing', icon: Package, path: '/packing' },
];

export default function TripSidebar() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { currentTrip } = useTripContext();

  const getActiveTab = () => {
    if (pathname.endsWith('/itinerary')) return 'itinerary';
    if (pathname.endsWith('/budget')) return 'budget';
    if (pathname.endsWith('/packing')) return 'packing';
    return 'overview';
  };

  const active = getActiveTab();

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-2">
      <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        All trips
      </Link>

      {currentTrip && (
        <div className="glass p-3 mb-2">
          <p className="text-2xl mb-1">{currentTrip.emoji || '✈️'}</p>
          <p className="text-sm font-semibold text-white truncate">{currentTrip.name}</p>
          <p className="text-xs text-slate-400 truncate">{currentTrip.destination}</p>
        </div>
      )}

      <nav className="flex flex-col gap-1">
        {tabs.map(({ key, label, icon: Icon, path }) => (
          <Link
            key={key}
            to={`/trips/${id}${path}`}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              active === key
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
