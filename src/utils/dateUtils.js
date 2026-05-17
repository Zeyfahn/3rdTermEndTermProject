import { format, differenceInDays, isPast, isFuture, isWithinInterval, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'MMM d');
  } catch {
    return dateStr;
  }
};

export const getTripDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  try {
    return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
  } catch {
    return 0;
  }
};

export const getTripStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return 'upcoming';
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const now = new Date();
    if (isPast(end)) return 'completed';
    if (isWithinInterval(now, { start, end })) return 'ongoing';
    if (isFuture(start)) return 'upcoming';
    return 'upcoming';
  } catch {
    return 'upcoming';
  }
};

export const getDaysUntilTrip = (startDate) => {
  if (!startDate) return null;
  try {
    return differenceInDays(parseISO(startDate), new Date());
  } catch {
    return null;
  }
};

export const generateDayLabels = (startDate, duration) => {
  if (!startDate || !duration) return [];
  return Array.from({ length: duration }, (_, i) => ({
    day: i + 1,
    label: format(
      new Date(new Date(startDate).setDate(new Date(startDate).getDate() + i)),
      'EEE, MMM d'
    ),
  }));
};
