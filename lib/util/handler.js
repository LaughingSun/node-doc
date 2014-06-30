'use strict';

/**
 * Handle error by Node's filesystem
 *
 * @param err  {Error}  The error Node throws.
 * @param file {String} The file location.
 * @return     {Error}  A nicly formatted error.
 */
function handleFileError (err, file) {
  // See if we can improve the error message
  switch (err.code) {
    case 'ENOENT':
      err.message = 'File "' + file + '" not found';
      break;
  }

  return err;
}

module.exports = handleFileError;
