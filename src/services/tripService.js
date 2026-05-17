import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ── Trips ──────────────────────────────────────────────────
export const createTrip = async (userId, tripData) => {
  const ref = await addDoc(collection(db, 'trips'), {
    ...tripData,
    userId,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserTrips = async (userId) => {
  const q = query(
    collection(db, 'trips'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getTrip = async (tripId) => {
  const snap = await getDoc(doc(db, 'trips', tripId));
  if (!snap.exists()) throw new Error('Trip not found');
  return { id: snap.id, ...snap.data() };
};

export const updateTrip = async (tripId, data) => {
  await updateDoc(doc(db, 'trips', tripId), { ...data, updatedAt: serverTimestamp() });
};

export const deleteTrip = async (tripId) => {
  await deleteDoc(doc(db, 'trips', tripId));
};

// ── Family Members ─────────────────────────────────────────
export const addFamilyMember = async (tripId, memberData) => {
  const ref = await addDoc(collection(db, 'trips', tripId, 'members'), {
    ...memberData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getFamilyMembers = async (tripId) => {
  const snap = await getDocs(collection(db, 'trips', tripId, 'members'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteFamilyMember = async (tripId, memberId) => {
  await deleteDoc(doc(db, 'trips', tripId, 'members', memberId));
};

// ── Itinerary ──────────────────────────────────────────────
export const addActivity = async (tripId, activityData) => {
  const ref = await addDoc(collection(db, 'trips', tripId, 'itinerary'), {
    ...activityData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getItinerary = async (tripId) => {
  // Order by 'day' only (avoids requiring a composite Firestore index).
  // Time is sorted client-side in useTrips/useMemo.
  const snap = await getDocs(
    query(collection(db, 'trips', tripId, 'itinerary'), orderBy('day'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateActivity = async (tripId, activityId, data) => {
  await updateDoc(doc(db, 'trips', tripId, 'itinerary', activityId), data);
};

export const deleteActivity = async (tripId, activityId) => {
  await deleteDoc(doc(db, 'trips', tripId, 'itinerary', activityId));
};

// ── Budget / Expenses ──────────────────────────────────────
export const addExpense = async (tripId, expenseData) => {
  const ref = await addDoc(collection(db, 'trips', tripId, 'expenses'), {
    ...expenseData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getExpenses = async (tripId) => {
  const snap = await getDocs(
    query(collection(db, 'trips', tripId, 'expenses'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteExpense = async (tripId, expenseId) => {
  await deleteDoc(doc(db, 'trips', tripId, 'expenses', expenseId));
};

// ── Packing List ───────────────────────────────────────────
export const addPackingItem = async (tripId, itemData) => {
  const ref = await addDoc(collection(db, 'trips', tripId, 'packing'), {
    ...itemData,
    packed: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getPackingItems = async (tripId) => {
  // No server-side orderBy — avoids needing a Firestore index on the subcollection.
  const snap = await getDocs(collection(db, 'trips', tripId, 'packing'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updatePackingItem = async (tripId, itemId, data) => {
  await updateDoc(doc(db, 'trips', tripId, 'packing', itemId), data);
};

export const deletePackingItem = async (tripId, itemId) => {
  await deleteDoc(doc(db, 'trips', tripId, 'packing', itemId));
};
