import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'src/main.ts',
    output: {
        format: 'esm',
        file: 'dist/wtc.mjs',
    },
    plugins: [typescript(), nodeResolve({ exportConditions: ['node'] }), terser()],
};

export default config;
