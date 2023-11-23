import { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration.js';
import Language from './Language.js';

export default interface WtcConfig {
    language: Language,
    timestampFormat: string,
    lunchBreakDuration?: Duration;
    defaults: {
        workDayDuration: Duration;
        startTime: Dayjs;
        stopTime: Dayjs;
    };
    askInput: {
        workDayLength: boolean;
        startTime: boolean;
        stopTime: boolean;
        logged: boolean;
    };
}
