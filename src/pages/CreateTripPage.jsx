import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useTrips } from '../hooks/useTrips';
import { AddMemberForm, FamilyMemberList } from '../components/family/FamilyMembers';
import Button from '../components/ui/Button';

const EMOJIS = ['✈️', '🏖️', '🏔️', '🏕️', '🌍', '🗺️', '🚂', '🚢', '🏯', '🌴', '🎡', '🌋'];

const STEPS = [
  { label: 'Basics', icon: MapPin },
  { label: 'Family', icon: Users },
  { label: 'Budget', icon: DollarSign },
];

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { createTrip, addMember, actionLoading } = useTrips();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', destination: '', startDate: '', endDate: '', emoji: '✈️',
  });
  const [members, setMembers] = useState([]);
  const [budget, setBudget] = useState({ limit: '', currency: 'INR' });
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleAddMember = async (memberData) => {
    setMembers([...members, { id: Date.now().toString(), ...memberData }]);
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) return 'Trip name is required.';
      if (!form.destination.trim()) return 'Destination is required.';
      if (!form.startDate || !form.endDate) return 'Please set start and end dates.';
      if (form.startDate > form.endDate) return 'End date must be after start date.';
    }
    return '';
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const tripData = {
        ...form,
        budgetLimit: Number(budget.limit) || 0,
        currency: budget.currency,
        familySize: members.length || 1,
      };
      const tripId = await createTrip(tripData);
      // Add members — strip the temporary local id before writing to Firestore
      for (const member of members) {
        const { id: _tempId, ...memberFields } = member;
        await addMember(tripId, memberFields);
      }
      navigate(`/trips/${tripId}`);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="page-wrapper max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-1">Plan a new trip</h1>
        <p className="text-slate-400 text-sm">Fill in the details to get started</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              i === step ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
              : i < step ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-slate-500 border border-white/10'
            }`}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              {label}
            </div>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="glass p-6 space-y-5">
        {/* Step 0: Basics */}
        {step === 0 && (
          <>
            <div>
              <label className="input-label">Trip Name</label>
              <input className="input-field" placeholder="e.g. Summer Goa Trip 2025" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="input-label">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input className="input-field pl-10" placeholder="e.g. Goa, India" value={form.destination} onChange={set('destination')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Start Date</label>
                <input type="date" className="input-field" value={form.startDate} onChange={set('startDate')} />
              </div>
              <div>
                <label className="input-label">End Date</label>
                <input type="date" className="input-field" value={form.endDate} onChange={set('endDate')} />
              </div>
            </div>
            <div>
              <label className="input-label">Trip Emoji</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setForm({ ...form, emoji })}
                    className={`w-10 h-10 rounded-xl text-xl transition-all border ${
                      form.emoji === emoji
                        ? 'bg-teal-500/20 border-teal-500/40 scale-110'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 1: Family */}
        {step === 1 && (
          <>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-white font-semibold">Family Members</h3>
                <p className="text-slate-400 text-sm">Add everyone joining this trip</p>
              </div>
              <span className="badge-upcoming">{members.length} member{members.length !== 1 ? 's' : ''}</span>
            </div>
            {members.length > 0 && (
              <div className="space-y-2 mb-4">
                <FamilyMemberList members={members} onRemove={handleRemoveMember} />
              </div>
            )}
            <div className="divider" />
            <AddMemberForm onAdd={handleAddMember} />
          </>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <>
            <div>
              <h3 className="text-white font-semibold mb-1">Budget Settings</h3>
              <p className="text-slate-400 text-sm mb-4">Set a total budget for the trip (optional)</p>
            </div>
            <div>
              <label className="input-label">Currency</label>
              <select className="select-field" value={budget.currency} onChange={(e) => setBudget({ ...budget, currency: e.target.value })}>
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="USD">$ US Dollar (USD)</option>
                <option value="EUR">€ Euro (EUR)</option>
                <option value="GBP">£ British Pound (GBP)</option>
                <option value="AED">د.إ UAE Dirham (AED)</option>
                <option value="SGD">S$ Singapore Dollar (SGD)</option>
              </select>
            </div>
            <div>
              <label className="input-label">Total Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  className="input-field pl-10"
                  placeholder="e.g. 50000"
                  min="0"
                  value={budget.limit}
                  onChange={(e) => setBudget({ ...budget, limit: e.target.value })}
                />
              </div>
            </div>
            {members.length > 0 && budget.limit && (
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-3 text-sm text-teal-400">
                ≈ {budget.currency} {Math.round(Number(budget.limit) / members.length).toLocaleString()} per person
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="ghost"
          onClick={() => step === 0 ? navigate('/dashboard') : setStep(step - 1)}
          icon={ArrowLeft}
        >
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>

        {step < 2 ? (
          <Button onClick={nextStep} icon={ArrowRight}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={actionLoading} icon={Check}>
            Create Trip
          </Button>
        )}
      </div>
    </div>
  );
}
