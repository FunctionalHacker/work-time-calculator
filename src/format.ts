import dayjs, { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration.js';
import Language from './types/Language';
import { MessageKey, message } from './i18n';

export const formatTime = (time: Dayjs): string => time.format('HH:mm');

export const formatDuration =
    (language: Language) =>
    (duration: Duration, short?: boolean): string => {
        if (duration.hours() === 0 && duration.minutes() === 0) {
            return 'none';
        }

        let formatString;

        if (short) {
            formatString = 'HH:mm';
        } else if (language === Language.fi) {
            formatString =
                duration.hours() > 0 && duration.minutes() > 0
                    ? `H [tunti${duration.hours() > 1 ? 'a' : ''} ja] m [minuutti${duration.minutes() > 1 ? 'a' : ''}]`
                    : duration.hours() > 0
                    ? `H [tunti${duration.hours() > 1 ? 'a' : ''}]`
                    : `m [minutti${duration.minutes() > 1 ? 'a' : ''}]`;
        } else {
            formatString =
                duration.hours() > 0 && duration.minutes() > 0
                    ? `H [hour${duration.hours() > 1 ? 's' : ''} and] m [minute${duration.minutes() > 1 ? 's' : ''}]`
                    : duration.hours() > 0
                    ? `H [hour${duration.hours() > 1 ? 's' : ''}]`
                    : `m [minute${duration.minutes() > 1 ? 's' : ''}]`;
        }

        return duration.format(formatString);
    };

export const getHoursRoundedStr = (language: Language) => (duration: Duration) =>
    `(${getHoursRounded(duration)} ${message(language)(MessageKey.hoursRounded)})`;

const getHoursRounded = (duration: Duration) => {
    // Round up to the next multiple of 15
    const minutes = Math.ceil(duration.as('minutes') / 15) * 15;

    // Return as hours
    return dayjs.duration(minutes, 'minutes').asHours();
};
