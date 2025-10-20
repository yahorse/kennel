import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import httpClient from '../../api/httpClient.js';

const PetRoster = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoster = async () => {
      setLoading(true);
      try {
        const { data } = await httpClient.get('/bookings/current');
        setBookings(data);
      } catch (error) {
        console.error('Failed to load roster', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoster();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Current Pet Roster</h1>
        <p className="mt-2 text-sm text-slate-500">
          Pets currently checked in and their care instructions.
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Loading roster...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <article key={booking._id} className="rounded border border-slate-200 p-4 shadow-sm">
              <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{booking.kennelType?.type}</h2>
                  <p className="text-sm text-slate-500">
                    Stay: {dayjs(booking.checkInDate).format('MMM D')} → {dayjs(booking.checkOutDate).format('MMM D, YYYY')}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {booking.client?.name || 'Client'}
                </span>
              </header>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {booking.pets?.map((pet) => (
                  <section key={pet._id} className="rounded border border-slate-200 p-3 text-sm">
                    <h3 className="text-base font-semibold text-slate-700">{pet.name}</h3>
                    <p className="text-slate-500">Breed: {pet.breed || 'Unknown'}</p>
                    <p className="text-slate-500">Weight: {pet.weight_kg ? `${pet.weight_kg} kg` : 'N/A'}</p>
                    <div className="mt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Feeding</h4>
                      <p className="text-slate-600">{pet.feedingInstructions || 'No instructions provided.'}</p>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medication</h4>
                      <p className="text-slate-600">{pet.medicationInstructions || 'None'}</p>
                    </div>
                  </section>
                ))}
              </div>
            </article>
          ))}
          {bookings.length === 0 && <p className="text-sm text-slate-500">No pets currently checked in.</p>}
        </div>
      )}
    </div>
  );
};

export default PetRoster;
