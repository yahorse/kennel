import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import httpClient from '../../api/httpClient.js';

const statusOptions = ['Pending', 'Confirmed', 'Cancelled'];

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('Pending');
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.get('/bookings', {
        params: filter ? { status: filter } : {},
      });
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await httpClient.put(`/bookings/${id}/status`, { status });
      loadBookings();
    } catch (error) {
      console.error('Failed to update booking status', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Booking Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review pending requests and confirm or cancel as needed.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label className="font-semibold text-slate-600">Filter by status:</label>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2"
          >
            <option value="">All</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Loading bookings...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Pets</th>
                <th className="px-4 py-3">Kennel</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-4 py-3 font-medium text-slate-700">{booking.client?.name || 'Client'}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {dayjs(booking.checkInDate).format('MMM D')} → {dayjs(booking.checkOutDate).format('MMM D, YYYY')}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{booking.pets?.length ?? 0}</td>
                  <td className="px-4 py-3 text-slate-500">{booking.kennelType?.type}</td>
                  <td className="px-4 py-3 font-semibold text-primary">${booking.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(booking._id, 'Confirmed')}
                        className="rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(booking._id, 'Cancelled')}
                        className="rounded bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                    No bookings found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
