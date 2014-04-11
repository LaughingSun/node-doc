var parseTag = require('./tag');

/**
 * Parses an array of comment lines.
 * @public
 *
 * @param  lines          {Array}  Source file lines in a array to parse.
 * @param  [comment]      {Object} Object with code information.
 * @param  [comment.type] {String} Type of the var/function in the code.
 * @param  [comment.name] {String} Name of the var/function in the code.
 * @return                {Object} Object with information about the comment.
 */
function commentParser (lines, comment) {
  if (!Array.isArray(lines)) throw new Error('Not an array');

  // From bottom to top, to allow multi line comments
  lines.reverse();

  comment = comment || {};

  var prev = '';

  lines.forEach(function (line) {
    line = line.replace('/**', '').replace('*/', '').replace('*', '').trim();

    if (line.indexOf('@') === 0) {
      var tag = parseTag(line + ' ' + prev);
      prev = '';

      switch (tag.type) {
        case 'access':
        case 'example':
        case 'return':
        case 'this':
          comment[tag.type] = tag.value;
          break;

        case 'callback':
          comment.type = 'Callback';
          comment.name = tag.value.name;
          if (tag.value.desc) comment.desc = tag.value.desc;
          break;

        case 'constant':
          comment.constant = true;

          if (tag.value.type && tag.value.type !== comment.type) {
            throw new Error('Type in doc & code do not match');
          } else if (tag.value.name && tag.value.name !== comment.name) {
            throw new Error('Name in doc & code do not match');
          } else if (tag.value.desc) {
            comment.desc = tag.value.desc;
          }
          break;

        case 'constructor':
          comment.type = 'Constructor';
          break;

        case 'deprecated':
          comment.deprecated = tag.value;
          break;

        case 'param':
          comment.params = comment.params || [];
          comment.params.unshift(tag.value);
          break;

        case 'subparam':
        case 'subreturn':
        case 'subthis':
        case 'throws':
          comment[tag.type] = comment[tag.type] || [];
          comment[tag.type].unshift(tag.value);
          break;

        case 'todo':
          comment.todos = comment.todos || [];
          comment.todos = tag.value.concat(comment.todos);
          break;
      }
    } else {
      // Allow for multiline comments
      prev = (line === '' ? '\n' : line) + ' ' + prev;
    }
  });

  if (prev !== '') comment.desc = (comment.desc || '') + prev.trim();

  if (comment.subparam) {
    comment.subparam.forEach(function (sub) {
      var found = false;

      if (comment.params) {
        comment.params.forEach(function (p, i) {
          if (p.name === sub.master) found = i;
        });
      }

      if (found === false) throw new Error('No param: ' + sub.master);

      var param = comment.params[found];

      if (param.type !== 'Object') throw new Error('Param ' + param.name + ' is not an object');

      param.properties = param.properties || {};
      param.properties[sub.name] = {};

      if (sub.type) param.properties[sub.name].type = sub.type;
      if (sub.desc) param.properties[sub.name].desc = sub.desc;
    });

    delete comment.subparam;
  }

  if (comment.subreturn) {
    if (!comment.return) throw new Error('No master return');
    if (comment.return.type !== 'Object') throw new Error('Return is not an object');
    comment.return.properties = comment.return.properties || {};

    comment.subreturn.forEach(function (sub) {
      var commentReturn = comment.return.properties[sub.name] = {};

      if (sub.type) commentReturn.type = sub.type;
      if (sub.desc) commentReturn.desc = sub.desc;
    });

    delete comment.subreturn;
  }

  if (comment.subthis) {
    comment.this = comment.this || {};
    comment.this.properties = {};

    comment.subthis.forEach(function (sub) {
      var thisProperties = comment.this.properties[sub.name] = {};

      if (sub.type) thisProperties.type = sub.type;
      if (sub.desc) thisProperties.desc = sub.desc;
    });

    delete comment.subthis;
  }

  return comment;
}

module.exports = commentParser;
