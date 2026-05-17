import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, Check, Users } from 'lucide-react';
import { useTripContext } from '../context/TripContext';
import { useTrips } from '../hooks/useTrips';
import TripSidebar from '../components/layout/TripSidebar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { clsx } from 'clsx';

const PACKING_CATEGORIES = [
  { value: 'clothing', label: 'Clothing', emoji: '👕' },
  { value: 'electronics', label: 'Electronics', emoji: '📱' },
  { value: 'documents', label: 'Documents', emoji: '📄' },
  { value: 'toiletries', label: 'Toiletries', emoji: '🧴' },
  { value: 'kids', label: 'Kids', emoji: '🧸' },
  { value: 'medical', label: 'Medical', emoji: '💊' },
  { value: 'snacks', label: 'Snacks', emoji: '🍫' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

export default function PackingPage() {
  const { id } = useParams();
  const { currentTrip, members, packingItems, loading } = useTripContext();
  const { fetchTrip, addPackingItem, togglePackingItem, deletePackingItem } = useTrips();
  const [showModal, setShowModal] = useState(false);
  const [memberFilter, setMemberFilter] = useState('all');
  const [form, setForm] = useState({ name: '', category: 'clothing', assignedTo: '', quantity: 1 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchTrip(id); }, [id, fetchTrip]);

  const filtered = useMemo(() => {
    if (memberFilter === 'all') return packingItems;
    if (memberFilter === 'unassigned') return packingItems.filter((i) => !i.assignedTo);
    return packingItems.filter((i) => i.assignedTo === memberFilter);
  }, [packingItems, memberFilter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((item) => {
      const cat = item.category || 'other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return map;
  }, [filtered]);

  const packedCount = packingItems.filter((i) => i.packed).length;
  const totalCount = packingItems.length;
  const pct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      await addPackingItem(id, { ...form, quantity: Number(form.quantity) || 1 });
      setForm({ name: '', category: 'clothing', assignedTo: '', quantity: 1 });
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const clearPacked = () => {
    packingItems.filter((i) => i.packed).forEach((i) => deletePackingItem(id, i.id));
  };

  if (loading && !currentTrip) return (
    <div className="page-wrapper flex justify-center py-20"><Spinner size="lg" /></div>
  );

  return (
    <div className="page-wrapper">
      <div className="flex gap-8">
        <TripSidebar />
        <main className="flex-1 min-w-0 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Packing List</h2>
              <p className="text-slate-400 text-sm mt-0.5">{packedCount}/{totalCount} items packed</p>
            </div>
            <div className="flex gap-2">
              {packedCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearPacked}>Clear packed</Button>
              )}
              <Button icon={Plus} onClick={() => setShowModal(true)}>Add Item</Button>
            </div>
          </div>

          {/* Progress ring summary */}
          <div className="glass p-5 flex items-center gap-6">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="url(#prog)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">{pct}%</span>
            </div>
            <div>
              <p className="text-lg font-display font-bold text-white">{packedCount} of {totalCount} packed</p>
              <p className="text-sm text-slate-400">{totalCount - packedCount} items remaining</p>
              {pct === 100 && totalCount > 0 && (
                <p className="text-teal-400 text-sm font-medium mt-1">🎉 All packed! Ready to go!</p>
              )}
            </div>
          </div>

          {/* Member filter */}
          {members.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {[{ id: 'all', name: 'All Items' }, { id: 'unassigned', name: 'Unassigned' }, ...members].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMemberFilter(m.id === 'all' ? 'all' : m.id === 'unassigned' ? 'unassigned' : m.name)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    (memberFilter === m.id || memberFilter === m.name)
                      ? 'bg-teal-500/20 text-teal-400 border-teal-500/30'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  )}
                >
                  {m.name === 'All Items' ? '👜 All' : m.name === 'Unassigned' ? '📦 Unassigned' : `👤 ${m.name}`}
                </button>
              ))}
            </div>
          )}

          {/* Items by category */}
          {Object.keys(grouped).length === 0 ? (
            <div className="glass text-center py-16">
              <p className="text-4xl mb-3">🧳</p>
              <h3 className="text-white font-semibold mb-1">No items yet</h3>
              <p className="text-slate-400 text-sm">Start adding items to your packing list</p>
            </div>
          ) : (
            Object.entries(grouped).map(([catKey, items]) => {
              const cat = PACKING_CATEGORIES.find((c) => c.value === catKey) || PACKING_CATEGORIES[7];
              const packedInCat = items.filter((i) => i.packed).length;
              return (
                <div key={catKey} className="glass overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      {cat.emoji} {cat.label}
                    </span>
                    <span className="text-xs text-slate-400">{packedInCat}/{items.length}</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {items.map((item) => (
                      <div key={item.id}
                        className={clsx('flex items-center gap-3 px-5 py-3 group transition-all', item.packed && 'opacity-60')}
                      >
                        <button
                          onClick={() => togglePackingItem(id, item)}
                          className={clsx(
                            'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                            item.packed
                              ? 'bg-teal-500 border-teal-500'
                              : 'border-slate-600 hover:border-teal-500'
                          )}
                        >
                          {item.packed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={clsx('text-sm text-white', item.packed && 'line-through')}>{item.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {item.quantity > 1 && <span>×{item.quantity}</span>}
                            {item.assignedTo && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />{item.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deletePackingItem(id, item.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Packing Item">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Item Name *</label>
            <input className="input-field" placeholder="e.g. Sunscreen SPF 50" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Quantity</label>
              <input type="number" min="1" className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Assign To</label>
              <select className="select-field" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Everyone</option>
                {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="input-label">Category</label>
            <div className="flex flex-wrap gap-2">
              {PACKING_CATEGORIES.map((c) => (
                <button key={c.value} type="button"
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    form.category === c.value ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'bg-white/5 border-white/10 text-slate-400')}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={submitting} className="flex-1">Add Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
