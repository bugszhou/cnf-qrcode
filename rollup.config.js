import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import builtins from '@joseph184/rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { terser } from "rollup-plugin-terser";

export default {
  external: ['dijkstrajs', 'isarray', 'pngjs'],
  input: 'src/entry/index.js',
  output: [
    // umd，第三方依赖未打包
    {
      name: 'cnfQrcode',
      exports: 'named',
      file: 'dist/cnf-qrcode.js',
      format: 'umd',
      sourcemap: true,
      strict: true,
      noConflict: true,
    },
    // umd压缩后，第三方依赖未打包
    {
      name: 'cnfQrcode',
      exports: 'named',
      file: 'dist/cnf-qrcode.common.js',
      format: 'umd',
      sourcemap: true,
      strict: true,
      noConflict: true,
    },
    // 使用es6 import语法
    {
      name: 'cnfQrcode',
      exports: 'named',
      file: 'dist/cnf-qrcode.esm.js',
      format: 'esm',
      sourcemap: true,
      strict: true,
    },
  ],
  plugins: [
    json(),
    resolve(),
    builtins(),
    commonjs(),
    globals(),
    babel({
      configFile: path.resolve(__dirname, './src/entry/.babelrc'),
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    terser({
      include: [/^.+\.common\.js$/],
    }),
  ],
  watch: {
    clearScreen: true,
    include: 'src/**',
  },
};
