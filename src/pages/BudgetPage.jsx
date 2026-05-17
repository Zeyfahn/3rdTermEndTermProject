import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, Users } from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import { useTrips } from '../hooks/useTrips';
import TripSidebar from '../components/layout/TripSidebar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { formatDate } from '../utils/dateUtils';
import { clsx } from 'clsx';

const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Dining', emoji: '🍽️', color: 'amber' },
  { value: 'transport', label: 'Transport', emoji: '🚗', color: 'blue' },
  { value: 'accommodation', label: 'Stay', emoji: '🏨', color: 'purple' },
  { value: 'activities', label: 'Activities', emoji: '🎯', color: 'emerald' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️', color: 'pink' },
  { value: 'medical', label: 'Medical', emoji: '💊', color: 'red' },
  { value: 'other', label: 'Other', emoji: '💰', color: 'slate' },
];

const colorMap = {
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  slate: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function BudgetPage() {
  const { id } = useParams();
  const { currentTrip, expenses, members, loading, totalSpent, remainingBudget } = useTripContext();
  const { fetchTrip, addExpense, deleteExpense } = useTrips();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], paidBy: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchTrip(id); }, [id, fetchTrip]);

  const currency = currentTrip?.currency || '₹';
  const budgetLimit = Number(currentTrip?.budgetLimit) || 0;
  const budgetPct = budgetLimit > 0 ? Math.min((totalSpent / budgetLimit) * 100, 100) : 0;

  const byCategory = useMemo(() => {
    const map = {};
    EXPENSE_CATEGORIES.forEach((c) => { map[c.value] = 0; });
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return map;
  }, [expenses]);

  const perPerson = useMemo(() => {
    if (!members.length) return totalSpent;
    return totalSpent / members.length;
  }, [totalSpent, members]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    setSubmitting(true);
    try {
      await addExpense(id, { ...form, amount: Number(form.amount) });
      setForm({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], paidBy: '' });
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !currentTrip) return (
    <div className="page-wrapper flex justify-center py-20"><Spinner size="lg" /></div>
  );

  return (
    <div className="page-wrapper">
      <div className="flex gap-8">
        <TripSidebar />
        <main className="flex-1 min-w-0 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Budget Tracker</h2>
              <p className="text-slate-400 text-sm mt-0.5">{expenses.length} expenses · {currency}{totalSpent.toLocaleString()} spent</p>
            </div>
            <Button icon={Plus} onClick={() => setShowModal(true)}>Add Expense</Button>
          </div>

          {/* Budget overview */}
          <div className="glass p-5 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Budget</p>
                <p className="text-xl font-display font-bold text-white">{currency}{budgetLimit.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Spent</p>
                <p className="text-xl font-display font-bold text-amber-400">{currency}{totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Remaining</p>
                <p className={clsx('text-xl font-display font-bold', remainingBudget >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {currency}{Math.abs(remainingBudget).toLocaleString()}
                  {remainingBudget < 0 && <span className="text-sm"> over</span>}
                </p>
              </div>
            </div>
            {budgetLimit > 0 && (
              <ProgressBar value={totalSpent} max={budgetLimit} color={budgetPct > 90 ? 'red' : budgetPct > 70 ? 'amber' : 'teal'} showLabel={false} />
            )}
            {members.length > 1 && totalSpent > 0 && (
              <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-xl px-4 py-2.5">
                <Users className="w-4 h-4 text-teal-400 shrink-0" />
                <p className="text-sm text-teal-400">
                  Per person ({members.length} members):{' '}
                  <strong>{currency}{perPerson.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Category breakdown */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-4 text-sm">By Category</h3>
            {expenses.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-4">No expenses yet</p>
            ) : (
              <div className="space-y-3">
                {EXPENSE_CATEGORIES.filter((c) => byCategory[c.value] > 0).map((c) => (
                  <div key={c.value}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300">{c.emoji} {c.label}</span>
                      <span className="text-xs text-slate-400">{currency}{byCategory[c.value].toLocaleString()}</span>
                    </div>
                    <ProgressBar value={byCategory[c.value]} max={totalSpent || 1} color={c.color} showLabel={false} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expense list */}
          <div className="glass p-5">
            <h3 className="font-semibold text-white mb-4 text-sm">All Expenses</h3>
            {expenses.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                <p className="text-3xl mb-2">💰</p>
                <p>No expenses recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {expenses.map((exp) => {
                  const cat = EXPENSE_CATEGORIES.find((c) => c.value === exp.category) || EXPENSE_CATEGORIES[6];
                  return (
                    <div key={exp.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.08] group transition-all">
                      <span className="text-xl shrink-0">{cat.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{exp.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                          <span className={clsx('px-1.5 py-0.5 rounded border', colorMap[cat.color])}>{cat.label}</span>
                          {exp.paidBy && <span>by {exp.paidBy}</span>}
                          <span>{formatDate(exp.date)}</span>
                        </div>
                      </div>
                      <p className="font-bold text-white shrink-0">{currency}{Number(exp.amount).toLocaleString()}</p>
                      <button onClick={() => deleteExpense(id, exp.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Expense">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Title *</label>
            <input className="input-field" placeholder="e.g. Dinner at Fisherman's Wharf"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Amount ({currency}) *</label>
              <input type="number" min="0" step="0.01" className="input-field" placeholder="0.00"
                value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div>
              <label className="input-label">Date</label>
              <input type="date" className="input-field" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="input-label">Category</label>
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map((c) => (
                <button key={c.value} type="button"
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    form.category === c.value ? colorMap[c.color] : 'bg-white/5 border-white/10 text-slate-400')}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="input-label">Paid By</label>
            <select className="select-field" value={form.paidBy} onChange={(e) => setForm({ ...form, paidBy: e.target.value })}>
              <option value="">Select member (optional)</option>
              {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={submitting} className="flex-1">Add Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
