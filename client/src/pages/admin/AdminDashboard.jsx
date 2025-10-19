import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import httpClient from '../../api/httpClient.js';

const defaultRange = {
  start: dayjs().format('YYYY-MM-DD'),
  end: dayjs().add(7, 'day').format('YYYY-MM-DD'),
};

const AdminDashboard = () => {
  const [range, setRange] = useState(defaultRange);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.get('/kennels/availability', {
        params: {
          checkIn: range.start,
          checkOut: range.end,
          petCount: 1,
        },
      });
      setAvailability(data.kennels);
    } catch (error) {
      console.error('Failed to load capacity', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Admin Capacity Overview</h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor kennel utilization and remaining capacity over the selected date range.
          </p>
        </div>
        <form
          className="flex items-center gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            loadAvailability();
          }}
        >
          <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
            Start
            <input
              type="date"
              value={range.start}
              onChange={(event) => setRange({ ...range, start: event.target.value })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
            End
            <input
              type="date"
              value={range.end}
              onChange={(event) => setRange({ ...range, end: event.target.value })}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <button type="submit" className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white">
            Refresh
          </button>
        </form>
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Loading capacity...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {availability.map((kennel) => (
            <article key={kennel.kennelId} className="rounded border border-slate-200 p-4 shadow-sm">
              <header className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">{kennel.type}</h2>
                <span className="text-sm font-semibold text-primary">${kennel.pricePerNight}/night</span>
              </header>
              <dl className="grid grid-cols-3 gap-4 text-sm text-slate-500">
                <div>
                  <dt className="font-semibold text-slate-600">Total</dt>
                  <dd>{kennel.maxCapacity}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-600">Booked</dt>
                  <dd>{kennel.bookedUnits}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-600">Available</dt>
                  <dd>{kennel.availableUnits}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
