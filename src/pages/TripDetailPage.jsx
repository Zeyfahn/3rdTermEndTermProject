import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Package, MapPin, Trash2, CalendarDays } from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import { useTrips } from '../hooks/useTrips';
import { FamilyMemberList, AddMemberForm } from '../components/family/FamilyMembers';
import TripSidebar from '../components/layout/TripSidebar';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { formatDate, getTripDuration } from '../utils/dateUtils';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, members, loading, totalSpent, remainingBudget, expenses, packingItems } = useTripContext();
  const { fetchTrip, addMember, removeMember, deleteTrip } = useTrips();

  useEffect(() => { fetchTrip(id); }, [id, fetchTrip]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    await deleteTrip(id);
    navigate('/dashboard');
  };

  if (loading) return (
    <div className="page-wrapper flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );

  if (!currentTrip) return (
    <div className="page-wrapper text-center py-20">
      <p className="text-slate-400">Trip not found.</p>
      <Link to="/dashboard" className="text-teal-400 text-sm mt-2 inline-block">← Back to Dashboard</Link>
    </div>
  );

  const duration = getTripDuration(currentTrip.startDate, currentTrip.endDate);
  const budgetPct = currentTrip.budgetLimit > 0 ? (totalSpent / currentTrip.budgetLimit) * 100 : 0;
  const packedPct = packingItems.length > 0 ? (packingItems.filter(i => i.packed).length / packingItems.length) * 100 : 0;

  return (
    <div className="page-wrapper">
      <div className="flex gap-8">
        <TripSidebar />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Trip header */}
          <div className="glass p-6"
            style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.12), rgba(6,182,212,0.06))' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{currentTrip.emoji || '✈️'}</span>
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">{currentTrip.name}</h1>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {currentTrip.destination}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(currentTrip.startDate)} → {formatDate(currentTrip.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {duration} day{duration !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete}>Delete</Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <Users className="w-4 h-4 text-teal-400 mb-1" />
              <p className="text-xl font-bold text-white">{members.length}</p>
              <p className="text-xs text-slate-400">Family Members</p>
            </div>
            <div className="stat-card">
              <CalendarDays className="w-4 h-4 text-violet-400 mb-1" />
              <p className="text-xl font-bold text-white">{duration}</p>
              <p className="text-xs text-slate-400">Days</p>
            </div>
            <div className="stat-card">
              <DollarSign className="w-4 h-4 text-amber-400 mb-1" />
              <p className="text-xl font-bold text-white">
                {currentTrip.currency || '₹'}{totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Spent</p>
            </div>
            <div className="stat-card">
              <Package className="w-4 h-4 text-emerald-400 mb-1" />
              <p className="text-xl font-bold text-white">
                {packingItems.filter(i => i.packed).length}/{packingItems.length}
              </p>
              <p className="text-xs text-slate-400">Items Packed</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: `/trips/${id}/itinerary`, icon: CalendarDays, label: 'Itinerary', desc: 'Day-by-day activities', color: 'from-violet-500 to-purple-400' },
              { to: `/trips/${id}/budget`, icon: DollarSign, label: 'Budget', desc: `${budgetPct.toFixed(0)}% used`, color: 'from-amber-500 to-orange-400' },
              { to: `/trips/${id}/packing`, icon: Package, label: 'Packing', desc: `${packedPct.toFixed(0)}% packed`, color: 'from-emerald-500 to-green-400' },
            ].map(({ to, icon: Icon, label, desc, color }) => (
              <Link key={to} to={to}
                className="glass p-4 flex items-center gap-3 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 group">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Budget preview */}
          {currentTrip.budgetLimit > 0 && (
            <div className="glass p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">Budget Overview</h3>
                <span className={`text-sm font-bold ${remainingBudget >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {remainingBudget >= 0 ? `${currentTrip.currency || '₹'}${remainingBudget.toLocaleString()} left` : 'Over budget!'}
                </span>
              </div>
              <ProgressBar
                value={totalSpent}
                max={currentTrip.budgetLimit}
                color={budgetPct > 90 ? 'red' : budgetPct > 70 ? 'amber' : 'teal'}
                showLabel={false}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>Spent: {currentTrip.currency || '₹'}{totalSpent.toLocaleString()}</span>
                <span>Budget: {currentTrip.currency || '₹'}{Number(currentTrip.budgetLimit).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Family members */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-4">
              Family Members
              <span className="ml-2 text-xs text-slate-500">({members.length})</span>
            </h3>
            {members.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-2 mb-4">
                <FamilyMemberList members={members} onRemove={(mid) => removeMember(id, mid)} />
              </div>
            )}
            <div className="divider" />
            <AddMemberForm onAdd={(data) => addMember(id, data)} />
          </div>
        </main>
      </div>
    </div>
  );
}
