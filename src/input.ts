import chalk from 'chalk';
import { Duration } from 'dayjs/plugin/duration';
import { parseDuration, parseTimestamp } from './parse';
import * as readline from 'readline/promises';
import { formatDuration, formatTime } from './format';
import dayjs, { Dayjs } from 'dayjs';
import { WtcPromptResult } from './types/WtcPromptResult';
import duration from 'dayjs/plugin/duration.js';
import WtcConfig from './types/WtcConfig';
import { MessageKey, message } from './i18n';

dayjs.extend(duration);

const { error } = console;

const input = async (config: WtcConfig): Promise<WtcPromptResult> => {
    const msg = message(config.language);
    const fmtDuration = formatDuration(config.language);
    const { defaults, askInput, lunchBreakDuration } = config;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let startedAt: Dayjs | undefined = undefined;
    let stoppedAt: Dayjs | undefined = undefined;
    let stoppedWorking = false;

    try {
        // Get work day duration
        let workDayDuration: Duration | undefined = undefined;

        if (askInput.workDayLength) {
            const durationAnswer = await rl.question(
                msg(MessageKey.promptWorkDayDuration, fmtDuration(defaults.workDayDuration, true)),
            );
            if (durationAnswer !== '') {
                workDayDuration = parseDuration(durationAnswer);
                if (workDayDuration.asMinutes() <= 0) {
                    error(
                        chalk.red(
                            msg(MessageKey.parseTimeFailed, durationAnswer, fmtDuration(defaults.workDayDuration)),
                        ),
                    );
                    workDayDuration = undefined;
                }
            }
        }

        if (!workDayDuration) {
            workDayDuration = defaults.workDayDuration;
        }

        if (askInput.startTime) {
            const startTimeAnswer = await rl.question(msg(MessageKey.promptStartTime, formatTime(defaults.startTime)));
            if (startTimeAnswer !== '') {
                startedAt = parseTimestamp(startTimeAnswer);
                if (!startedAt.isValid()) {
                    error(chalk.red(msg(MessageKey.parseTimeFailed, startTimeAnswer, formatTime(defaults.startTime))));
                }
            }
        }

        if (!startedAt?.isValid()) {
            startedAt = defaults.startTime;
        }

        if (askInput.stopTime) {
            const stoppedAnswer = await rl.question(msg(MessageKey.promptStopTime, formatTime(defaults.stopTime)));

            if (stoppedAnswer !== '') {
                stoppedWorking = true;
                stoppedAt = parseTimestamp(stoppedAnswer);
                if (!stoppedAt.isValid()) {
                    error(chalk.red(msg(MessageKey.parseTimeFailed, stoppedAnswer, formatTime(defaults.stopTime))));
                }
            }
        }

        if (!stoppedAt) {
            stoppedAt = defaults.stopTime;
        }

        if (stoppedAt.isSame(startedAt) || stoppedAt.isBefore(startedAt)) {
            error(
                chalk.red(msg(MessageKey.startTimeBeforeStopTimeError, formatTime(startedAt), formatTime(stoppedAt))),
            );
            process.exit(1);
        }

        let worked = dayjs.duration(stoppedAt.diff(startedAt));

        let hadLunch = false;
        if (lunchBreakDuration) {
            const lunchAnswer = (await rl.question(msg(MessageKey.promptLunchBreak))).toLowerCase();

            if (lunchAnswer === 'y' || lunchAnswer === 'k') {
                hadLunch = true
                worked = worked.subtract(lunchBreakDuration);
            }
        }

        // Calculate unlogged time
        let loggedAnswer = await rl.question(msg(MessageKey.promptLogged));
        if (loggedAnswer === '') {
            loggedAnswer = '00:00';
        }
        const logged = parseDuration(loggedAnswer);
        const unLogged = worked.subtract(logged);
        const workLeft = workDayDuration.subtract(worked);
        let workLeftMinutes = workLeft.asMinutes();
        let workedOvertime: Duration | undefined;

        if (workLeftMinutes < 0) {
            workedOvertime = dayjs.duration(Math.round(workLeftMinutes * -1), 'minutes');
        }

        return {
            logged,
            unLogged,
            startedAt,
            stoppedAt,
            stoppedWorking,
            hadLunch,
            worked,
            workLeft,
            workedOvertime,
        };
    } finally {
        rl.close();
    }
};

export default input;
