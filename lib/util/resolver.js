'use strict';

var lstatSync = require('fs').lstatSync
  , pathResolve = require('path').resolve;

/**
 * Resolve a file name from a require statement
 *
 * @param code {String} The code with the require statement
 * @param dir  {String} The dir of the file that has the require statement.
 * @return     {String} The file location.
 */
function resolveRequireFile (code, dir) {
  var requirePlace = code.indexOf('require');
  if (requirePlace === -1) return;

  var file = code.slice(requirePlace + 9);
  file = file.slice(0, file.indexOf(')') - 1);

  // Only document local files
  if (file.slice(0, 1) !== '/' && file.slice(0, 2) !== './' &&
      file.slice(0, 3) !== '../') return;

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

module.exports = resolveRequireFile;
