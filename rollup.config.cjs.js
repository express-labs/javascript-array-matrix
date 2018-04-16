import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import path from 'path';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

var cache;

export default {
  input: 'src/index.js',
  cache: cache,
  output: {
    name: 'arrayMatrix',
    format: 'cjs',
    sourcemap: true,
    sourcemapFile: path.resolve('dist/main.cjs.js'),
    file: 'dist/index.cjs.js',
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
    (process.env.NODE_ENV === 'production' && uglify())
  ],
}
