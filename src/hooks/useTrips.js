import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTripContext } from '../context/TripContext';
import * as svc from '../services/tripService';

export function useTrips() {
  const { user } = useAuth();
  const { dispatch } = useTripContext();
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const trips = await svc.getUserTrips(user.uid);
      dispatch({ type: 'SET_TRIPS', payload: trips });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  }, [user, dispatch]);

  const fetchTrip = useCallback(async (tripId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [trip, members, itinerary, expenses, packingItems] = await Promise.all([
        svc.getTrip(tripId),
        svc.getFamilyMembers(tripId),
        svc.getItinerary(tripId),
        svc.getExpenses(tripId),
        svc.getPackingItems(tripId),
      ]);
      dispatch({ type: 'SET_CURRENT_TRIP', payload: trip });
      dispatch({ type: 'SET_MEMBERS', payload: members });
      dispatch({ type: 'SET_ITINERARY', payload: itinerary });
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
      dispatch({ type: 'SET_PACKING', payload: packingItems });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message });
    }
  }, [dispatch]);

  const createTrip = useCallback(async (tripData) => {
    setActionLoading(true);
    try {
      const id = await svc.createTrip(user.uid, tripData);
      const newTrip = { id, ...tripData, userId: user.uid };
      dispatch({ type: 'ADD_TRIP', payload: newTrip });
      return id;
    } finally {
      setActionLoading(false);
    }
  }, [user, dispatch]);

  const updateTrip = useCallback(async (tripId, data) => {
    setActionLoading(true);
    try {
      await svc.updateTrip(tripId, data);
      dispatch({ type: 'UPDATE_TRIP', payload: { id: tripId, ...data } });
    } finally {
      setActionLoading(false);
    }
  }, [dispatch]);

  const deleteTrip = useCallback(async (tripId) => {
    await svc.deleteTrip(tripId);
    dispatch({ type: 'DELETE_TRIP', payload: tripId });
  }, [dispatch]);

  // Members
  const addMember = useCallback(async (tripId, memberData) => {
    const id = await svc.addFamilyMember(tripId, memberData);
    dispatch({ type: 'ADD_MEMBER', payload: { id, ...memberData } });
    return id;
  }, [dispatch]);

  const removeMember = useCallback(async (tripId, memberId) => {
    await svc.deleteFamilyMember(tripId, memberId);
    dispatch({ type: 'REMOVE_MEMBER', payload: memberId });
  }, [dispatch]);

  // Itinerary
  const addActivity = useCallback(async (tripId, data) => {
    const id = await svc.addActivity(tripId, data);
    dispatch({ type: 'ADD_ACTIVITY', payload: { id, ...data } });
  }, [dispatch]);

  const updateActivity = useCallback(async (tripId, activityId, data) => {
    await svc.updateActivity(tripId, activityId, data);
    dispatch({ type: 'UPDATE_ACTIVITY', payload: { id: activityId, ...data } });
  }, [dispatch]);

  const deleteActivity = useCallback(async (tripId, activityId) => {
    await svc.deleteActivity(tripId, activityId);
    dispatch({ type: 'DELETE_ACTIVITY', payload: activityId });
  }, [dispatch]);

  // Budget
  const addExpense = useCallback(async (tripId, data) => {
    const id = await svc.addExpense(tripId, data);
    dispatch({ type: 'ADD_EXPENSE', payload: { id, ...data } });
  }, [dispatch]);

  const deleteExpense = useCallback(async (tripId, expenseId) => {
    await svc.deleteExpense(tripId, expenseId);
    dispatch({ type: 'DELETE_EXPENSE', payload: expenseId });
  }, [dispatch]);

  // Packing
  const addPackingItem = useCallback(async (tripId, data) => {
    const id = await svc.addPackingItem(tripId, data);
    dispatch({ type: 'ADD_PACKING_ITEM', payload: { id, ...data, packed: false } });
  }, [dispatch]);

  const togglePackingItem = useCallback(async (tripId, item) => {
    const updated = { ...item, packed: !item.packed };
    await svc.updatePackingItem(tripId, item.id, { packed: updated.packed });
    dispatch({ type: 'UPDATE_PACKING_ITEM', payload: updated });
  }, [dispatch]);

  const deletePackingItem = useCallback(async (tripId, itemId) => {
    await svc.deletePackingItem(tripId, itemId);
    dispatch({ type: 'DELETE_PACKING_ITEM', payload: itemId });
  }, [dispatch]);

  return {
    actionLoading,
    fetchTrips,
    fetchTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    addMember,
    removeMember,
    addActivity,
    updateActivity,
    deleteActivity,
    addExpense,
    deleteExpense,
    addPackingItem,
    togglePackingItem,
    deletePackingItem,
  };
}
