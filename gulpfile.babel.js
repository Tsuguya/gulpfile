/* eslint-env node */
import path from 'path';
import minimist from 'minimist';
import requireDir from 'require-dir';
import gulp from 'gulp';

const argv = minimist(process.argv.slice(2));
// 引数に --test only と入力した場合、テストタスクのみ実行
const defaultTask = `$$`;
const runTarget = (argv.test && argv.test === `only`) ? `test` : defaultTask;

const tasks = (() => {
  const obj = requireDir(path.resolve(`lib/task`));
  return Object.keys(obj).map(k => obj[k].default);
})();

const defaults = tasks
  .filter(manager => manager.p.has(runTarget))
  .map(manager => manager.p(runTarget));

argv._.forEach(argmentTaskName => {
  if(argmentTaskName === `default`)
    return;

  const lists = tasks
    .filter(manager => manager.p.has(argmentTaskName))
    .map(manager => manager.p(argmentTaskName));

  if(lists.length !== 0)
    gulp.task(argmentTaskName, lists, () => console.info(`task`, argmentTaskName));
});

gulp.task(`default`, defaults);
