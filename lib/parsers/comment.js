'use strict';

var parseTag = require('./tag')
  , clone = require('../util/clone');

/**
 * @callback commentParserCallback
 *
 * @param err        {Error}  A possible error.
 * @param commentDoc {Object} Documentation comment object or undefined for no comment.
 */

/**
 * Parses a source comment.
 * @public
 *
 * @todo DRY the sub-param, return & this
 *
 * @param  sourceComment {String}                Source file comment.
 * @param [info]         {Object}                Code information.
 * @param  cb            {commentParserCallback} The callback function.
 */
function CommentParser (sourceComment, info, cb) {
  if (!(this instanceof CommentParser)) return new CommentParser(sourceComment, info, cb);

  if (!cb) {
    cb = info;
    info = {};
  }

  var comment = this.comment = clone(info);

  if (typeof sourceComment !== 'string') return cb(new Error('Input comment not a string'));

  // Drop opening and close tags and create a array of the comments
  var lines = sourceComment.replace('/**', '').replace('*/', '').split('\n')
    , handleParsedTag = handleTag.bind(this)
    , i = this.i = lines.length
    , prev = ''
    , line = '';

  // Wrapper for errors in handleTag
  this.errCb = function (err) {
    err.message = err.message + '. On line ' + (i + 1) + ' of the comment';
    cb(err);

    // No double calling callback
    cb = function () {};
  };

  // Loop over all the lines in the comment
  // From bottom to top, to allow multi line comments
  while (i--) {
    line = lines[i].trim();

    // Allow for * to be the first char, like the doc of the function
    if (line.slice(0, 1) === '*') line = line.slice(1).trim();

    // Line with a tag
    if (line.indexOf('@') === 0) {
      parseTag(line + ' ' + prev, handleParsedTag);
      prev = '';
    } else {
      // Allow for multiline comments
      prev = (line === '' ? '\n' : line) + ' ' + prev;
    }
  }

  prev = prev.trim();

  // Add the remainder to the description
  if (prev !== '') comment.desc = (comment.desc || '') + prev;

  if (comment.subparam) {
    var sub
      , param
      , found = false
      , k;

    for (var j = comment.subparam.length; j--;) {
      sub = comment.subparam[j];
      found = false;

      // Look for the master param
      if (comment.params) {
        for (k = comment.params.length; k--;) {
          if (comment.params[k].name === sub.master) {
            found = k;
            break;
          }
        }
      }

      // No master param found
      if (found === false) return cb(new Error('No param ' + sub.master + ' found. On line ' + sub.line + ' of the comment'));

      param = comment.params[found];

      // Can't have a property on a not object
      if (param.type !== 'Object') return cb(new Error('Param ' + param.name + ' is not an object. On line ' + sub.line + ' of the comment'));

      // Add the properties on the param object
      param.properties = param.properties || {};
      param.properties[sub.name] = {};

      if (sub.type) param.properties[sub.name].type = sub.type;
      if (sub.desc) param.properties[sub.name].desc = sub.desc;
      if (sub.optional) param.properties[sub.name].optional = sub.optional;
    }

    // Drop the subparam from the comment doc object
    delete comment.subparam;
  }

  if (comment.subreturn) {
    var errLine = comment.subreturn[0].line;
    if (!comment.return) return cb(new Error('No master return. On line ' + errLine + ' of the comment'));
    if (comment.return.type !== 'Object') return cb(new Error('Return is not an object. On line ' + errLine + ' of the comment'));

    comment.return.properties = comment.return.properties || {};

    comment.subreturn.forEach(function (sub) {
      // Add the properties on the param object
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
      // Add the properties on the param object
      var thisProperties = comment.this.properties[sub.name] = {};

      if (sub.type) thisProperties.type = sub.type;
      if (sub.desc) thisProperties.desc = sub.desc;
    });

    delete comment.subthis;
  }

  if (Object.keys(comment).length === 0) comment = undefined;

  cb(null, comment);
}

module.exports = CommentParser;

/**
 * Handle the tag
 *
 * @this  comment   {Object}   Documentation comment object.
 * @this  errCb     {Function} Small wrapper for the callback.
 *
 * @param err       {Error}    An possible error.
 * @param tag       {Object}   Documentation tag object.
 * @param tag.type  {String}   The type of tag.
 * @param tag.value            Information about the tag depending on the type of the tag.
 */
function handleTag (err, tag) {
  if (err) return this.errCb(err);

  switch (tag.type) {
    case 'access':
    case 'example':
    case 'return':
    case 'this':
      this.comment[tag.type] = tag.value;
      break;

    case 'callback':
      this.comment.type = 'Callback';
      this.comment.name = tag.value.name;
      if (tag.value.desc) this.comment.desc = tag.value.desc;
      break;

    case 'constant':
      this.comment.constant = true;

      if (tag.value.type && tag.value.type !== this.comment.type) {
        return this.errCb(new Error('Type in doc & code do not match'));
      } else if (tag.value.name && tag.value.name !== this.comment.name) {
        return this.errCb(new Error('Name in doc & code do not match'));
      } else if (tag.value.desc) {
        this.comment.desc = tag.value.desc;
      }
      break;

    case 'constructor':
      this.comment.type = 'Constructor';
      break;

    case 'deprecated':
      this.comment.deprecated = tag.value;
      break;

    case 'param':
      this.comment.params = this.comment.params || [];
      this.comment.params.unshift(tag.value);
      break;

    case 'subparam':
    case 'subreturn':
    case 'subthis':
    case 'throws':
      this.comment[tag.type] = this.comment[tag.type] || [];
      tag.value.line = this.i;
      this.comment[tag.type].unshift(tag.value);
      break;

    case 'todo':
      this.comment.todos = this.comment.todos || [];
      this.comment.todos = tag.value.concat(this.comment.todos);
      break;
  }
}
