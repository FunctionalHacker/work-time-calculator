import chalk from 'chalk';
import dayjs, { Dayjs } from 'dayjs';
import * as readline from 'readline/promises';
import { formatDuration, formatTimestamp, getHoursRoundedStr } from './format.js';
import { Duration } from 'dayjs/plugin/duration';
import { parseDuration, parseTimestamp } from './parse.js';

const { log, error } = console;
const defaultStartTime = '08:00';
const lunchBreakDuration = dayjs.duration(30, 'minutes');
const defaultWorkDayDuration = dayjs.duration({ hours: 7, minutes: 30 });

const main = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let started: Dayjs | undefined = undefined;

    try {
        // Get work day duration
        let workDayDuration: Duration | undefined = undefined;

        const durationAnswer = await rl.question(
            `How long is your work day today, excluding the lunch break? [${defaultWorkDayDuration.format('HH:mm')}] `,
        );
        if (durationAnswer !== '') {
            workDayDuration = parseDuration(durationAnswer);
            if (workDayDuration.asMinutes() <= 0) {
                error(
                    chalk.red(
                        `Failed to parse ${durationAnswer} to duration, using default work day duration ${defaultWorkDayDuration}`,
                    ),
                );
                workDayDuration = undefined;
            }
        }

        if (!workDayDuration) {
            workDayDuration = defaultWorkDayDuration;
        }

        // Calculate worked time
        const startTimeAnswer = await rl.question(`What time did you start work today? [${defaultStartTime}] `);
        if (startTimeAnswer !== '') {
            started = parseTimestamp(startTimeAnswer);
            if (!started.isValid()) {
                error(
                    chalk.red(
                        `Failed to parse ${startTimeAnswer} to time, using default start time ${defaultStartTime}`,
                    ),
                );
            }
        }

        if (!started?.isValid()) {
            started = parseTimestamp(defaultStartTime);
        }

        let stopped: Dayjs | undefined = undefined;
        const stoppedAnswer = await rl.question(
            "What time did you stop working (leave empty if you didn't stop yet)? ",
        );

        if (stoppedAnswer === '') {
            stopped = dayjs();
        } else {
            stopped = parseTimestamp(stoppedAnswer);
            if (!stopped.isValid()) {
                error(`Failed to parse ${stoppedAnswer} to time, using current time`);
                stopped = dayjs();
            }
        }

        let worked = dayjs.duration(stopped.diff(started));

        const lunchAnswer = await rl.question('Did you have a lunch break? [Y/n] ');
        if (lunchAnswer.toLowerCase() !== 'n') {
            worked = worked.subtract(lunchBreakDuration);
        }

        // Calculate unlogged time
        let unLogged: Duration | undefined = undefined;
        let loggedAnswer = await rl.question('How many hours did you log to ERP already? [00:00] ');
        if (loggedAnswer === '') {
            loggedAnswer = '00:00';
        }
        const logged = parseDuration(loggedAnswer);
        const unLoggedDuration = workDayDuration.subtract(logged);
        if (unLoggedDuration.asMinutes() > 0) {
            unLogged = unLoggedDuration;
        }

        // Log result
        log();
        log('Started working at', formatTimestamp(started));
        log('Stopped working at', formatTimestamp(stopped));
        log('Total worked today:', chalk.green(formatDuration(worked)), chalk.yellow(getHoursRoundedStr(worked)));
        log(
            'Unlogged today:',
            unLogged
                ? `${chalk.red(formatDuration(unLogged))} ${chalk.yellow(getHoursRoundedStr(unLogged))}`
                : chalk.green('none'),
        );
    } finally {
        rl.close();
    }
};

main();
