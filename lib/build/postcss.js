import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import filter from 'gulp-filter';

import postcss from 'gulp-postcss';
import atImport from 'postcss-import';
import nested from 'postcss-nested';
import short from 'postcss-short';
import cssnext from 'postcss-cssnext';
import doiuse from 'doiuse';
import mqpacker from 'css-mqpacker';
import idents from 'postcss-merge-idents';
import csswring from 'csswring';

export default args => {
  const {src, dist, browsers = `Android >= 5.0, ios >= 7`, next = {}} = args;

  Object.assign(next, {browsers: browsers});

  const processors = [
    atImport(),
    nested(),
    short(),
    cssnext(next),
    doiuse(browsers),
    mqpacker({sort: true}),
    idents(),
    csswring()
  ];

  return () => {
    gulp.src(src)
      .pipe(filter(file => file.relative[0] !== `_`))
      .pipe(plumber())
      .pipe(postcss(processors))
      .pipe(rename({
        suffix: `.min`,
        extname: `.css`
      }))
      .pipe(gulp.dest(dist));
  };
};