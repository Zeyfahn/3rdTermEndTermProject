import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Plane, TrendingUp, Users, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTripContext } from '../context/TripContext';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/trips/TripCard';
import Button from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { getTripStatus } from '../utils/dateUtils';

const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Completed'];

export default function Dashboard() {
  const { user } = useAuth();
  const { trips, loading } = useTripContext();
  const { fetchTrips } = useTrips();
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const filtered = useMemo(() => {
    if (filter === 'All') return trips;
    return trips.filter((t) => getTripStatus(t.startDate, t.endDate) === filter.toLowerCase());
  }, [trips, filter]);

  const stats = useMemo(() => ({
    total: trips.length,
    upcoming: trips.filter((t) => getTripStatus(t.startDate, t.endDate) === 'upcoming').length,
    ongoing: trips.filter((t) => getTripStatus(t.startDate, t.endDate) === 'ongoing').length,
    completed: trips.filter((t) => getTripStatus(t.startDate, t.endDate) === 'completed').length,
  }), [trips]);

  const firstName = user?.displayName?.split(' ')[0] || 'Traveler';

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-slate-400 text-sm mb-1">Good to see you back,</p>
          <h1 className="text-3xl font-display font-bold text-white">
            {firstName} 👋
          </h1>
        </div>
        <Link to="/trips/new">
          <Button icon={Plus} size="md">New Trip</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Trips', value: stats.total, icon: Plane, color: 'text-teal-400' },
          { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'text-cyan-400' },
          { label: 'Ongoing', value: stats.ongoing, icon: TrendingUp, color: 'text-amber-400' },
          { label: 'Completed', value: stats.completed, icon: MapPin, color: 'text-slate-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="text-2xl font-display font-bold text-white">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-teal-500/20 text-teal-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Trips grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 glass rounded-2xl">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            {filter === 'All' ? 'No trips yet' : `No ${filter.toLowerCase()} trips`}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {filter === 'All' ? 'Start planning your first family adventure!' : 'Try a different filter.'}
          </p>
          {filter === 'All' && (
            <Link to="/trips/new"><Button icon={Plus}>Plan a trip</Button></Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
