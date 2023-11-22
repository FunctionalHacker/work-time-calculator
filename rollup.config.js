import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'src/main.ts',
    output: {
        format: 'esm',
        file: 'dist/wtc.js',
    },
    plugins: [typescript(), terser()],
};

export default config;
