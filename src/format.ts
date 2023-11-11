import dayjs, { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration.js';

export const formatTimestamp = (timestamp: Dayjs): string => timestamp.format('YYYY-MM-DD HH:mm');

export const formatDuration = (unLogged: Duration): string => unLogged.format('HH[ hours and ]mm [minutes]');

export const getHoursRoundedStr = (duration: Duration) =>
    `(${getHoursRounded(duration)} as hours rounded to next even 15 minutes)`;

const getHoursRounded = (duration: Duration) => {
    // Round up to the next multiple of 15
    const minutes = Math.ceil(duration.as('minutes') / 15) * 15;

    // Return as hours
    return dayjs.duration(minutes, 'minutes').asHours();
};
