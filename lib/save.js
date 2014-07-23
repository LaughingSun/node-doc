'use strict';

var fs = require('fs')
  , path = require('path')
  , rimraf = require('rimraf')
  , mkdirp = require('mkdirp')
  , async = require('async');

/**
 * Save the documentation to a directory.
 *
 * @param dir {String}         The directory to save the documentation.
 * @param doc {Object}         The documentation objects, keys are the file
 *                             name(with extention) and the value is the
 *                             contents of the file.
 * @param cb  {parserCallback} The callback given by the user.
 */
function save (dir, doc, cb) {
  // Clean output dir
  rimraf(dir, function (err) {
    if (err) return cb(err);

    // (Re)create output dir
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

      // Start writing files, once we're done call the callback
      async.parallel(filesToWrite, cb);
    });
  });
}

module.exports = save;
