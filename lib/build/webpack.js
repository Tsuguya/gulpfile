/*eslint-env node */
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import gulpIf from 'gulp-if';

import argv from './common/argv';

import webpack from 'webpack-stream';
import named from 'vinyl-named';

export default args => {
  const {src, dist, resolve, htmlRoot} = args;
  const dir = {};

  return () => gulp.src(src)
    .pipe(plumber())
    .pipe(named())
    .pipe(rename(path => {
      dir[path.basename] = path.dirname;
    }))
    .pipe(webpack({
      watch: false,
      cache: true,
      debug: false,
      devtool: false,
      resolve: {
        root: resolve,
        extensions: [``, `.webpack.js`, `.js`]
      },
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: `babel-loader` },
          { test: /\.html$/, loader: `html` },
        ]
      },
      htmlLoader: {
        minimize: true,
        root: htmlRoot,
        attrs: []
      },
      plugins: !argv.test ? [
        new webpack.webpack.optimize.DedupePlugin(),
        new webpack.webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.webpack.optimize.AggressiveMergingPlugin(),
        new webpack.webpack.optimize.UglifyJsPlugin({
          beautify: true
        })
      ] : []
    }))
    .pipe(gulpIf(!argv.test, uglify({preserveComments: `some`}))) // 圧縮
    .pipe(rename(path => {
      path.dirname = dir[path.basename];
      path.basename = path.basename.replace(`.webpack`, ``);
    }))
    .pipe(gulp.dest(dist));
};