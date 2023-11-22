import chalk from 'chalk';
import { Duration } from 'dayjs/plugin/duration';
import getConfig from './config';
import { parseDuration, parseTimestamp } from './parse';
import * as readline from 'readline/promises';
import { formatDuration, formatTime } from './format';
import dayjs, { Dayjs } from 'dayjs';
import { WtcPromptResult } from './types/WtcPromptResult';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const { error } = console;

const input = async (): Promise<WtcPromptResult> => {
    const { defaults, askInput } = getConfig();
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
                `How long is your work day today, excluding the lunch break? [${formatDuration(
                    defaults.workDayDuration,
                    true,
                )}] `,
            );
            if (durationAnswer !== '') {
                workDayDuration = parseDuration(durationAnswer);
                if (workDayDuration.asMinutes() <= 0) {
                    error(
                        chalk.red(
                            `Failed to parse ${durationAnswer} to duration, using default work day duration ${formatDuration(
                                defaults.workDayDuration,
                                true,
                            )}`,
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
            const startTimeAnswer = await rl.question(
                `What time did you start work today? [${formatTime(defaults.startTime)}] `,
            );
            if (startTimeAnswer !== '') {
                startedAt = parseTimestamp(startTimeAnswer);
                if (!startedAt.isValid()) {
                    error(
                        chalk.red(
                            `Failed to parse ${startTimeAnswer} to time, using default start time ${formatTime(
                                defaults.startTime,
                            )}`,
                        ),
                    );
                }
            }
        }

        if (!startedAt?.isValid()) {
            startedAt = defaults.startTime;
        }

        if (askInput.stopTime) {
            const stoppedAnswer = await rl.question(
                `What time did you stop working? [${formatTime(defaults.stopTime)}] `,
            );

            if (stoppedAnswer !== '') {
                stoppedWorking = true;
                stoppedAt = parseTimestamp(stoppedAnswer);
                if (!stoppedAt.isValid()) {
                    error(`Failed to parse ${stoppedAnswer} to time, using current time`);
                    stoppedAt = dayjs();
                }
            }
        }

        if (!stoppedAt) {
            stoppedAt = defaults.stopTime;
        }

        if (stoppedAt.isSame(startedAt) || stoppedAt.isBefore(startedAt)) {
            error(
                chalk.red(
                    `Start time (${formatTime(startedAt)}) needs to be before stop time (${formatTime(
                        stoppedAt,
                    )}). Exiting`,
                ),
            );
            process.exit(1);
        }

        let worked = dayjs.duration(stoppedAt.diff(startedAt));

        const hadLunch =
            askInput.hadLunch && (await rl.question('Did you have a lunch break? [Y/n] ')).toLowerCase() !== 'n';

        if (hadLunch) {
            worked = worked.subtract(defaults.lunchBreakDuration);
        }

        // Calculate unlogged time
        let loggedAnswer = await rl.question('How many hours did you log already? [00:00] ');
        if (loggedAnswer === '') {
            loggedAnswer = '00:00';
        }
        const logged = parseDuration(loggedAnswer);
        const unLogged = worked.subtract(logged);
        const workLeft = workDayDuration.subtract(worked);
        let workLeftMinutes = workLeft.asMinutes();
        let workedOverTime: Duration | undefined;

        if (workLeftMinutes < 0) {
            workedOverTime = dayjs.duration(Math.round(workLeftMinutes * -1), 'minutes');
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
        };
    } finally {
        rl.close();
    }
};

export default input;
