var path = require('path')
  , gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , jscs = require('gulp-jscs')
  , mocha = require('gulp-mocha');

var paths = {
  src: path.join(__dirname, 'lib/**/*.js'),
  test: path.join(__dirname, 'test/**/*.test.js')
};

gulp.task('default', ['test', 'watch']);

gulp.task('watch', function () {
  gulp.watch([paths.src, paths.test], {interval: 500}, ['lint', 'test']);
});

gulp.task('test', function () {
  gulp.src(paths.test)
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'dot',
      timeout: 200
    }))
    .on('error', function (err) {
      if (err.message.indexOf('failed.') < 0) {
        console.error(err.stack); // no double logging the error
        console.log('');
      }
    });
});

gulp.task('lint', function () {
  gulp.src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jscs())
});
