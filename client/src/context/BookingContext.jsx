import { createContext, useContext, useMemo, useReducer } from 'react';

const BookingStateContext = createContext();
const BookingDispatchContext = createContext();

const initialState = {
  step: 1,
  checkInDate: null,
  checkOutDate: null,
  selectedPets: [],
  availability: [],
  selectedKennel: null,
  quote: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_DATES':
      return { ...state, checkInDate: action.payload.checkInDate, checkOutDate: action.payload.checkOutDate };
    case 'SET_PETS':
      return { ...state, selectedPets: action.payload };
    case 'SET_AVAILABILITY':
      return { ...state, availability: action.payload };
    case 'SET_KENNEL':
      return { ...state, selectedKennel: action.payload.kennel, quote: action.payload.quote };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => state, [state]);

  return (
    <BookingDispatchContext.Provider value={dispatch}>
      <BookingStateContext.Provider value={contextValue}>{children}</BookingStateContext.Provider>
    </BookingDispatchContext.Provider>
  );
};

export const useBookingState = () => {
  const context = useContext(BookingStateContext);
  if (context === undefined) {
    throw new Error('useBookingState must be used within a BookingProvider');
  }
  return context;
};

export const useBookingDispatch = () => {
  const context = useContext(BookingDispatchContext);
  if (context === undefined) {
    throw new Error('useBookingDispatch must be used within a BookingProvider');
  }
  return context;
};
