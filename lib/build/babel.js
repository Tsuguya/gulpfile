/*eslint-env node */
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import gulpIf from 'gulp-if';

import argv from './common/argv';

import babel from 'gulp-babel';

export default args => {
  const {src, dist} = args;

  return () => {
    gulp.src(src)
      .pipe(plumber())
      .pipe(babel())
      .pipe(gulpIf(!argv.test, uglify({preserveComments: `some`})))
      .pipe(rename(path => {
        path.extname = `.js`;
      }))
      .pipe(gulp.dest(dist));
  };
};