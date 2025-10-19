import { useState } from 'react';
import dayjs from 'dayjs';

import httpClient from '../../../api/httpClient.js';

const BookingReviewStep = ({ dispatch, state }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!state.selectedKennel) {
    return (
      <div className="rounded border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
        Select a kennel type to continue.
      </div>
    );
  }

  const nights = Math.max(dayjs(state.checkOutDate).diff(dayjs(state.checkInDate), 'day'), 1);
  const totalPrice = nights * state.selectedKennel.pricePerNight * state.selectedPets.length;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await httpClient.post('/bookings', {
        pets: state.selectedPets,
        kennelType: state.selectedKennel.kennelId,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
      });
      setSuccess(true);
      dispatch({ type: 'RESET' });
      dispatch({ type: 'SET_STEP', payload: 1 });
    } catch (err) {
      console.error(err);
      setError('Unable to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="text-xl font-semibold text-slate-800">Review & Submit</h2>
        <p className="text-sm text-slate-500">
          Confirm the details below before submitting your booking request.
        </p>
      </header>

      <dl className="grid grid-cols-1 gap-4 rounded border border-slate-200 p-4 text-sm md:grid-cols-2">
        <div>
          <dt className="font-semibold text-slate-600">Dates</dt>
          <dd>
            {state.checkInDate} → {state.checkOutDate} ({nights} nights)
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-600">Pets</dt>
          <dd>{state.selectedPets.length} pet(s)</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-600">Kennel Type</dt>
          <dd>{state.selectedKennel.type}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-600">Estimated Total</dt>
          <dd className="text-lg font-semibold text-primary">${totalPrice}</dd>
        </div>
      </dl>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {success && (
        <div className="rounded border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700">
          Booking submitted! Our team will review and confirm shortly.
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
          className="text-sm text-primary underline"
        >
          Back to availability
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded bg-primary px-4 py-2 text-white shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Booking'}
        </button>
      </div>
    </div>
  );
};

export default BookingReviewStep;
