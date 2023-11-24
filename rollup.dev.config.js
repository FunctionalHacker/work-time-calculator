import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import shebang from 'rollup-plugin-add-shebang';

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'src/main.ts',
    output: {
        format: 'esm',
        file: 'dist/wtc-dev.mjs',
    },
    plugins: [typescript(), nodeResolve({ exportConditions: ['node'] }), shebang({ include: 'dist/wtc-dev.mjs' })],
};

export default config;
