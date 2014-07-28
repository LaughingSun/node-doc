'use strict';

/**
 * @todo Document each item on an object.
 *
 * @example
 * exports = {
 *   function: function () {},
 *   variable: 'string'
 * };
 */

/**
 * Get information from code.
 *
 * @param   code     {String}           The code to get information of.
 * @return           {Object}           Object with code information.
 * @return .access   {String}           Whether the access is public or private.
 * @return .constant {String|Undefined} Whether it's a constant or not.
 * @return .exports  {String|Undefined} Whether it's get exported or not.
 * @return .name     {String|Undefined} Name of the function or variable.
 * @return .type     {String|Undefined} Function or variable type.
 */
function detectCodeInfo (code) {
  // Get a single line of code
  var line = lineEnd(code);

  // Whether or not the function/variable gets exported
  var vr = line.indexOf('var')
    , pt = line.indexOf('prototype')
    , fn = line.indexOf('function')
    , mXp = line.indexOf('module.exports')
    , xp = line.indexOf('exports')
    , exports = (xp > -1) ? true : false
    , name, type;

  if (vr > -1) {
    // Drop 'var ' from the line
    name = line.slice(vr + 4);

    // If the variable gets assigned anything
    if (name.indexOf(' ') > -1) name = name.slice(0, name.indexOf(' '));

    name = name.trim();

    var split = line.indexOf('=') + 1;
    if (split === 0) split = line.indexOf(name) + name.length;

    // Drop '=' from the line, so only the assignment is left
    // Or in case of no assignment, just check the rest of the line
    type = detectVarType(line.slice(split));
  } else if (pt > -1) {
    // Drop '$name.prototype.' from the line
    name = line.slice(pt + 10);
    // Drop the assignment from the name
    name = name.slice(0, name.indexOf('=')).trim();
    if (name === '') name = undefined;

    // Drop '=' from the line, so only the assignment is left
    type = detectVarType(line.slice(line.indexOf('=') + 1));
  } else if (fn > -1) {
    // Drop 'function ' from the line
    name = line.slice(fn + 9);
    name = name.slice(0, name.indexOf(' ')).trim();

    // If it take the param parentheses are the name
    if (name.slice(0, 1) === '(' && (name.slice(-1) === ')' || name.slice(-1) === ',')) name = undefined;

    // Check for callback
    var comma = line.indexOf(',');
    // Comma before function, useally indicates an callback function
    if (comma !== -1 && comma < fn) {
      type = 'Callback';
    } else if (name) {
      var first = name.slice(0, 1);
      type = first !== '_' && first.toUpperCase() === first ? 'Constructor': 'Function';
    } else {
      type = 'Function';
    }
  }

  if (mXp > -1) {
    // Can't detect name
    // Maybe assignment of variable?
    line = line.slice(line.indexOf('=') + 1).trim();

    // Drop '=' from the line, so only the assignment is left
    type = detectVarType(line);

    // If module.exprts get a variable assigned, use that variable's name
    if (!type && line.indexOf('(') === -1) name = line;
  } else if (xp > -1) {
    // Drop 'exports.' from the line
    name = line.slice(xp + 8);
    // Drop the assignment from the name
    name = name.slice(0, name.indexOf('=')).trim();

    // Drop '=' from the line, so only the assignment is left
    type = detectVarType(line.slice(line.indexOf('=') + 1).trim());
  }

  var access = (type === 'Callback' || (name && name.slice(0, 1) === '_')) ? 'private' : 'public'
    , constant = (name && name.toUpperCase() === name) ? true : false;

  return {
    access: access,
    constant: constant,
    exports: exports,
    name: name,
    type: type
  };
}

module.exports = detectCodeInfo;

/**
 * Detect the type of the variable.
 *
 * @todo What to do with require?
 *
 * @param  line {String}           The line with the variable to detect the type.
 * @return      {String|Undefined} Type of the variable or undefined if the
 *                                 detection was unsuccessful.
 */
function detectVarType (line) {
  line = line.trim();

  if (line.length === 0) return 'Undefined';

  // Function assignment requires spaces around it,
  // this allows 'function' to be used in variable names
  if (line.indexOf('function ') > -1) return 'Function';
  if (line.slice(0, 1) === '\'' || line.slice(0, 1) === '"') return 'String';
  if (line.slice(0, 4).toLowerCase() === 'true' || line.slice(0, 5).toLowerCase() === 'false') return 'Boolean';
  if (line.length === 0 || line.slice(0, 9).toLowerCase() === 'undefined') return 'Undefined';
  if (line.slice(0, 4).toLowerCase() === 'null') return 'Null';
  if (line.slice(0, 1) === '{') return 'Object';
  if (line.slice(0, 1) === '[') return 'Array';
  if (parseInt(line, 10).toString() === line) return 'Number';

  var split = line.split('.');
  if (split.length === 2 && parseInt(split[0], 10).toString() === split[0] &&
      parseInt(split[0], 10).toString() === split[0]) {
    return 'Float';
  }

  // Detection unsuccesful
  return undefined;
}

/**
 * Get the code until the first line end.
 *
 * @param code {String} The rest of the code.
 * @return     {String} A single line.
 */
function lineEnd (code) {
  var end = code.length
    , ends = [code.indexOf(';'), code.indexOf('{'), code.indexOf('}'), code.indexOf('/**')];

  // Find the end of the line
  for (var i = ends.length; i--;) {
    if (ends[i] !== -1 && ends[i] < end) end = ++ends[i];
  }

  var line = code.slice(0, end).replace('\n', '');

  if (line.slice(-1) === ';' || line.slice(-1) === '/') line = line.slice(0, -1);

  return line;
}
