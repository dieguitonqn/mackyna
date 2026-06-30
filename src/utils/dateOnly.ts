type DateInput = Date | string | number | null | undefined;

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const toUtcDate = (value: DateInput): Date | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string' && DATE_ONLY_REGEX.test(value)) {
    return parseDateOnlyToUTC(value);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const parseDateOnlyToUTC = (dateOnly: string): Date | null => {
  if (!DATE_ONLY_REGEX.test(dateOnly)) {
    return null;
  }

  const [yearRaw, monthRaw, dayRaw] = dateOnly.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
};

export const toDateInputValue = (value: DateInput): string => {
  const parsed = toUtcDate(value);
  if (!parsed) {
    return '';
  }

  return parsed.toISOString().slice(0, 10);
};

export const formatDateOnlyEs = (
  value: DateInput,
  options?: Intl.DateTimeFormatOptions
): string => {
  const parsed = toUtcDate(value);
  if (!parsed) {
    return '---';
  }

  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'UTC',
    ...(options || {}),
  }).format(parsed);
};

export const getUTCMonthDayKey = (value: DateInput): string | null => {
  const parsed = toUtcDate(value);
  if (!parsed) {
    return null;
  }

  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  return `${month}-${day}`;
};
