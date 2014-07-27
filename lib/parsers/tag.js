'use strict';

var isError = require('util').isError;

/** @todo Drop isError check and find a better solution. */

/**
 * @callback parseTagCallback
 *
 * @param err       {Error}  A possible error.
 * @param tag       {Object} Documentation tag object.
 * @param tag.type  {String} The type of tag.
 * @param tag.value          Information about the tag depending on the type of the tag.
 */

/**
 * Parse a single tag.
 *
 * @param tag {String}           String with a @tag in it.
 * @param cb  {parseTagCallback} The callback function.
 */
function parseTag (tag, cb) {
  tag = tag.trim();
  var firstSpace = tag.indexOf(' ')
    , typeSpace = (firstSpace > -1) ? firstSpace : undefined

    // Grap the type of tag
    , type = tag.slice(tag.indexOf('@') + 1, typeSpace).trim();

  tag = tag.slice(type.length + 1).trim();

  switch (type) {
    case 'callback':
      tag = defaultParser(tag, true, false);

      if (isError(tag)) {
        tag.message = '@callback ' + tag.message;
        return cb(tag);
      }
      break;

    case 'deprecated':
      if (tag === '') tag = true;
      // else it's the message after @deprecated
      break;

    case 'example':
      break;

    case 'param':
      tag = defaultParser(tag, true);

      if (isError(tag)) {
        tag.message = '@param ' + tag.message;
        return cb(tag);
      }

      var sub = tag.name.indexOf('.');

      if (sub > -1) {
        type = 'subparam';
        tag.master = tag.name.slice(0, sub).trim();
        tag.name = tag.name.slice(sub + 1).trim();
      }
      break;

    case 'return':
    case 'returns':
      type = 'return';
      tag = defaultParser(tag);

      if (tag.name === '') delete tag.name;

      if (tag.name) {
        if (tag.name.slice(0, 1) === '.') {
          type = 'subreturn';
          tag.name = tag.name.slice(1);
        } else {
          // Always start descriptions with capital letter
          if (tag.name.slice(0, 1) === tag.name.slice(0, 1).toUpperCase()) {
            tag.desc = (tag.name + ' ' + (tag.desc || '')).trim();
            delete tag.name;
          }
        }
      } else if (!tag.name && !tag.desc && !tag.type) {
        return cb(new Error('@return requires an description or a type'));
      }
      break;

    case 'this':
      tag = defaultParser(tag, true);

      if (isError(tag)) {
        tag.message = '@this ' + tag.message;
        return cb(tag);
      }

      if (tag.name.slice(0, 1) === '.') {
        type = 'subthis';
        tag.name = tag.name.slice(1);
      } else {
        tag.desc = (tag.name + ' ' + (tag.desc || '')).trim();
        delete tag.name;
      }
      break;

    case 'throw':
    case 'throws':
      type = 'throws';

      if (tag === '') return cb(new Error('@throws requires an error message'));

      var first = tag.indexOf('"');

      if (first !== -1) {
        var second = tag.slice(first + 1).indexOf('"')
          , msg = tag.slice(first + 1, second + 1).trim();

        tag = {
          msg: msg,
          cause: tag.slice(msg.length + 2).trim() // Two "
        };
      } else {
        tag = {
          msg: tag
        };
      }
      break;

    case 'todo':
      if (tag.indexOf('-') < 0) {
        tag = [tag];
      } else {
        var items = tag.split('-');
        tag = [];

        items.forEach(function (item) {
          item = item.trim();

          if (item !== '') tag.push(item);
        });
      }

      if (tag.length === 0 || tag[0] === '') return cb(new Error('@todo requires items you need to do'));
      break;

    default:
      return cb(new Error('Unknown tag: ' + type));
  }

  return cb(null, {
    type: type,
    value: tag
  });
}

module.exports = parseTag;

/**
 * Default parser for tags, follows: "@tag name {type} Description".
 *
 * @param  oldTag  {String}  String to convert.
 * @param  name    {Boolean} True enforces a name. False joins the name with the description.
 * @param  type    {Boolean} False ignores the type.
 * @return         {Object}  Documentation tag object or a error.
 * @return [.name] {String}  Name of the tag.
 * @return [.desc] {String}  Description of the tag.
 * @return [.type] {String}  Type of the tag.
 */
function defaultParser (oldTag, name, type) {
  var tag = {}
    , leftType = oldTag.indexOf('{')
    , rightType = oldTag.indexOf('}')
    , firstSpace = oldTag.indexOf(' ');

  if (type !== false && leftType > -1 && rightType > -1) {
    tag.name = oldTag.slice(0, leftType).trim();
    tag.type = oldTag.slice(leftType + 1, rightType).trim();

    var desc = oldTag.slice(rightType + 1).trim();

    if (desc !== '') tag.desc = desc;
  } else if (firstSpace < 0) {
    tag.name = oldTag;
  } else {
    tag.name = oldTag.slice(0, firstSpace).trim();
    tag.desc = oldTag.slice(firstSpace).trim();
  }

  if (tag.name && tag.name.slice(0, 1) === '[' && tag.name.slice(tag.name.length - 1) === ']') {
    tag.optional = true;
    tag.name = tag.name.slice(1, tag.name.length - 1);
  }

  if (name === true && (!tag.name || tag.name === '')) return new Error('requires a name');

  return tag;
}
