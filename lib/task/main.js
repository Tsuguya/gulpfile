/* eslint-env node, es6 */

import path from 'path';

import browserSync from 'browser-sync';
import watch from 'gulp-watch';

import Manager from '../Manager';
import {nunjucks, postcss, images, babel, webpack, move} from '../build/index';

const reload = browserSync.reload;
const root = path.resolve(`./`);
const base = path.resolve(root, `src`);
const webroot = path.resolve(root, `dist`);
const html = webroot;
const css  = path.resolve(webroot, `css`);
const js   = path.resolve(webroot, `js`);
const img = path.resolve(webroot, `img`);

const manager = new Manager(path.basename(__filename, `.js`));

/** HTML **/

manager.register(`html`, nunjucks({
  src: path.resolve(base, `html/**/*.njk`),
  dist: html
}));

/** CSS **/

manager.register(`postcss`, postcss({
  src: [
    path.resolve(base, `css/**/*.pcss`),
    `!` + path.resolve(base, `css/**/_*.pcss`)
  ],
  dist: css,
  browsers: [`chrome 53`],
  next: {
    features: {
      customProperties: false
    }
  }
}));

/** JavaScript **/

manager.register(`babel`, babel({
  src: path.resolve(base, `js/**/*.es6`),
  dist: js
}));

/** WebPack **/

manager.register(`webpack`, webpack({
  src: path.resolve(base, `js/**/*.webpack.js`),
  dist: js,
  resolve: [ path.resolve(base, `js`) ],
  htmlRoot: webroot
}));

manager.registerSequence(`webpackBuild`, [`webpack`, `html`]);

/** Image **/

manager.register(`images`, images({
  src: path.resolve(base, `img/**/*`),
  dist: img
}));

/** Move **/

manager.register(`move`, move({
  src: [
    path.resolve(base, `*.ico`)
  ],
  dist: webroot
}));

/** Run & Watch **/

manager.register(null, () => {
  manager.run(`move`);

  const src = {
    html: path.resolve(base, `html/**/*.njk`),
    babel: path.resolve(base, `js/**/*.es6`),
    postcss: path.resolve(base, `css/**/*.pcss`),
    webpackBuild: [
      path.resolve(base, `js/**/*.js`),
      `!` + path.resolve(base, `js/**/*.es6`),
      `!` + path.resolve(base, `js/test/**/*`)
    ]
  };

  const keys = Object.keys(src);

  manager.run(keys);

  keys.forEach(key => watch(src[key], {readDelay: 500}, () =>
    manager.run(key, reload)
  ));

  browserSync({
    notify: false,
    logPrefix: `[BS] - ${path.basename(__filename, `.js`)} - :`,
    server: {
      baseDir: webroot
    },
    port: 3000
  });
});

export default manager;
