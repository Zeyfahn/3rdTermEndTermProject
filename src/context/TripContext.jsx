import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

const TripContext = createContext(null);

const initialState = {
  trips: [],
  currentTrip: null,
  members: [],
  itinerary: [],
  expenses: [],
  packingItems: [],
  loading: false,
  error: null,
};

function tripReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TRIPS':
      return { ...state, trips: action.payload, loading: false };
    case 'ADD_TRIP':
      return { ...state, trips: [action.payload, ...state.trips] };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map((t) => (t.id === action.payload.id ? action.payload : t)),
        currentTrip: state.currentTrip?.id === action.payload.id ? action.payload : state.currentTrip,
      };
    case 'DELETE_TRIP':
      return { ...state, trips: state.trips.filter((t) => t.id !== action.payload) };
    case 'SET_CURRENT_TRIP':
      return { ...state, currentTrip: action.payload, loading: false };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload };
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] };
    case 'REMOVE_MEMBER':
      return { ...state, members: state.members.filter((m) => m.id !== action.payload) };
    case 'SET_ITINERARY':
      return { ...state, itinerary: action.payload };
    case 'ADD_ACTIVITY':
      return { ...state, itinerary: [...state.itinerary, action.payload] };
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        itinerary: state.itinerary.map((a) => (a.id === action.payload.id ? action.payload : a)),
      };
    case 'DELETE_ACTIVITY':
      return { ...state, itinerary: state.itinerary.filter((a) => a.id !== action.payload) };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };
    case 'SET_PACKING':
      return { ...state, packingItems: action.payload };
    case 'ADD_PACKING_ITEM':
      return { ...state, packingItems: [...state.packingItems, action.payload] };
    case 'UPDATE_PACKING_ITEM':
      return {
        ...state,
        packingItems: state.packingItems.map((i) => (i.id === action.payload.id ? action.payload : i)),
      };
    case 'DELETE_PACKING_ITEM':
      return { ...state, packingItems: state.packingItems.filter((i) => i.id !== action.payload) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const TripProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  const totalSpent = useMemo(
    () => state.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [state.expenses]
  );

  const remainingBudget = useMemo(
    () => (state.currentTrip?.budgetLimit || 0) - totalSpent,
    [state.currentTrip, totalSpent]
  );

  const packedCount = useMemo(
    () => state.packingItems.filter((i) => i.packed).length,
    [state.packingItems]
  );

  const dispatchAction = useCallback((action) => dispatch(action), []);

  const value = useMemo(
    () => ({ ...state, totalSpent, remainingBudget, packedCount, dispatch: dispatchAction }),
    [state, totalSpent, remainingBudget, packedCount, dispatchAction]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTripContext = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used within TripProvider');
  return ctx;
};
