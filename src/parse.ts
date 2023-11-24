import dayjs, { Dayjs, Duration } from './dayjs';

export const parseTimestamp = (time: string): Dayjs => (time === 'now' ? dayjs() : dayjs(time, 'HH:mm', true));

export const parseDuration = (time: string): Duration => {
    const [hours, minutes] = time.split(':').map(Number);
    return dayjs.duration({ hours, minutes });
};
