import { useEffect, useMemo, useState } from 'react';

import httpClient from '../../api/httpClient.js';
import { BookingProvider, useBookingDispatch, useBookingState } from '../../context/BookingContext.jsx';
import BookingDatesStep from './Steps/BookingDatesStep.jsx';
import BookingAvailabilityStep from './Steps/BookingAvailabilityStep.jsx';
import BookingReviewStep from './Steps/BookingReviewStep.jsx';

const StepContent = () => {
  const state = useBookingState();
  const dispatch = useBookingDispatch();
  const [pets, setPets] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      setIsLoadingPets(true);
      try {
        const { data } = await httpClient.get('/pets');
        setPets(data);
      } catch (error) {
        console.error('Failed to load pets', error);
      } finally {
        setIsLoadingPets(false);
      }
    };

    fetchPets();
  }, []);

  switch (state.step) {
    case 1:
      return <BookingDatesStep pets={pets} isLoading={isLoadingPets} dispatch={dispatch} state={state} />;
    case 2:
      return <BookingAvailabilityStep dispatch={dispatch} state={state} />;
    case 3:
      return <BookingReviewStep dispatch={dispatch} state={state} />;
    default:
      return null;
  }
};

const StepIndicator = () => {
  const state = useBookingState();
  const steps = useMemo(
    () => [
      { id: 1, title: 'Dates & Pets' },
      { id: 2, title: 'Availability' },
      { id: 3, title: 'Review' },
    ],
    []
  );

  return (
    <ol className="flex flex-wrap gap-4 text-sm">
      {steps.map((step) => (
        <li
          key={step.id}
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            state.step === step.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary">
            {step.id}
          </span>
          <span className="font-medium">{step.title}</span>
        </li>
      ))}
    </ol>
  );
};

const NewBookingWizard = () => (
  <BookingProvider>
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Create a New Booking</h1>
          <p className="mt-2 text-sm text-slate-500">
            Complete the three steps below to request a boarding reservation.
          </p>
        </div>
        <StepIndicator />
      </header>
      <StepContent />
    </div>
  </BookingProvider>
);

export default NewBookingWizard;
