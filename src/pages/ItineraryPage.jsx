import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Clock, MapPin, Trash2, Baby, PersonStanding, ChevronDown, ChevronUp } from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import { useTrips } from '../hooks/useTrips';
import TripSidebar from '../components/layout/TripSidebar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { generateDayLabels } from '../utils/dateUtils';
import { clsx } from 'clsx';

const CATEGORIES = [
  { value: 'sightseeing', label: 'Sightseeing', emoji: '🗺️', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { value: 'food', label: 'Food', emoji: '🍽️', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'transport', label: 'Transport', emoji: '🚗', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'hotel', label: 'Hotel', emoji: '🏨', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'activity', label: 'Activity', emoji: '🎯', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
];

function ActivityCard({ activity, onDelete, currency }) {
  const cat = CATEGORIES.find((c) => c.value === activity.category) || CATEGORIES[0];
  return (
    <div className="glass p-4 group hover:border-white/20 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-xl shrink-0 mt-0.5">{cat.emoji}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-white text-sm">{activity.title}</h4>
              <span className={clsx('text-xs px-2 py-0.5 rounded-full border', cat.color)}>{cat.label}</span>
              {activity.kidFriendly && (
                <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-500/20 text-yellow-400 border-yellow-500/30 flex items-center gap-1">
                  <Baby className="w-3 h-3" /> Kids
                </span>
              )}
              {activity.seniorFriendly && (
                <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-400 border-purple-500/30 flex items-center gap-1">
                  <PersonStanding className="w-3 h-3" /> Senior
                </span>
              )}
            </div>
            {activity.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{activity.description}</p>
            )}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              {activity.time && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activity.time}</span>
              )}
              {activity.location && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{activity.location}</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(activity.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  const { id } = useParams();
  const { currentTrip, itinerary, loading } = useTripContext();
  const { fetchTrip, addActivity, deleteActivity } = useTrips();
  const [showModal, setShowModal] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [form, setForm] = useState({ title: '', time: '', location: '', description: '', category: 'sightseeing', kidFriendly: false, seniorFriendly: false, day: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState({});

  useEffect(() => { fetchTrip(id); }, [id, fetchTrip]);

  const duration = currentTrip ? Math.max(1, (new Date(currentTrip.endDate) - new Date(currentTrip.startDate)) / 86400000 + 1) : 7;
  const dayLabels = useMemo(() => generateDayLabels(currentTrip?.startDate, duration), [currentTrip, duration]);

  const activitiesByDay = useMemo(() => {
    const map = {};
    for (let d = 1; d <= duration; d++) map[d] = [];
    itinerary.forEach((a) => { if (map[a.day]) map[a.day].push(a); });
    // Sort each day's activities by time string ascending
    Object.keys(map).forEach((d) => {
      map[d].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    });
    return map;
  }, [itinerary, duration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await addActivity(id, { ...form, day: activeDay });
      setForm({ title: '', time: '', location: '', description: '', category: 'sightseeing', kidFriendly: false, seniorFriendly: false, day: activeDay });
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDay = (day) => setCollapsedDays((prev) => ({ ...prev, [day]: !prev[day] }));

  if (loading && !currentTrip) return (
    <div className="page-wrapper flex justify-center py-20"><Spinner size="lg" /></div>
  );

  return (
    <div className="page-wrapper">
      <div className="flex gap-8">
        <TripSidebar />
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Itinerary</h2>
              <p className="text-slate-400 text-sm mt-0.5">{duration}-day trip · {itinerary.length} activities</p>
            </div>
            <Button icon={Plus} onClick={() => setShowModal(true)}>Add Activity</Button>
          </div>

          {/* Day tabs (mobile) */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {dayLabels.map(({ day, label }) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={clsx(
                  'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  activeDay === day ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'bg-white/5 text-slate-400 border-white/10'
                )}
              >
                Day {day}
              </button>
            ))}
          </div>

          {/* Days */}
          <div className="space-y-4">
            {dayLabels.map(({ day, label }) => {
              const acts = activitiesByDay[day] || [];
              const collapsed = collapsedDays[day];
              return (
                <div key={day} className="glass overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
                    onClick={() => toggleDay(day)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                        {day}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">Day {day}</p>
                        <p className="text-xs text-slate-400">{label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{acts.length} activities</span>
                      {collapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {!collapsed && (
                    <div className="px-5 pb-4 space-y-2 border-t border-white/5">
                      {acts.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 text-sm">
                          No activities yet —{' '}
                          <button
                            onClick={() => { setActiveDay(day); setShowModal(true); }}
                            className="text-teal-400 hover:text-teal-300 underline"
                          >
                            add one
                          </button>
                        </div>
                      ) : (
                        acts.map((a) => (
                          <ActivityCard key={a.id} activity={a} onDelete={(aid) => deleteActivity(id, aid)} />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Add Activity Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Activity" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Day</label>
              <select className="select-field" value={activeDay} onChange={(e) => setActiveDay(Number(e.target.value))}>
                {dayLabels.map(({ day, label }) => (
                  <option key={day} value={day}>Day {day} — {label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Time</label>
              <input type="time" className="input-field" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="input-label">Activity Title *</label>
            <input className="input-field" placeholder="e.g. Visit Calangute Beach" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="input-label">Location</label>
            <input className="input-field" placeholder="e.g. North Goa" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="input-label">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.value} type="button"
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', form.category === c.value ? c.color : 'bg-white/5 border-white/10 text-slate-400')}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="input-label">Notes</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Additional notes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" className="accent-teal-500 w-4 h-4" checked={form.kidFriendly} onChange={(e) => setForm({ ...form, kidFriendly: e.target.checked })} />
              <Baby className="w-3.5 h-3.5 text-yellow-400" /> Kid-friendly
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" className="accent-teal-500 w-4 h-4" checked={form.seniorFriendly} onChange={(e) => setForm({ ...form, seniorFriendly: e.target.checked })} />
              <PersonStanding className="w-3.5 h-3.5 text-purple-400" /> Senior-friendly
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={submitting} className="flex-1">Add Activity</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
