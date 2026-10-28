import { Network, BookOpen, Database } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Simulator', icon: Network },
  { to: '/saved', label: 'Saved Networks', icon: Database },
  { to: '/help', label: 'Viva Help', icon: BookOpen },
];

export default function AppShell({ apiStatus }) {
  return (
    <div className="flex h-full min-h-screen bg-navy-950 text-slate-100">
      <aside className="flex w-60 shrink-0 flex-col border-r border-cyan-400/15 bg-navy-900">
        <div className="border-b border-cyan-400/15 px-5 py-5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">College Mini Project</p>
          <h1 className="mt-1 text-lg font-semibold leading-tight text-white">Network Routing Simulator</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  isActive ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-cyan-400/15 px-4 py-3 text-xs text-slate-400">
          API:{' '}
          <span className={apiStatus === 'ok' ? 'text-emerald-400' : apiStatus === 'down' ? 'text-rose-400' : 'text-amber-300'}>
            {apiStatus === 'ok' ? 'connected' : apiStatus === 'down' ? 'offline' : 'checking'}
          </span>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
