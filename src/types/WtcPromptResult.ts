import { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';

export interface WtcPromptResult {
    startedAt: Dayjs;
    stoppedAt: Dayjs;
    stoppedWorking: boolean;
    logged: Duration;
    unLogged: Duration;
    hadLunch: boolean;
    worked: Duration;
    workLeft: Duration;
    workedOvertime?: Duration;
}
