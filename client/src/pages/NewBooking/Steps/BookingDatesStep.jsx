import { useState } from 'react';
import dayjs from 'dayjs';

const BookingDatesStep = ({ pets, isLoading, dispatch, state }) => {
  const [checkIn, setCheckIn] = useState(state.checkInDate ?? '');
  const [checkOut, setCheckOut] = useState(state.checkOutDate ?? '');
  const [selectedPets, setSelectedPets] = useState(state.selectedPets);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!checkIn || !checkOut || selectedPets.length === 0) {
      alert('Select dates and at least one pet to continue.');
      return;
    }

    if (!dayjs(checkOut).isAfter(dayjs(checkIn))) {
      alert('Check-out must be at least one day after check-in.');
      return;
    }

    dispatch({ type: 'SET_DATES', payload: { checkInDate: checkIn, checkOutDate: checkOut } });
    dispatch({ type: 'SET_PETS', payload: selectedPets });
    dispatch({ type: 'SET_AVAILABILITY', payload: [] });
    dispatch({ type: 'SET_KENNEL', payload: { kennel: null, quote: null } });
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Check-in Date
          <input
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className="mt-1 rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Check-out Date
          <input
            type="date"
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="mt-1 rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-slate-600">Select Pets</legend>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading pets...</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <label
                key={pet._id}
                className={`flex items-center gap-2 rounded border px-3 py-2 ${
                  selectedPets.includes(pet._id) ? 'border-primary bg-primary/5' : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPets.includes(pet._id)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedPets([...selectedPets, pet._id]);
                    } else {
                      setSelectedPets(selectedPets.filter((id) => id !== pet._id));
                    }
                  }}
                />
                <span className="text-sm">
                  <span className="font-semibold">{pet.name}</span>
                  <span className="block text-xs text-slate-500">{pet.breed || 'Unknown breed'}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <div className="flex justify-end">
        <button type="submit" className="rounded bg-primary px-4 py-2 text-white shadow">
          Check Availability
        </button>
      </div>
    </form>
  );
};

export default BookingDatesStep;
