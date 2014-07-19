'use strict';

var fs = require('fs')
  , path = require('path')
  , async = require('async');

function save (dir, doc, cb) {
  var files = Object.keys(doc)
    , filesToWrite = [];

  files.forEach(function (file) {
    filesToWrite.push(function (callback) {
      fs.writeFile(path.resolve(dir, file), doc[file], callback);
    });
  });

  async.parallel(filesToWrite, cb);
}

module.exports = save;
