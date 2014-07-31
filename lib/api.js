'use strict';

var resolve = require('path').resolve
  , merge = require('sak-merge')
  , clone = require('sak-clone')
  , fileParser = require('./parsers/file')
  , prepareMarkdown = require('./converters/markdown')
  //, prepareHTML = require('./converters/html')
  , prepareJson = require('./converters/json')
  , save = require('./save');

/**
 * @callback parserCallback
 *
 * @param err {Error}  A possible error.
 * @param doc {Object} Documentation object in json, markdown or html.
 */

/**
 * Parses source files into an documententation. This can be outputted in an
 * json object, Github flavored Markdown or HTML.
 *
 * @param [options]         {Object}         Object with options
 * @param [options.output]  {String}         The dir to output the documentation.
 * @param [options.result]  {String}         The type of result html or markdown.
 * @param [options.private] {Boolean}        Wether or not to show private doc.
 * @param  callback         {parserCallback} The callback function.
 */
function parser (options, cb) {
  // Allow options to be skipped
  if (!cb) {
    cb = options;
    options = {};
  }

  var output = options.output
    , result = options.result ? options.result.toLowerCase() : undefined;

  if (result && result !== 'markdown' && result !== 'html') return cb(new Error('Result can only be Markdown or HTML'));

  var pkg = getPackage()
    , path = resolve(process.cwd(), pkg.main || 'index.js');

  // Merge the package.json information with the given options
  options = merge(pkg, options);

  fileParser(path, options, function (err, doc) {
    if (err) return cb(err);

    var returnResult;

    if (result === 'markdown') {
      doc = prepareMarkdown(doc);

      // Return only the readme
      returnResult = doc['README.md'];
    } else if (result === 'html') {
      doc = prepareHTML(doc);

      // Return only the index
      returnResult = doc['index.html'];
    } else {
      returnResult = clone(doc);
    }

    if (output) {
      if (!result) doc = prepareJson(doc);

      return save(options.output, doc, function (err) {
        if (err) return cb(err);

        cb(null, returnResult);
      });
    }

    cb(null, returnResult);
  });
}

module.exports = parser;

// Also export the file parser
parser.prototype.file = fileParser;

/**
 * Get the package information of the code.
 *
 * @return {Object} The package information object from package.json or an
 *                  empty object in case the code has no package.json.
 */
function getPackage () {
  var path = resolve(process.cwd(), 'package.json')
    , pkg;

  // Try to get the package.json file
  try {
    pkg = require(path);
  } finally {
    return pkg || {};
  }
}
