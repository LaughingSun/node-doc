var path = require('path')
  , fs = require('fs')
  , async = require('async')
  , commentParser = require('./comment')
  , clone = require('../util/clone')
  , resolveRequireFile = require('../util/resolver')
  , detectCodeInfo = require('../util/codeinfo');

/**
 * @todo
 * - Getting name:
 *     From package.json
 *     Required file
 *     Assigned variable, module.exports = parseFile, so parseFile
 * - Detect "global todos" in a function statement and assign it the function.
 *   Instead of the global todos.
 * - Detect all examples and place them in an example dir
 * - In doc & example dir only drop files with Node-doc signature (auto generated at
 *   the top of the file)
 * - Throw an error if params in comment and in code don't match up
 * - Error handling
 */

/**
 * @callback parseFileCallback
 *
 * @param err        {Error}  A possible error.
 * @param commentDoc {Object} Documentation comment object or undefined for no comment.
 */

/**
 * Parse an file into an array of doc objects.
 * @public
 *
 * @param  sourceCode       {String}            Source file.
 * @param [options]         {Object}            Options.
 * @param [options.private] {Boolean}           Whether or not to show private comments.
 * @param  callback         {parseFileCallback} The callback function.
 */
function parseFile (file, options, cb) {
  if (!cb) {
    cb = options;
    options = {};
  }

  // Accept an boolean for private an options object
  if (typeof options !== 'object') options = {private: options};

  // Whether to show private comments or not, defaults to not showing
  options.private = options.private || false;

  if (typeof file !== 'string') return cb(new Error('Input file location not a string'));

  fs.readFile(file, 'utf8', function (err, code) {
    if (err) return cb(handleFileError(err, file));

    // No code, no documenting
    if (code.length === 0) return cb();

    // In cause of a "holder file", like index.js in root of this module
    var holderFile = code.indexOf('exports = require(');
    if (holderFile !== -1) {
      code = code.slice(holderFile);
      var requireFile = resolveRequireFile(code, path.dirname(file));

      return requireFile ? parseFile(requireFile, options, cb) : cb();
    }

    async.parallel({
      ns: function (cb) {
        parseRequires(code, path.dirname(file), options, cb);
      },
      doc: function (cb) {
        // Get name from the file path, or in case of index.js the folders name
        var name = path.basename(file, '.js');
        if (name === 'index') name = path.basename(path.dirname(file));

        parseComments(code, name, options, cb);
      },
      exportsName: function (cb) {
        getExportsName(code, cb);
      }
    }, function (err, results) {
      if (err) return cb(err);

      var doc = results.doc
        , ns = results.ns
        , name = results.exportsName;

      if (name) {
        doc.exports = name;

        // Show that a function, constant or callback is exported
        if (doc.functions && doc.functions[name]) doc.functions[name].exports = true;
        if (doc.constants && doc.constants[name]) doc.functions[name].exports = true;
        if (doc.callbacks && doc.callbacks[name]) doc.functions[name].exports = true;
      }

      /** @todo Fix: holder file to empty file, returns undefined */

      // If we need to merge the namespaces with the doc object
      if (ns && Object.keys(ns).length !== 0) {
        var cNs, exportName, exportedValue;

        for (var nsName in ns) {
          cNs = ns[nsName];

          // In case the file has no documentation
          if (!cNs) {
            delete ns[nsName];
            continue;
          }

          exportName = cNs.exports;

          // If something get exported from the namespace
          if (exportName) {
            // Add the exported value in the functions,
            // constants or callback array in the doc
            ['functions', 'constants', 'callbacks'].forEach(function (n) {
              if (cNs[n] && cNs[n][exportName]) {
                exportedValue = clone(cNs[n][exportName]);
                exportedValue.required = true;

                doc[n] = doc[n] || {};

                doc[n][exportedValue.name] = exportedValue;
              }
            });
          }

          // Get all todo recursively
          /** @todo Get all todo recursively */
          if (cNs.todos) {
            console.log(cNs.todos);
          }
        }

        // Add the namespace to the doc
        if (Object.keys(ns).length !== 0) doc.ns = ns;
      }

      cb(null, doc);
    });
  });
}

module.exports = parseFile;

/**
 * Parse comments
 */
function parseComments (code, name, options, callback) {
  var lines = code.split('\n')
    , commentStart = 0
    , doc = {
      name: name
    };

  var cb = function (err, doc) {
    callback(err, doc);

    // No double calling the callback, in cause error
    cb = function () {};
  };

  lines.forEach(function (line, i) {
    if (line.indexOf('/**') !== -1) commentStart = i;

    if (line.indexOf('*/') !== -1) {
      var comment = lines.slice(commentStart, i + 1).join('\n')
          // Code starting at the line '*/' was found, dropping '*/'
        , info = detectCodeInfo(lines.slice(i).join('').slice(line.indexOf('*/') + 2));

      commentStart = 0;

      commentParser(comment, info, function (err, commentDoc) {
        if (err) {
          err.message = err.message.split('.')[0] + '. On line ' + i + ' of the file';
          /** @todo Stop the rest of the function */
          return cb(err);
        }

        // Empty comment
        if (!commentDoc) return;

        // Don't show private comment, unless the user says so
        if (!commentDoc.access || commentDoc.access === 'public' ||
            (commentDoc.access === 'private' && options.private === true)) {
          if (commentDoc.todos) {
            doc.todos = doc.todos || {};

            if (commentDoc.name) {
              // Add the todos to the todo list
              doc.todos[commentDoc.name] = commentDoc.todos;
            } else {
              // Add global todos to the global todos object
              doc.todos.global = doc.todos.global || [];
              doc.todos.global = doc.todos.global.concat(commentDoc.todos);

              // Global todo only, don't add to doc array
              return;
            }
          }

          // In case of no name, default to undefined
          if (!commentDoc.name) commentDoc.name = undefined;

          if (commentDoc.constant && commentDoc.constant === true) {
            doc.constants = doc.constants || {};
            doc.constants[commentDoc.name] = commentDoc;
          }

          // Add the comment documentation
          switch (commentDoc.type) {
            case 'Callback':
              doc.callbacks = doc.callbacks || {};
              doc.callbacks[commentDoc.name] = commentDoc;
              break;

            case 'Function':
            case 'Constructor':
              doc.functions = doc.functions || {};
              doc.functions[commentDoc.name] = commentDoc;
              break;
          }
        }
      });
    }
  });

  cb(null, doc);
}

/**
 * Check requires and parse that (local) file
 *
 * @param sourceCode {String}
 * @param dir        {String}
 * @param options    {Object}
 * @param cb         {Function}
 */
function parseRequires (sourceCode, dir, options, cb) {
  var code = sourceCode.replace('\n', '')
    , files = {}
    , requireFile;

  // Check whether te code has a require statement
  while (requireFile = resolveRequireFile(code, dir)) { // Assignment!
    // Add the file to the list of files we need to parse
    // This function gets called by async
    files[path.basename(requireFile, '.js')] = (function (file, options) {
      return function (callback) {
        parseFile(file, options, callback);
      };
    })(requireFile, options);

    // Drop the require statement so we can search for the next one
    code = code.slice(code.indexOf(requireFile) + 8);
  }

  // In case of no requires
  if (Object.keys(files).length === 0) return cb(null, undefined);

  async.parallel(files, function (err, results) {
    /** @todo Better error handling */
    if (err) return cb(err);

    cb(null, results);
  });
}

/**
 * Get the name of the exported variable in the file
 *
 * @param code {String}
 * @param cb   {Function}
 */
function getExportsName (code, cb) {
  // Get the first line with module.exports or just exports
  var start = code.indexOf('module.exports');
  if (start === -1) start = code.indexOf('exports');

  var exportsName = detectCodeInfo(code.slice(start)).name;

  // No exports
  cb(null, exportsName);
}

/**
 * Handle error by Node's filesystem
 *
 * @param err {Error} The error Node throws
 * @return {Error} A nicly formatted error.
 */
function handleFileError (err, file) {
  switch (err.code) {
    case 'ENOENT':
      err = new Error('File "' + file + '" not found');
      break;
  }

  // Fallback to Node's error
  return err;
}
