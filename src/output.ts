import chalk from 'chalk';
import { formatDuration, formatTimestamp, getHoursRoundedStr } from './format';
import { WtcPromptResult } from './types/WtcPromptResult';
import { MessageKey, message } from './i18n.js';
import WtcConfig from './types/WtcConfig';

const { log } = console;

const output = (result: WtcPromptResult, config: WtcConfig) => {
    const msg = message(config.language);
    const fmtDuration = formatDuration(config.language);
    const hoursRounded = getHoursRoundedStr(config.language);
    const { startedAt, stoppedAt, stoppedWorking, worked, unLogged, workLeft, workedOverTime } = result;
    log();
    log(msg(MessageKey.startedWorking), formatTimestamp(startedAt));
    log(
        (stoppedWorking ? msg(MessageKey.stoppedWorking) : msg(MessageKey.hoursCalculated)) +
            ` ${msg(MessageKey.klo)}:`,
        formatTimestamp(stoppedAt),
    );
    log(msg(MessageKey.workedToday), chalk.green(fmtDuration(worked)), chalk.yellow(hoursRounded(worked)));

    const unLoggedMinutes = unLogged.asMinutes();
    if (unLoggedMinutes >= 0) {
        log(
            msg(MessageKey.unloggedToday),
            unLoggedMinutes === 0 ? chalk.green(msg(MessageKey.none)) : chalk.red(fmtDuration(unLogged)),
            chalk.yellow(hoursRounded(unLogged)),
        );
    } else if (unLoggedMinutes < 0) {
        log(chalk.red(msg(MessageKey.loggedOver, fmtDuration(unLogged))), chalk.yellow(hoursRounded(unLogged)));
    }

    if (workLeft.asMinutes() > 0) {
        log(msg(MessageKey.workLeft, chalk.green(fmtDuration(workLeft))));
    } else if (workedOverTime) {
        log(msg(MessageKey.workedOvertime, chalk.green(fmtDuration(workedOverTime))));
    }
};

export default output;
