var fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , fileParser = require('./parsers/file')
  , commentParser = require('./parsers/comment')
  , tagParser = require('./parsers/tag')
  , toMarkdown = require('./markdown');

/**
 * @title Parser
 * @desc Parses a file or a whole directory to an documententation. This can be
 *       outputted in an object or in Markdown (Github flavored).
 * @public
 *
 * @param input {String} The directory of the source files get documention from.
 * @param [output] {String} The directory to write the output to.
 * @param [result] {String} The type of result wanted: object or markdown.
 * @return {Object|String} Object or string (Markdown) with the results.
 */
function parser (input, output, result) {
  var inputStat = fs.statSync(input)
    , doc = {}
    , files = []
    , single = false;

  if (output && output === 'markdown') output = result + (result = output, 0);

  result = (result || 'json').toLowerCase();

  if (result !== 'json' && result !== 'markdown') throw new Error('Result can only be markdown or json');

  if (output && isDir(input) && !isDir(output)) throw new Error('Output need to be a directory if input is an directory');

  if (inputStat.isFile()) {
    files = [input];
    single = true;
  } else {
    files = getFilesRecursive(path.normalize(input) + '/');
  }

  var inputLength = input.length;
  if (input.slice(-1) !== '/') inputLength++;

  files.forEach(function (file) {
    var name = path.basename(file, '.js')
      , lines = fs.readFileSync(file, 'utf-8').split('\n')
      , sub = file.slice(inputLength);

    if (single) single = name;

    if (sub.indexOf('/') > 0) {
      sub = sub.slice(0, sub.indexOf('/'));
      doc[sub] = doc[sub] || {IGNORE: true};
      doc[sub][name] = fileParser(lines);
    } else {
      doc[name] = fileParser(lines);
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

  if (single !== false) doc = doc[single];

  return doc;
}

parser.prototype.file = fileParser;
parser.prototype.comment = commentParser;
parser.prototype.tag = tagParser;
parser.prototype.markdown = toMarkdown;

module.exports = parser;

/**
 * @title Is dir
 * @desc Check if file or dir is an directory.
 * @private
 *
 * @param input {String} Directory or file, needs to end with '/'.
 * @return {Boolean} Wether the input is a directory or not.
 */
function isDir (input) {
  return (input.lastIndexOf('/') > input.lastIndexOf('.'));
}

/**
 * @title Get files recursive
 * @desc Get all files in an directory recursive.
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
 * @title To Markdown recursive
 * @desc Convert an object to markdown recursively.
 * @private
 *
 * @param doc {Object} Comment object from parse file.
 * @return {Object} Object with markdown strings.
 */
function toMarkdownRecursive (doc) {
  for (var file in doc) {
    if (file === 'IGNORE') continue;

    if (recursiveCheck(doc[file])) {
      doc[file] = toMarkdownRecursive(doc[file]);
    } else {
      doc[file] = toMarkdown(file, doc[file]);
    }
  }

  return doc;
}

/**
 * @title Save file recursive
 * @desc Save a file recursively.
 * @private
 *
 * @param root {String} Root directory.
 * @param ext {String} Extention to use.
 * @param doc {Object} Files with object keys as names.
 */
function saveFileRecursive (root, ext, doc) {
  var dir = isDir(root)
    , save, content;

  mkdirp.sync((!dir) ? path.dirname(root) : root);

  for (var file in doc) {
    if (file === 'IGNORE') continue;

    content = doc[file];

    if (recursiveCheck(content)) {
      doc[file] = saveFileRecursive(path.join(root, file), ext, doc[file]);
    } else {
      if (ext === '.json') content = JSON.stringify(content, null, 2);

      save = (dir) ? path.join(root, file) + ext : root;

      fs.writeFileSync(save, content);
    }
  }
}

/**
 * @title Recursive check
 * @desc Check if it's an recursive object.
 * @private
 *
 * @param obj {Object} Possible recursive object.
 * @return {Boolean} Wether or not it's recursive.
 */
function recursiveCheck (obj) {
  return (typeof obj === 'object' && obj.IGNORE === true);
}
