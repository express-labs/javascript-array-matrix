import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import path from 'path';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';

// postcss plugins
import simplevars from 'postcss-simple-vars';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import postcssModules from 'postcss-modules';

var cache;

const cssExportMap = {};

export default {
  input: 'src/app.js',
  cache: cache,
  output: {
    name: 'arrayMatrix',
    file: 'dev/script/index.umd.js',
    format: 'umd',
    sourcemap: true,
    sourcemapFile: path.resolve('dev/main.umd.js'),
  },
  plugins: [
    postcss({
      sourceMap: 'inline', // true, "inline" or false
      extract : 'dev/style.css',
      extensions: ['.css'],
      plugins: [
        postcssImport(),
        simplevars(),
        cssnext({
          warnForDuplicates: false,
        }),
        postcssModules({
          getJSON (id, exportTokens) {
            cssExportMap[id] = exportTokens;
          }
        }),
        cssnano(),
      ],
      getExport (id) {
        return cssExportMap[id];
      },
    }),
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.jsx'],
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    commonjs({
      include: [
        'node_modules/**'
      ],
      exclude: [
        'node_modules/process-es6/**'
      ],
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    eslint({
      exclude: [
        '**/*.css',
        'node_modules/**'
      ]
    }),
    babel({
      exclude: [
        'node_modules/**',
        '__tests__/**',
      ],
    }),
  ],
}
