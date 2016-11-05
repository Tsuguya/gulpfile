import gulp from 'gulp';
import cache from 'gulp-cache';

import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

export default args => {
  const {src, dist, pngOption={quality: `90-100`, speed: 1}} = args;

  return () => gulp.src(src)
    .pipe(cache(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      pngquant(pngOption),
      imagemin.svgo()
    ])))
    .pipe(gulp.dest(dist));
};