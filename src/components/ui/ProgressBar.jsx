export default function ProgressBar({ value, max, color = 'teal', showLabel = true, className = '' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const colors = {
    teal: 'from-teal-500 to-cyan-400',
    amber: 'from-amber-500 to-orange-400',
    red: 'from-red-500 to-rose-400',
    emerald: 'from-emerald-500 to-green-400',
    purple: 'from-purple-500 to-violet-400',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400">{pct.toFixed(0)}%</span>
          <span className="text-xs text-slate-400">{value.toLocaleString()} / {max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
