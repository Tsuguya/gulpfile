import runSequence from 'run-sequence';
import gulp from 'gulp';

import pfx from './pfx';

class Manager {

  constructor(prefix) {
    this.p = pfx(prefix);
  }

  run(name, cb) {

    const arr = Array.isArray(name)
      ? this.deepMap(name)
      : [this.p(name)];

    if(cb) {
      return runSequence(arr, cb);
    } else {
      return runSequence(arr);
    }
  }


  register(name, cb) {
    const taskName = name ? this.p(name) : this.p();
    gulp.task(taskName, cb);
  }

  registerSequence(name, ...taskList) {
    gulp.task(this.p(name, () =>
      runSequence(this.deepMap(taskList))
    ));
  }

  deepMap(arr) {
    return arr.map(item => {
      if(Array.isArray(item)) {
        return this.deepMap(item);
      } else if(typeof item === `string`) {
        return this.p(item);
      } else {
        return this.p();
      }
    });
  }

}

export default Manager;