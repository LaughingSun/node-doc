'use strict';

var path = require('path')
  , fs = require('fs')
  , async = require('async')
  , constructor = require('../constructor')
  , commentParser = require('./comment')
  , clone = require('../util/clone')
  , merge = require('../util/merge')
  , resolveRequireFile = require('../util/resolver')
  , detectCodeInfo = require('../util/codeinfo')
  , handleFileError = require('../util/handler');

/**
 * @todo
 * - Detect "global todos" inside a function statement and assign it the function.
 *   Instead of the global todos.
 * - Add comments to global namespace if no code is on the next line, like this comment
 * - Detect all examples and place them in an example dir
 * - In doc & example dir only drop files with Node-doc signature (auto generated at
 *   the top of the file)
 * - Throw an error if params in comment and in code don't match up
 * - Improve error handling, the line of the file etc.. easier for dev to locate their error
 */

/**
 * @callback parseFileCallback
 *
 * @param err        {Error}  A possible error.
 * @param commentDoc {Object} Documentation comment object or undefined for no comment.
 */

/**
 * Parse an file into an array of doc objects.
 *
 * @param  sourceCode       {String}            Source file.
 * @param [options]         {Object}            Options.
 * @param [options.private] {Boolean}           Whether or not to show private comments.
 * @param  callback         {parseFileCallback}
 */
function parseFile (file, options, cb) {
  // Allow options to be skipped
  if (!cb) {
    cb = options;
    options = {};
  }

  if (typeof file !== 'string') return cb(new Error('Input file location not a string'));

  // In case no name was supplied
  if (!options.name) {
    // Get the name from the file path
    options.name = path.basename(file, '.js');

    // In cause of an index file get the folder's name
    if (options.name === 'index') options.name = path.basename(path.dirname(file));
  }

  fs.readFile(file, 'utf8', function (err, code) {
    if (err) return cb(handleFileError(err, file));

    // No code, no documenting
    if (code.length === 0) return cb();

    // In cause of a "holder file", like index.js in root of this module
    var holderFile = code.indexOf('module.exports = require');
    if (holderFile !== -1) {
      // Drop everything up to the require call
      code = code.slice(holderFile + 17);

      var requireFile = getRequirePath(code);

      if (requireFile) {
        requireFile = resolveRequireFile(requireFile, path.dirname(file));
        if (requireFile) return parseFile(requireFile, options, cb);
      }
    }

    async.parallel({
      comments: function (cb) {
        getComments(code, cb);
      },
      requires: function (cb) {
        getRequires(code, cb);
      },
      codeInfo: function (cb) {
        getCodeInfo(code, cb);
      }
    }, function (err, results) {
      if (err) return cb(err);

      var requires = results.requires
        , comments = mergeComments(results.codeInfo, results.comments)
        , requireNamespaces = {}
        , root = path.dirname(file);

      requires.forEach(function (obj) {
        var file = resolveRequireFile(obj.file, root);

        requireNamespaces[path.basename(file, '.js')] = function (cb) {
          var opt = clone(options);

          // Let the parser know it's about a namespace
          opt.ns = true;

          // Determine the name assigned to the require call
          opt.name = obj.name;

          parseFile(file, opt, cb);
        };
      });

      async.parallel(requireNamespaces, function (err, namespaces) {
        if (err) return cb(err);

        // Construct a documentation object
        var doc = constructor(options, comments, namespaces, getExportsName(code));

        cb(null, doc);
      });
    });
  });
}

module.exports = parseFile;

/**
 * Merge the code information with the comments.
 *
 * @param codeInfo {Array}
 * @param comments {Array}
 */
function mergeComments (codeInfo, comments) {
  comments.forEach(function (comment) {
    var name = comment.name;

    // Try to merge the comment with some of the code information
    for (var i = codeInfo.length; i--;) {
      if (codeInfo[i].name === name) return codeInfo[i] = merge(codeInfo[i], comment);
    }

    // Couldn't merge it, just add it
    codeInfo.push(comment);
  });

  return codeInfo;
}

/**
 * Get the name of the exported variable.
 *
 * @param  code {String} The code from the file.
 * @return      {String} The name of the variable that get's exported.
 */
function getExportsName (code) {
  // Get the first line with module.exports or just exports
  var start = code.indexOf('module.exports');
  if (start === -1) start = code.indexOf('exports');

  return detectCodeInfo(code.slice(start)).name;
}

/**
 * @callback getCommentsCallback
 *
 * @param err      {Error} A possible error.
 * @param requires {Array} All comments.
 */

/**
 * Get comments from the code.
 *
 * @param  code {String}              The code from the file.
 * @param  cb   {getCommentsCallback} The async callback.
 */
function getComments (code, cb) {
  var lines = code.split('\n')
    , comments = []
    , commentStart = 0
    , error = false;

  lines.forEach(function (line, i) {
    if (error === true) return;

    if (line.indexOf('/**') !== -1) commentStart = i;

    if (line.indexOf('*/') !== -1) {
      // Join the lines where the comment was found
      // And the drop everything outside of /** & */
      var comment = lines.slice(commentStart, i + 1).join('\n');
      comment = comment.slice(comment.indexOf('/**'), comment.indexOf('*/') + 2);

      // Code starting after the comments */
      var info = detectCodeInfo(lines.slice(i).join('').slice(line.indexOf('*/') + 2));

      commentParser(comment, info, function (err, commentDoc) {
        if (err) {
          // Stop the function
          error = true;

          // Better error message
          err.message = err.message.split('.')[0] + '. On line ' + i + ' of the file';
          return cb(err);
        }

        // In case of documentation and it to the array
        if (commentDoc) comments.push(commentDoc);
      });
    }
  });

  if (error === false) cb(null, comments);
}

/**
 * @callback getRequiresCallback
 *
 * @param err      {Error} A possible error.
 * @param requires {Array} All require call with local files and a name.
 */

/**
 * Get all require calls.
 *
 * @todo Accept requires called with a variable
 *
 * @param  code {String}              The code from the file.
 * @param  cb   {getRequiresCallback}
 */
function getRequires (code, cb) {
  code = code.replace('\n', '');

  var requires = []
    , requirePlace, file, name;

  // No correct first NPM module then local module, doesn't find local module
  // Return undefined and stops after NPM module
  while ((requirePlace = code.indexOf('require')) !== -1) { // Assignment!
    file = getRequirePath(code.slice(requirePlace));

    if (file) {
      // Get the name of the variable the require call is assigned to
      /** @todo Test require assigned to nothing, example: ```require('should');``` */
      name = code.slice(0, requirePlace);
      name = name.slice(0, name.lastIndexOf('=')).trim();
      name = name.slice(name.lastIndexOf(' ')).trim();

      // Only add local files to the array
      if (file.slice(0, 1) === '/' || file.slice(0, 2) === './' ||
          file.slice(0, 3) === '../') requires.push({file: file, name:name});
    }

    code = code.slice(requirePlace + 1);
  }

  return cb(null, requires);
}

/**
 * Get the require path from a piece of code.
 *
 * @param  code {String} The code containing the require call.
 * @return      {String} The file from the require call.
 */
function getRequirePath (code) {
  // drop: "require(" & ")", so we're left the the require path
  var file = code.slice(8);
  file = file.slice(0, file.indexOf(')'));

  var start = file.slice(0, 1)
    , end = file.slice(-1);

  if ((start === '\'' && end === '\'') || (start === '"' && end === '"')) {
    // Drop the " or ', so the string contents remains
    file = file.slice(1, -1);
  } else {
    /** @todo What to do with variables */
    // Currently we're just not documenting that file :(
    return;
  }

  // Don't document package.json and only document local files
  if (file.indexOf('package.json') === -1 && (
      file.slice(0, 2) !== './' ||
      file.slice(0, 3) !== '../' ||
      file.slice(0, 1) !== '/')) {
    return file;
  }
}

/**
 * @callback getCodeInfoCallback
 *
 * @param err      {Error} A possible error.
 * @param codeInfo {Array} All code information object.
 */

/**
 * Get code information about every line.
 *
 * @param  code {String}              The code from the file.
 * @param  cb   {getCodeInfoCallback}
 */
function getCodeInfo (code, cb) {
  code = dropComments(code).trim();

  var lines = trimArray(code.split('\n'))
    , codeInfo = []
    , indentLevel = 0;

  lines.forEach(function (line) {
    var indentIncrease = false;
    if (line.indexOf('{') !== -1) {
      indentIncrease = true;
      indentLevel++;
    }

    if (line.indexOf('}') !== -1) indentLevel--;

    if (indentIncrease === false && indentLevel > 0) return;
    if (line === '}' || line === '};') return;

    var info = detectCodeInfo(line);

    codeInfo.push(info);
  });

  cb(null, codeInfo);
}

/**
 * Drop comments from code.
 *
 * @param  code {String} The code with comments.
 * @return      {String} The code without any comments.
 */
function dropComments (code) {
  var end = 0;

  while (code.indexOf('/**') !== -1) {
    end = code.indexOf('*/');
    /** @todo Test with none closing tag */
    //if (end === -1) end = code.length - 2;
    code = code.slice(end + 2).trim();
  }

  return code.trim();
}

/**
 * Trim an array. Drop empty items and trim the items.
 *
 * @param  array {Array} The array to trim.
 * @return       {Array} The trimmed array.
 */
function trimArray (array) {
  var result = [];

  array.forEach(function (item) {
    item = item.trim();
    if (item !== '') result.push(item);
  });

  return result;
}
