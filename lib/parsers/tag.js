/**
 * @title Parse Tag
 * @desc Parse a single tag.
 * @public
 *
 * @param tag {String} String with a @tag in it.
 * @return {Object} Object with type and value for the tag.
 * @return .type {String} The type of tag.
 * @return .value Information about the tag.
 */
function parseTag (tag) {
  tag = tag.trim();

  var firstSpace = tag.indexOf(' ')
    , typeSpace = (firstSpace > -1) ? firstSpace : undefined
    , type = tag.slice(tag.indexOf('@') + 1, typeSpace).trim();

  tag = tag.slice(type.length + 1).trim();

  switch (type) {
    case 'access':
    case 'public':
    case 'private':
      if (type !== 'access') {
        tag = type;
        type = 'access';
      } else if (tag !== 'public' && tag !== 'private') {
        throw new Error('@access only supports public, private');
      }
      break;

    case 'callback':
      tag = defaultParser(tag, true, false);
      break;

    case 'constant':
      tag = defaultParser(tag);
      break;

    case 'constructor':
      tag = true;
      break;

    case 'deprecated':
      if (tag === '') tag = true;
      // else it's the message after @deprecated
      break;

    case 'example':
    case 'desc':
    case 'title':
      break;

    case 'param':
      tag = defaultParser(tag, true);
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
      tag = defaultParser(tag, false);

      if (tag.desc && tag.desc.indexOf('.') === 0) {
        type = 'subreturn';

        var space = tag.desc.indexOf(' ');

        if (space === -1) {
          tag.name = tag.desc.slice(1).trim();
          delete tag.desc;
        } else {
          tag.name = tag.desc.slice(1, space).trim();
          tag.desc = tag.desc.slice(space + 1).trim();
        }
      }
      break;

    case 'throw':
    case 'throws':
      type = 'throws';

      if (tag === '') throw new Error('No error message');
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

      if (tag.length === 0 || tag[0] === '') throw new Error('@todo requires items you need to do');
      break;

    default:
      throw new Error('Unknown tag: ' + type);
  }

  return {
    type: type,
    value: tag
  };
}

module.exports = parseTag;

/**
 * @title Default Parser
 * @desc Default parser for tags, follows: @tag name {Type} Description.
 * @private
 *
 * @param oldTag {String} String to convert.
 * @param name {Boolean} False makes name a part of the description.
 *                       True enforces an name.
 * @param type {Boolean} False ignores the type.
 * @return {Object} Information about the tag.
 * @return .name {String} Possible name of the tag.
 * @return .desc {String} Possible description of the tag.
 * @return .type {String} Possible type of the tag.
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

  if (name === false) {
    tag.desc = (tag.name + ' ' + (tag.desc || '')).trim();
    delete tag.name;

    if (!tag.desc || tag.desc === '') {
      delete tag.desc;

      if (!tag.type || tag.type === '') throw new Error('Requires an description or a type');
    }
  } else if (name === true && (!tag.name || tag.name === '')) {
    throw new Error('Doesn\'t have a name');
  }

  return tag;
}
