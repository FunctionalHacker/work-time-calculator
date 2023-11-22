import input from './input.js';
import output from './output.js';

const ui = async () => {
    const result = await input();
    output(result);
};

export default ui;
