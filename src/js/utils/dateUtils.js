import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import 'dayjs/locale/en';

dayjs.extend(updateLocale);
dayjs.extend(duration);
dayjs.extend(calendar);
dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.locale('en');

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few sec',
    ss: '%d sec',
    m: 'a min',
    mm: '%d min',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    w: 'a week',
    ww: '%d weeks',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

export const durationUtil = (config) => dayjs.duration(config);

export const normalizeYearUtil = (value) => {
  const [date] = value.split(' ');
  const [year] = date.split('.');
  const createdDate = new Date(year);

  return `${createdDate.getFullYear()}`;
};

export const normalizeDateUtil = (date) =>
  dayjs(date).calendar(null, {
    sameDay: '[Today, ]HH:mm',
    nextDay: '[Tomorrow, ]HH:mm',
    nextWeek: 'DD.MM.YYYY',
    lastDay: '[Yesterday, ]HH:mm',
    lastWeek: 'DD.MM.YYYY',
    sameElse: 'DD.MM.YYYY',
  });

export const normalizeDateWithTimeUtil = (date) =>
  dayjs(date).calendar(null, {
    sameDay: '[Today, ]HH:mm',
    nextDay: '[Tomorrow, ]HH:mm',
    nextWeek: 'DD.MM.YYYY',
    lastDay: '[Yesterday, ]HH:mm',
    lastWeek: 'DD.MM.YYYY, HH:mm',
    sameElse: 'DD.MM.YYYY, HH:mm',
  });

export const normalizeDateUtilAgoUtil = (date, isOnlyAgo = true) => {
  if (!date) {
    return '';
  }

  if (!isOnlyAgo && !dayjs(date).isToday()) {
    return normalizeDateWithTimeUtil(date);
  }

  return dayjs(date).fromNow();
};

// export const normalizeDateUtilLeftUtil = (date, leftDate, withCurrentDatePoint) => {
export const normalizeDateUtilLeftUtil = (date) => {
  if (!date) {
    return '';
  }

  return dayjs(date).fromNow(true);

  // return moment.duration(!withCurrentDatePoint ? new Date() - new Date(date) : new Date(leftDate)).humanize();
};

export const getDateFormatUtil = (date, format = 'DD.MM.YYYY, HH:mm') => {
  if (!date) {
    return '';
  }

  return dayjs(date).format(format);
};

export const getDateFormatDDMMYYYYUtil = (date) => getDateFormatUtil(date, 'DD.MM.YYYY');
