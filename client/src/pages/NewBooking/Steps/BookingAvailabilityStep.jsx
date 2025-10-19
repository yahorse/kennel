import { useEffect, useState } from 'react';

import httpClient from '../../../api/httpClient.js';

const BookingAvailabilityStep = ({ dispatch, state }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!state.checkInDate || !state.checkOutDate || state.selectedPets.length === 0) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data } = await httpClient.get('/kennels/availability', {
          params: {
            checkIn: state.checkInDate,
            checkOut: state.checkOutDate,
            petCount: state.selectedPets.length,
          },
        });
        dispatch({ type: 'SET_AVAILABILITY', payload: data.kennels });
      } catch (err) {
        console.error(err);
        setError('Unable to load availability. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [dispatch, state.checkInDate, state.checkOutDate, state.selectedPets.length]);

  if (loading) {
    return <p className="text-sm text-slate-500">Checking availability...</p>;
  }

  if (error) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Available Kennel Types</h2>
          <p className="text-sm text-slate-500">
            Select a kennel to continue. Showing options for {state.selectedPets.length} pets from
            {` ${state.checkInDate} `}to {state.checkOutDate}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
          className="text-sm text-primary underline"
        >
          Modify dates/pets
        </button>
      </header>

      {state.availability.length === 0 ? (
        <p className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-700">
          No kennels are available for the selected dates and number of pets. Try adjusting your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {state.availability.map((kennel) => (
            <article
              key={kennel.kennelId}
              className={`rounded border p-4 shadow-sm transition ${
                state.selectedKennel?.kennelId === kennel.kennelId ? 'border-primary' : 'border-slate-200'
              } ${kennel.canAccommodate ? 'bg-white' : 'bg-slate-100 opacity-75'}`}
            >
              <header className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">{kennel.type}</h3>
                <span className="text-sm font-medium text-primary">${kennel.pricePerNight} / night</span>
              </header>
              <dl className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>
                  <dt className="font-semibold text-slate-600">Capacity</dt>
                  <dd>
                    {kennel.bookedUnits} booked / {kennel.maxCapacity} total
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-600">Available Units</dt>
                  <dd>{kennel.availableUnits}</dd>
                </div>
              </dl>
              <button
                type="button"
                disabled={!kennel.canAccommodate}
                onClick={() => {
                  dispatch({ type: 'SET_KENNEL', payload: { kennel, quote: null } });
                  dispatch({ type: 'SET_STEP', payload: 3 });
                }}
                className={`mt-4 w-full rounded px-4 py-2 text-sm font-semibold transition ${
                  kennel.canAccommodate
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'cursor-not-allowed bg-slate-200 text-slate-500'
                }`}
              >
                {kennel.canAccommodate ? 'Select' : 'Unavailable'}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingAvailabilityStep;
