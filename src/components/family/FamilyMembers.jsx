import { useState } from 'react';
import { User, Baby, PersonStanding, Trash2, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../ui/Button';

const roleConfig = {
  adult: { label: 'Adult', icon: User, color: 'text-teal-400', bg: 'bg-teal-500/20 border-teal-500/30' },
  child: { label: 'Child', icon: Baby, color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
  senior: { label: 'Senior', icon: PersonStanding, color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' },
};

function MemberBadge({ member, onRemove, readOnly }) {
  const cfg = roleConfig[member.role] || roleConfig.adult;
  const Icon = cfg.icon;
  return (
    <div className={clsx('flex items-center gap-2.5 px-3 py-2 rounded-xl border', cfg.bg)}>
      <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center bg-white/10')}>
        <Icon className={clsx('w-4 h-4', cfg.color)} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate">{member.name}</p>
        <p className={clsx('text-xs', cfg.color)}>
          {cfg.label}{member.age ? `, ${member.age} yrs` : ''}
        </p>
      </div>
      {!readOnly && (
        <button onClick={() => onRemove(member.id)} className="ml-auto text-slate-500 hover:text-red-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function FamilyMemberList({ members, onRemove, readOnly = false }) {
  return (
    <div className="space-y-2">
      {members.map((m) => (
        <MemberBadge key={m.id} member={m} onRemove={onRemove} readOnly={readOnly} />
      ))}
    </div>
  );
}

export function AddMemberForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', age: '', role: 'adult' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await onAdd({ name: form.name.trim(), age: form.age || '', role: form.role });
      setForm({ name: '', age: '', role: 'adult' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <input
            className="input-field"
            placeholder="Member name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <input
          className="input-field"
          placeholder="Age"
          type="number"
          min="0"
          max="120"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        {['adult', 'child', 'senior'].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setForm({ ...form, role })}
            className={clsx(
              'flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all',
              form.role === role
                ? roleConfig[role].bg + ' ' + roleConfig[role].color
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            )}
          >
            {role}
          </button>
        ))}
      </div>
      <Button type="submit" variant="secondary" size="sm" loading={loading} icon={Plus} className="w-full">
        Add Member
      </Button>
    </form>
  );
}
