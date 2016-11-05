import gulp from 'gulp';

export default args => {
  const {src, dist} = args;

  return () => gulp.src(src)
    .pipe(gulp.dest(dist));
};