import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import ui from './ui.js';
import update from './update.js';
import getConfig from './config.js';
import { MessageKey, message } from './i18n.js';
import { WtcRuntimeConfig } from './types/WtcConfig.js';

// Build runtime config
const config = getConfig();
const msg = message(config.language);
const runtimeConfig: WtcRuntimeConfig = {
    config,
    msg,
};

// Process args. Yargs will exit if it detects help or version
const args = await yargs(hideBin(process.argv))
    .usage('Work time calculator')
    .alias('help', 'h')
    .alias('version', 'v')
    .options({
        help: {
            description: msg(MessageKey.cliHelp),
        },
        version: {
            description: msg(MessageKey.cliVersion),
        },
    }).argv;

// Run updater if requested
if (args.update) {
    update();
    process.exit(0);
}

// Run UI if no arguments
ui(runtimeConfig);
