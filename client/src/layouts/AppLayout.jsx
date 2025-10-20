import { NavLink } from 'react-router-dom';

const navigation = [
  { to: '/', label: 'Dashboard' },
  { to: '/pets', label: 'My Pets' },
  { to: '/bookings/new', label: 'New Booking' },
];

const adminNavigation = [
  { to: '/admin', label: 'Capacity' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/roster', label: 'Roster' },
];

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <header className="bg-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-2xl font-semibold text-primary">Kennel Portal</span>
        <nav className="flex gap-4 text-sm font-medium text-slate-600">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded px-3 py-1 transition hover:bg-primary/10 ${
                  isActive ? 'text-primary' : 'text-slate-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>

    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        {children}
      </section>
      <aside>
        <h2 className="mb-2 text-lg font-semibold text-slate-700">Admin Quick Links</h2>
        <div className="flex flex-wrap gap-2">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full border border-primary px-4 py-1 text-sm transition hover:bg-primary hover:text-white ${
                  isActive ? 'bg-primary text-white' : 'text-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>
    </main>
  </div>
);

export default AppLayout;
