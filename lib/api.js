'use strict';

var fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , fileParser = require('./parsers/file')
  , commentParser = require('./parsers/comment')
  , tagParser = require('./parsers/tag')
  , toMarkdown = require('./markdown');

/**
 * Parses a file or a whole directory into an documententation. This can be
 * outputted in an object or in Github flavored Markdown.
 * @public
 *
 * @param  input             {String} The directory with source files or single source file.
 * @param  [output]          {String} The directory to write the output to.
 * @param  [options]         {Object} Object with options
 * @param  [options.result]  {String} The type of result wanted, object or markdown.
 * @param  [options.private] {Boolean} Wether or not to show private doc.
 * @return                   {Object|String} Object or string (Markdown) with the results.
 */
function parser (input, output, options) {
  input = path.normalize(input);

  var inputStat = fs.statSync(input)
    , doc = {}
    , files = []
    , single = false
    , rootStart = 0;

  if (output && typeof output === 'object') output = options + (options = output, 0);

  options = options || {};
  var result = (options.result || 'json').toLowerCase()
    , pv = options.private || false;

  if (result !== 'json' && result !== 'markdown') throw new Error('Result can only be markdown or json');

  if (output && isDir(input) && !isDir(output)) throw new Error('Output need to be a directory if input is an directory');

  if (inputStat.isFile()) {
    files = [input];
    single = true;
    rootStart = input.length - path.basename(input).length;
  } else {
    files = getFilesRecursive(input);
    rootStart = input.length;
  }

  files.forEach(function (file) {
    var name = path.basename(file, '.js')
      , sourceFile = fs.readFileSync(file, 'utf-8')
      , sub = file.slice(rootStart, file.lastIndexOf('.'));

    if (single) single = name;

    var comment = fileParser(sourceFile, pv);

    if (comment.length !== 0) {
      // Check for subddir
      if (name !== sub) {
        sub = sub.slice(0, sub.indexOf(name) - 1);

        doc[sub] = doc[sub] || {IGNORE: true};
        doc[sub][name] = comment;
      } else {
        doc[name] = comment;
      }
    }
  });

  if (result === 'markdown') doc = toMarkdownRecursive(doc);

  if (output) {
    // Remove dir if exists
    try {
      rimraf.sync(output);
    } catch (err) {}

    var ext = (result === 'markdown') ? '.md' : '.json';
    saveFileRecursive(output, ext, doc);
  }

  if (result !== 'markdown') {
    var i, j;
    for (i in doc) {
      for (j in doc[i]) {
        if (j === 'IGNORE') delete doc[i][j];
      }
    }
  }

  if (single !== false) doc = doc[single];

  return doc;
}

parser.prototype.file = fileParser;
parser.prototype.comment = commentParser;
parser.prototype.tag = tagParser;
parser.prototype.markdown = toMarkdown;

module.exports = parser;

/**
 * Check if file or dir is an directory.
 * @private
 *
 * @param input {String} Directory or file, needs to end with '/'.
 * @return {Boolean} Wether the input is a directory or not.
 */
function isDir (input) {
  return (input.lastIndexOf(path.sep) > input.lastIndexOf('.'));
}

/**
 * Get all files in an directory recursive.
 * @private
 *
 * @param dir {String} Directory to get all file from.
 * @return {Array} Array with files.
 */
function getFilesRecursive (dir) {
  var files = []
    , input = fs.readdirSync(dir);

  input.forEach(function (file) {
    var stats = fs.statSync(path.join(dir, file));

    if (stats.isDirectory()) {
      files = files.concat(getFilesRecursive(path.join(dir, file)));
    } else if (file.slice(-2) === 'js') {
      files.push(path.join(dir, file));
    }
  });

  return files;
}

/**
 * Convert an object to markdown recursively.
 * @private
 *
 * @param doc {Object} Comment object from parse file.
 * @return {Object} Object with markdown strings.
 */
function toMarkdownRecursive (doc) {
  for (var file in doc) {
    if (file === 'IGNORE') continue;

    doc[file] = recursiveCheck(doc[file]) ? toMarkdownRecursive(doc[file]) : toMarkdown(file, doc[file]);
  }

  return doc;
}

/**
 * Save a file recursively.
 * @private
 *
 * @param root {String} Root directory.
 * @param ext {String} Extention to use.
 * @param doc {Object} Files with object keys as names.
 */
function saveFileRecursive (root, ext, doc) {
  var dir = isDir(root)
    , save, content;

  mkdirp.sync(dir ? root : path.dirname(root));

  for (var file in doc) {
    if (file === 'IGNORE') continue;

    content = doc[file];

    if (recursiveCheck(content)) {
      saveFileRecursive(path.join(root, file), ext, content);
    } else {
      if (ext === '.json') content = JSON.stringify(content, null, 2);

      save = path.normalize(dir ? path.join(root, file) + ext : root);

      fs.writeFileSync(save, content);
    }
  }
}

/**
 * Check if it's an recursive object.
 * @private
 *
 * @param obj {Object} Possible recursive object.
 * @return {Boolean} Wether or not it's recursive.
 */
function recursiveCheck (obj) {
  return (typeof obj === 'object' && obj.IGNORE === true);
}
