import chalk from 'chalk';
import { formatDuration, getHoursRoundedStr } from './format';
import { WtcPromptResult } from './types/WtcPromptResult';
import { MessageKey, message } from './i18n.js';
import WtcConfig from './types/WtcConfig';

const { log } = console;

const output = (result: WtcPromptResult, config: WtcConfig) => {
    const { language, timestampFormat } = config;
    const msg = message(language);
    const fmtDuration = formatDuration(language);
    const hoursRounded = getHoursRoundedStr(language);
    const { startedAt, stoppedAt, stoppedWorking, worked, unLogged, workLeft, workedOvertime, hadLunch } = result;

    log();
    log(msg(MessageKey.startedWorking), startedAt.format(timestampFormat));
    log(
        (stoppedWorking ? msg(MessageKey.stoppedWorking) : msg(MessageKey.hoursCalculated)) +
            ` ${msg(MessageKey.klo)}:`,
        stoppedAt.format(timestampFormat),
    );
    log(msg(MessageKey.workedToday), chalk.green(fmtDuration(worked)), chalk.yellow(hoursRounded(worked)));

    if (hadLunch) {
        log(msg(MessageKey.unpaidLunch), chalk.green(fmtDuration(config.defaults.lunchBreakDuration)));
    }

    const unLoggedMinutes = unLogged.asMinutes();
    if (unLoggedMinutes >= 0) {
        log(
            msg(MessageKey.unloggedToday),
            unLoggedMinutes === 0 ? chalk.green(msg(MessageKey.none)) : chalk.red(fmtDuration(unLogged)),
            unLoggedMinutes === 0 ? '' : chalk.yellow(hoursRounded(unLogged)),
        );
    } else if (unLoggedMinutes < 0) {
        log(chalk.red(msg(MessageKey.loggedOver, fmtDuration(unLogged))), chalk.yellow(hoursRounded(unLogged)));
    }

    if (workLeft.asMinutes() > 0) {
        log(msg(MessageKey.workLeft, chalk.green(fmtDuration(workLeft))));
    } else if (workedOvertime) {
        log(msg(MessageKey.workedOvertime, chalk.green(fmtDuration(workedOvertime))));
    }
};

export default output;
