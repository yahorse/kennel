import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import httpClient from '../api/httpClient.js';

const ClientDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const { data } = await httpClient.get('/bookings');
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const upcoming = bookings.filter((booking) => dayjs(booking.checkInDate).isAfter(dayjs()));
  const past = bookings.filter((booking) => dayjs(booking.checkInDate).isBefore(dayjs()));

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Welcome back!</h1>
        <p className="mt-2 text-sm text-slate-500">Track your upcoming reservations and review past visits.</p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Loading bookings...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-slate-700">Upcoming Bookings</h2>
            <div className="mt-3 flex flex-col gap-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming bookings yet.</p>
              ) : (
                upcoming.map((booking) => (
                  <article key={booking._id} className="rounded border border-slate-200 p-4 text-sm">
                    <h3 className="text-base font-semibold text-slate-700">{booking.kennelType?.type}</h3>
                    <p className="text-slate-500">
                      {dayjs(booking.checkInDate).format('MMM D')} → {dayjs(booking.checkOutDate).format('MMM D, YYYY')}
                    </p>
                    <p className="text-slate-500">Pets: {booking.pets?.length ?? 0}</p>
                    <span className="mt-2 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {booking.status}
                    </span>
                  </article>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-700">Past Bookings</h2>
            <div className="mt-3 flex flex-col gap-3">
              {past.length === 0 ? (
                <p className="text-sm text-slate-500">No past bookings yet.</p>
              ) : (
                past.map((booking) => (
                  <article key={booking._id} className="rounded border border-slate-200 p-4 text-sm">
                    <h3 className="text-base font-semibold text-slate-700">{booking.kennelType?.type}</h3>
                    <p className="text-slate-500">
                      {dayjs(booking.checkInDate).format('MMM D')} → {dayjs(booking.checkOutDate).format('MMM D, YYYY')}
                    </p>
                    <p className="text-slate-500">Pets: {booking.pets?.length ?? 0}</p>
                    <span className="mt-2 inline-flex w-fit items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {booking.status}
                    </span>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
