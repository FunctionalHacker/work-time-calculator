import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import shebang from 'rollup-plugin-add-shebang';

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'src/main.ts',
    output: {
        format: 'esm',
        file: 'dist/wtc',
    },
    plugins: [typescript(), terser(), shebang({ include: 'dist/wtc' })],
};

export default config;
