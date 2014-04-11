var commentParser = require('./comment');

/**
 * Parse an file into an array of doc objects.
 * @public
 *
 * @param  file {String}  Source file.
 * @param  pv   {Boolean} Wether or not to show private comments.
 * @return      {Array}   All doc comments in an file in objects.
 */
function parseFile (file, pv) {
  if (typeof file !== 'string') throw new Error('Input file not a string');

  var lines = trimArray(file.split('\n'));

  var commentStart = -1
    , commentEnd = -1
    , comments = []
    , doc = [];

  // Detect comments
  lines.forEach(function (line, i) {
    if (commentStart === -1 && line.indexOf('/**') > -1) commentStart = i;

    if (line.indexOf('*/') > -1) {
      commentEnd = i;

      // Allow for one line comments
      if (commentStart === commentEnd) commentEnd++;

      comments.push({start: commentStart, end: commentEnd});

      commentStart = -1;
    }
  });

  // Convert comments into doc objects
  comments.forEach(function (comment) {
    var commentLines = lines.slice(comment.start, comment.end)
      , info = detectCodeInfo(lines.slice(comment.end));

    comment = commentParser(commentLines, info);

    if (!comment.access || comment.access === 'public' ||
        (comment.access === 'private' && pv === true)) {
      doc.push(comment);
    }
  });

  return doc;
}

module.exports = parseFile;

/**
 * Get information from lines of code in an array.
 * @private
 *
 * @param  lines  {Array}  The lines of code to get information of.
 * @return        {Object} Object with code information.
 * @return .type  {String} Function or variable type.
 * @return .name  {String} Name of the function or variable.
 */
function detectCodeInfo (lines) {
  var line = ''
    , code;

  for (var i = 0, j = lines.length - 1; i <= j; i++) {
    line += ' ' + (code = lines[i]);

    if (code.indexOf('/**') > -1 || code.indexOf(';') > -1 ||
        code.indexOf('{') > -1 || code.indexOf('}') > -1) break;
  }

  var pt = line.indexOf('prototype')
    , fn = line.indexOf('function')
    , vr = line.indexOf('var')
    , name = '';

  if (pt > -1) {
    line = line.slice(pt + 10).trim();
    name = line.slice(0, line.indexOf('=')).trim();

    return {
      type: 'Function',
      name: name
    };
  } else if (fn > -1) {
    if (vr < 0) {
      line = line.slice(fn + 8).trim();
      name = line.slice(0, line.indexOf(' ')).trim();
    } else {
      // Assigned function to variable, like: var myFunction = function () {};
      line = line.slice(vr + 4).trim();
      name = line.slice(0, line.indexOf(' ')).trim();
    }

    return {
      type: 'Function',
      name: name
    };
  } else if (vr > -1) {
    line = line.slice(vr + 4).trim();
    name = line.slice(0, line.indexOf(' ')).trim();

    return {
      type: detectVarType(line),
      name: name
    };
  }

  // Code detection unsuccessful
  return {};
}

/**
 * Detect the type of the variable.
 * @private
 *
 * @param  line {String} The line with the variable to detect the type of.
 * @return      {String} Type of the variable.
 */
function detectVarType (line) {
  var assignVar = line.indexOf('=');

  // No assignment, defaults to undefined
  if (assignVar === -1) return 'Undefined';

  line = line.slice(assignVar + 1);

  // Let V8 do the actual detection
  var vr = (typeof new Function ('return ' + line)());
  vr = vr.charAt(0).toUpperCase() + vr.slice(1);

  return vr;
}

/**
 * Trim all strings in an array. Expects only strings in the array!
 * @private
 *
 * @param  array {Array} The array to trim.
 * @return       {Array} Array with trimmed strings.
 */
function trimArray (array) {
  for (var i = array.length; i--;) {
    array[i] = array[i].trim();
  }

  return array;
}
