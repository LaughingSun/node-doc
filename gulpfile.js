var gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , jscs = require('gulp-jscs')
  , mocha = require('gulp-mocha');

var paths = {
  src: './lib/**/*.js',
  test: './test/**/*.test.js',
};

gulp.task('default', ['dev']);
gulp.task('dev', ['lint', 'test', 'watch']);

gulp.task('watch', function () {
  gulp.watch([paths.src, paths.test], ['test']);
});

gulp.task('test', function () {
  gulp.src(paths.test)
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'dot',
      timeout: 50
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
