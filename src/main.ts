import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import ui from './ui.js';

// Process args. Yargs will exit if it detects help or version
yargs(hideBin(process.argv)).usage('Work time calculator').alias('help', 'h').alias('version', 'v').argv;

// Run UI if help or version is not prompted
ui();
