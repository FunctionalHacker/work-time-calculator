import getConfig from './config.js';
import input from './input.js';
import output from './output.js';

const ui = async () => {
    const config = getConfig();
    const result = await input(config);
    output(result, config);
};

export default ui;
