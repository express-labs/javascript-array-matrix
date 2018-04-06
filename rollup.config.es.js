import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import path from 'path';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es'; // ES6 minification is experimental as of 5/16/17

var cache;

export default {
  input: 'src/index.js',
  cache: cache,
  output: {
    sourcemap: true,
    sourcemapFile: path.resolve('dist/main.es.js'),
    file: 'dist/index.es.js',
    format: 'es',
  },
  plugins: [
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js'],
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    commonjs(),
    eslint({
      exclude: [
        'node_modules/**'
      ]
    }),
    babel({
      exclude: [
        'node_modules/**'
      ],
    }),
    replace({
      include: 'src/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    (process.env.NODE_ENV === 'production' && uglify({}, minify))
  ],
}
