import chalk from 'chalk';
import { formatDuration, formatTimestamp, getHoursRoundedStr } from './format';
import { WtcPromptResult } from './types/WtcPromptResult';

const { log } = console;

const output = (result: WtcPromptResult) => {
    const { startedAt, stoppedAt, stoppedWorking, worked, unLogged, workLeft, workedOverTime } = result;
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

    if (workLeft.asMinutes() > 0) {
        log('You still have to work', chalk.green(formatDuration(workLeft)), 'more today');
    } else if (workedOverTime) {
        log('You worked', chalk.green(formatDuration(workedOverTime), 'overtime today'));
    }
};

export default output;
