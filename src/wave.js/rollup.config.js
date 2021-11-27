// import { terser } from "rollup-plugin-terser";
// import babel from '@rollup/plugin-babel';

import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'

export default {
    input: "./src/index.js",
    output: [{
        file: './dist/bundle.iife.js',
        format: 'iife',
        name: 'Wave'
    }],
    plugins: [
        resolve(),
        commonJS({
            include: 'node_modules/**'
        })
    ]
}

