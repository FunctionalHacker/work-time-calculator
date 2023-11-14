import dayjs, { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration.js';

export const formatTimestamp = (timestamp: Dayjs): string => timestamp.format('YYYY-MM-DD HH:mm');

export const formatTime = (time: Dayjs): string => time.format('HH:mm');

export const formatDuration = (duration: Duration, short?: boolean): string => {
    if (duration.hours() === 0 && duration.minutes() === 0) {
        return 'none';
    }

    const formatString = short
        ? 'HH:mm'
        : duration.hours() > 0 && duration.minutes() > 0
        ? `H [hour${duration.hours() > 1 ? 's' : ''} and] m [minute${duration.minutes() > 1 ? 's' : ''}]`
        : duration.hours() > 0
        ? `H [hour${duration.hours() > 1 ? 's' : ''}]`
        : `m [minute${duration.minutes() > 1 ? 's' : ''}]`;

    return duration.format(formatString);
};

export const getHoursRoundedStr = (duration: Duration) =>
    `(${getHoursRounded(duration)} as hours rounded to next even 15 minutes)`;

const getHoursRounded = (duration: Duration) => {
    // Round up to the next multiple of 15
    const minutes = Math.ceil(duration.as('minutes') / 15) * 15;

    // Return as hours
    return dayjs.duration(minutes, 'minutes').asHours();
};
