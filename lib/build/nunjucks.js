import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import gulpIf from 'gulp-if';

import argv from './common/argv';

import nunjucks from 'gulp-nunjucks';
import inlinesource from 'gulp-inline-source';
import htmlmin from 'gulp-htmlmin';
import srcset from 'gulp-sugar-srcset';

const htmlminBaseOption = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  minifyJS: false,
  minifyCSS: true,
  // processScripts: [`text/x-handlebars-template`],
  // customAttrSurround: [/\{\{#[^}]+\}\}/, /\{\{\/[^}]+\}\}/],
  removeScriptTypeAttributes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true
};

export default args => {
  const {src, dist, rootPath, srcsetOption, htmlminOption = {}} = args;

  const htmlminMergedOption = Object.assign({}, htmlminBaseOption, htmlminOption);

  return () => gulp.src(src)
    .pipe(plumber())
    .pipe(nunjucks.compile([], { autoescape: false }))
    .pipe(srcset(srcsetOption))
    .pipe(inlinesource({rootpath: rootPath, compress: false}))
    .pipe(gulpIf(!argv.test, htmlmin(htmlminMergedOption)))
    .pipe(rename({ extname: `.html` }))
    .pipe(gulp.dest(dist));
};