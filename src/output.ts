import chalk from 'chalk';
import { formatDuration, getHoursRoundedStr } from './format';
import { WtcPromptResult } from './types/WtcPromptResult';
import { MessageKey } from './i18n.js';
import { WtcRuntimeConfig } from './types/WtcConfig';
import dayjs from './dayjs';

const { log } = console;

const output = (result: WtcPromptResult, runtimeCfg: WtcRuntimeConfig) => {
    const {config, msg} = runtimeCfg;
    const { language, timestampFormat } = config;
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
        log(msg(MessageKey.unpaidLunch), chalk.green(fmtDuration(config.unpaidLunchBreakDuration)));
    }

    const unLoggedMinutes = unLogged.asMinutes();
    if (unLoggedMinutes >= 0) {
        log(
            msg(MessageKey.unloggedToday),
            unLoggedMinutes === 0 ? chalk.green(msg(MessageKey.none)) : chalk.red(fmtDuration(unLogged)),
            unLoggedMinutes === 0 ? '' : chalk.yellow(hoursRounded(unLogged)),
        );
    } else if (unLoggedMinutes < 0) {
        const overLogged = dayjs.duration(Math.abs(unLogged.asMilliseconds()), 'milliseconds');
        log(chalk.red(msg(MessageKey.loggedOver, fmtDuration(overLogged))));
    }

    if (workLeft.asMinutes() > 0) {
        log(msg(MessageKey.workLeft, chalk.green(fmtDuration(workLeft))));
    } else if (workedOvertime) {
        log(msg(MessageKey.workedOvertime, chalk.green(fmtDuration(workedOvertime))));
    }
};

export default output;
