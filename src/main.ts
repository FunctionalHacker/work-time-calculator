import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dayjs, { Dayjs } from 'dayjs';
import * as readline from 'readline/promises';
import { formatDuration, formatTime, formatTimestamp, getHoursRoundedStr } from './format.js';
import duration, { Duration } from 'dayjs/plugin/duration.js';
import { parseDuration, parseTimestamp } from './parse.js';
import getConfig from './config.js';

dayjs.extend(duration);

const { log, error } = console;

const ui = async () => {
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
                `What time did you stop working (default is current time if you didn't stop yet)? [${formatTime(
                    defaults.stopTime,
                )}] `,
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

        // Log result
        log();
        log('Started working at:', formatTimestamp(startedAt));
        log((stoppedWorking ? 'Stopped working' : 'Hours calculated') + ' at:', formatTimestamp(stoppedAt));
        log('Worked today:', chalk.green(formatDuration(worked)), chalk.yellow(getHoursRoundedStr(worked)));

        if (unLogged.asMinutes() == 0) {
            log('Unlogged today:', chalk.green('none'));
        } else if (unLogged.asMinutes() > 0) {
            log('Unlogged today:', chalk.red(formatDuration(unLogged)), chalk.yellow(getHoursRoundedStr(unLogged)));
        } else if (unLogged.asMinutes() < 0) {
            log(
                chalk.red(`You have logged ${formatDuration(unLogged)} more than you worked today!`),
                chalk.yellow(getHoursRoundedStr(unLogged)),
            );
        }

        const workLeft = workDayDuration.subtract(worked);
        const workLeftMinutes = workLeft.asMinutes();
        if (workLeftMinutes > 0) {
            log('You still have to work', chalk.green(formatDuration(workLeft)), 'more today');
        } else if (workLeft.asMinutes() < 0) {
            log(
                'You worked',
                chalk.green(
                    formatDuration(dayjs.duration(Math.round(workLeftMinutes * -1), 'minutes')),
                    'overtime today',
                ),
            );
        }
    } finally {
        rl.close();
    }
};

yargs(hideBin(process.argv)).usage('Work time calculator').alias('help', 'h').alias('version', 'v').argv;

ui();
