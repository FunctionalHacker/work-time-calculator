import chalk from 'chalk';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import duration, { Duration } from 'dayjs/plugin/duration.js';
import * as readline from 'readline/promises';

dayjs.extend(customParseFormat);
dayjs.extend(duration);

const { log, error } = console;
const defaultStartTime = '08:00';
const durationFormat = 'HH[ hours and ]mm [minutes]';
const lunchBreakDuration = dayjs.duration(30, 'minutes');
const defaultWorkDayDuration = '08:00';

const parseTime = (time: string): Dayjs => dayjs(time, 'HH:mm', true);

const getHoursRounded = (duration: Duration) => {
    // Get total minutes in the duration
    let minutes = duration.as('minutes');

    // Round up to the next multiple of 15
    minutes = Math.ceil(minutes / 15) * 15;

    return dayjs.duration(minutes, 'minutes').asHours();
};

const getHoursRoundedStr = (duration: Duration) =>
    `(${getHoursRounded(duration)} as hours rounded to next even 15 minutes)`;

const main = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let started: Dayjs | undefined = undefined;

    try {
        // Get work day duration
        let workDayDuration: Duration | undefined = undefined;

        const durationAnswer = await rl.question(`How long is your work day today, including the lunch break? [${defaultWorkDayDuration}] `);
        if (durationAnswer === '') {
            const [hours, minutes] = durationAnswer.split(':').map(Number);
            workDayDuration = dayjs.duration({ hours, minutes });
            if (workDayDuration.asMinutes() <= 0) {
                error(
                    `Failed to parse ${durationAnswer} to duration, using default work day duration ${defaultWorkDayDuration}`,
                );
                workDayDuration = undefined;
            }
        }

        if (!workDayDuration) {
            const [hours, minutes] = defaultWorkDayDuration.split(':').map(Number);
            workDayDuration = dayjs.duration({ hours, minutes });
        }

        // Calculate worked time
        const startTimeAnswer = await rl.question(`What time did you start work today? [${defaultStartTime}] `);
        if (startTimeAnswer !== '') {
            started = parseTime(startTimeAnswer);
            if (!started.isValid()) {
                error(`Failed to parse ${startTimeAnswer} to time, using default start time ${defaultStartTime}`);
            }
        }

        if (!started || !started.isValid()) {
            started = parseTime(defaultStartTime);
        }

        let stopped: Dayjs | undefined = undefined;
        const stoppedAnswer = await rl.question(
            "What time did you stop working (leave empty if you didn't stop yet)? ",
        );

        if (stoppedAnswer === '') {
            stopped = dayjs();
        } else {
            stopped = parseTime(stoppedAnswer);
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
        const [hours, minutes] = loggedAnswer.split(':').map(Number);
        const logged = dayjs.duration({ hours, minutes });
        const unLoggedDuration = workDayDuration.subtract(worked.subtract(logged));
        log('logged minutes', logged.asMinutes());
        log('unlogged minutes', unLoggedDuration.asMinutes());
        if (unLoggedDuration.asMinutes() > 0) {
            unLogged = unLoggedDuration;
        }

        // Log output
        log();
        log('Started working at', started.format('YYYY-MM-DD HH:mm'));
        log('Stopped working at', stopped.format('YYYY-MM-DD HH:mm'));
        log(
            'Total worked today:',
            chalk.green(worked.format(durationFormat)),
            chalk.yellow(getHoursRoundedStr(worked)),
        );
        log(
            'Unlogged today:',
            unLogged
                ? `${chalk.red(unLogged.format(durationFormat))} ${chalk.yellow(getHoursRoundedStr(unLogged))}`
                : chalk.green('none'),
        );
    } finally {
        rl.close();
    }
};

main();
