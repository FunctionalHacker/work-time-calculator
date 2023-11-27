import input from './input.js';
import output from './output.js';
import { WtcRuntimeConfig } from './types/WtcConfig.js';

const ui = async (config: WtcRuntimeConfig) => output(await input(config), config);

export default ui;
