'use strict';

var lstatSync = require('fs').lstatSync
  , pathResolve = require('path').resolve;

/**
 * Resolve a file to an absolute file location.
 *
 * @param file {String} The string from the require call.
 * @param dir  {String} The dir of the file that has the require statement.
 * @return     {String} The absolute file location.
 */
function resolveFile (file, dir) {
  file = pathResolve(dir, file);

  var stats;
  try {
    stats = lstatSync(file);

    if (stats.isDirectory()) {
      file += '/index';

      // Throw so we test if dir/index.js exists
      throw new Error('');
    }
  } catch (err) {
    if (file.slice(-3) !== '.js') {
      file += '.js';

      try {
        stats = lstatSync(file);
      } catch (err) {
        file = undefined;
      }
    }
  }

  return file;
}

module.exports = resolveFile;
