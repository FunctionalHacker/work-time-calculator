import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import duration, { Duration } from 'dayjs/plugin/duration.js';

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export const parseTimestamp = (time: string): Dayjs => dayjs(time, 'H:mm', true);

export const parseDuration = (time: string): Duration => {
    const [hours, minutes] = time.split(':').map(Number);
    return dayjs.duration({ hours, minutes });
};
