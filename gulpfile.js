'use strict';

var gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , jscs = require('gulp-jscs')
  , mocha = require('gulp-mocha');

// All paths used
var paths = {
  src: './lib/**/*.js',
  test: './test/**/*.test.js',
  watchTest: './test/**/*.js'
};

gulp.task('default', ['dev']);
gulp.task('dev', ['test', 'watch']);

// Watch source & test files and test on any changes
gulp.task('watch', function () {
  gulp.watch([paths.src, paths.watchTest], ['test']);
});

// Run tests
gulp.task('test', function () {
  gulp.src(paths.test)
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'dot',
      timeout: 50
    }))
    // Mocha already logs the errors
    .on('error', function () {});
});

// Lint source files
gulp.task('lint', function () {
  gulp.src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jscs());
});
