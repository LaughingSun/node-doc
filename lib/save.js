'use strict';

var fs = require('fs')
  , path = require('path')
  , rimraf = require('rimraf')
  , mkdirp = require('mkdirp')
  , async = require('async');

function save (dir, doc, cb) {
  // Clean output dir
  rimraf(dir, function (err) {
    if (err) return cb(err);

    // Create output dir
    mkdirp(dir, function (err) {
      if (err) return cb(err);

      var files = Object.keys(doc)
        , filesToWrite = [];

      // Get all files to write and put them in an array
      files.forEach(function (file) {
        filesToWrite.push(function (callback) {
          fs.writeFile(path.resolve(dir, file), doc[file], callback);
        });
      });

      // Start writing files
      async.parallel(filesToWrite, cb);
    });
  });
}

module.exports = save;
