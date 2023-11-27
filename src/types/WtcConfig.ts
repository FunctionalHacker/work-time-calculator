import { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration.js';
import Language from './Language.js';
import { message } from '../i18n.js';

export default interface WtcConfig {
    language: Language,
    timestampFormat: string,
    unpaidLunchBreakDuration?: Duration;
    defaults: {
        workDayDuration: Duration;
        startTime: Dayjs;
        stopTime: Dayjs;
        hadLunch: boolean;
    };
    askInput: {
        workDayDuration: boolean;
        startTime: boolean;
        stopTime: boolean;
        logged: boolean;
    };
}

/** Config and current language msg function together */
export interface WtcRuntimeConfig {
    config: WtcConfig;
    msg: ReturnType<typeof message>;
}

