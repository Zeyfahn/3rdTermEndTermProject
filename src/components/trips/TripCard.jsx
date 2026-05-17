import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin } from 'lucide-react';
import { formatShortDate, getTripStatus, getDaysUntilTrip } from '../../utils/dateUtils';
import { clsx } from 'clsx';

const statusConfig = {
  upcoming: { label: 'Upcoming', cls: 'badge-upcoming' },
  ongoing: { label: 'Ongoing', cls: 'badge-ongoing' },
  completed: { label: 'Completed', cls: 'badge-completed' },
};

export default function TripCard({ trip }) {
  const status = getTripStatus(trip.startDate, trip.endDate);
  const daysUntil = getDaysUntilTrip(trip.startDate);
  const { label, cls } = statusConfig[status];

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="glass group block hover:border-teal-500/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Card header */}
      <div className="relative h-28 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.15), rgba(6,182,212,0.15))' }}
      >
        <span className="text-5xl select-none">{trip.emoji || '✈️'}</span>
        <div className="absolute top-3 right-3">
          <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full border', cls)}>
            {label}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-white text-base group-hover:text-teal-400 transition-colors truncate">
            {trip.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 text-sm">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{trip.destination}</span>
          </div>
        </div>

        <div className="divider !my-2" />

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatShortDate(trip.startDate)} → {formatShortDate(trip.endDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{trip.familySize || '?'}</span>
          </div>
        </div>

        {status === 'upcoming' && daysUntil !== null && daysUntil >= 0 && (
          <div className="text-xs text-center py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            {daysUntil === 0 ? '🎉 Trip starts today!' : `${daysUntil} days to go`}
          </div>
        )}
      </div>
    </Link>
  );
}
