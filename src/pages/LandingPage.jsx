import { Link } from 'react-router-dom';
import { Plane, CalendarDays, DollarSign, Package, Users, ArrowRight, Star, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Family-First Planning',
    description: 'Add every family member — adults, kids, seniors — and plan around everyone\'s needs.',
    color: 'from-teal-500 to-cyan-400',
  },
  {
    icon: CalendarDays,
    title: 'Day-by-Day Itinerary',
    description: 'Build your trip schedule with activities tagged for kids, seniors, and the whole family.',
    color: 'from-violet-500 to-purple-400',
  },
  {
    icon: DollarSign,
    title: 'Smart Budget Tracker',
    description: 'Track every expense and automatically calculate the per-person cost split.',
    color: 'from-amber-500 to-orange-400',
  },
  {
    icon: Package,
    title: 'Per-Member Packing',
    description: 'Assign packing items to specific family members. Never forget the essentials again.',
    color: 'from-emerald-500 to-green-400',
  },
];

const stats = [
  { value: '10k+', label: 'Trips Planned' },
  { value: '50k+', label: 'Family Members' },
  { value: '₹2Cr+', label: 'Budgets Tracked' },
  { value: '4.9★', label: 'Rating' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-slow"
            style={{ background: 'radial-gradient(circle, #14B8A6, transparent)' }} />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse-slow animation-delay-500"
            style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl animate-float"
            style={{ background: 'radial-gradient(circle, #F59E0B, transparent)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            Smart Family Travel Planning
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-6 animate-slide-up">
            Plan your family trip
            <br />
            <span className="gradient-text">without the chaos</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up animation-delay-100">
            One organized space for your itinerary, budget, and packing lists —
            tailored for every family member from toddlers to grandparents.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-200">
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
              Start planning for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
              Sign in
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 animate-slide-up animation-delay-300">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold gradient-text">{value}</div>
                <div className="text-sm text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Everything your family needs
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Built for families of all sizes — couples, families with kids, multi-generational trips.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="glass p-6 group hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-24 text-center">
        <div className="glass p-10"
          style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.12), rgba(139,92,246,0.08))' }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-3">
            Ready to travel smarter?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of families who plan stress-free trips with WanderFamily.
          </p>
          <Link to="/signup" className="btn-primary text-base px-10 py-3.5 inline-flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Plan your first trip
          </Link>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500">
            <Shield className="w-4 h-4" />
            Free forever · No credit card required
          </div>
        </div>
      </section>
    </div>
  );
}
