'use strict';

var merge = require('sak-merge')
  , isObject = require('sak-isobject');

/**
 * Construct a documentation object from options, all comments and exports name.
 *
 * @param  options    {Object} Options supplied to the fileParser function.
 * @param  comments   {Array}  All comments in the file.
 * @param  namespaces {Object} All namespaces included in the file.
 * @param  exports    {String} The name of variable that the file exports.
 * @return            {Object} Documentation object.
 */
function constructor (options, comments, namespaces, exports) {
  var doc = {
    name: options.name
  };

  // No point in adding all this stuff to namespaces aswell
  if (!options.ns) {
    // Stuff we can inherit from the options (package.json)
    if (options.author) doc.author = options.author;
    if (options.description) doc.desc = options.description;
    if (options.license) doc.license = options.license;
    if (options.version) doc.version = options.version;
  }

  // Add each comment to the doc object
  comments.forEach(function (comment) {
    if (comment.name === exports)  {
      doc.exports = comment;
    } else if (comment.access === 'public' ||
              (comment.access === 'private' && options.private === true)) {
      // In case of the comment has todos
      if (comment.todos) {
        doc.todos = doc.todos || {};

        if (comment.name) {
          // Add the todos to the todo list
          doc.todos[comment.name] = comment.todos;
        } else {
          // Add global todos to the global todos object
          doc.todos.global = doc.todos.global || [];
          doc.todos.global = doc.todos.global.concat(comment.todos);
        }
      }

      // Add the comment documentation
      if (comment.constant && comment.constant === true) {
        doc.constants = doc.constants || {};
        doc.constants[comment.name] = comment;
      } else if (comment.type === 'Callback') {
        doc.callbacks = doc.callbacks || {};
        doc.callbacks[comment.name] = comment;
      } else if (comment.type === 'Function' ||  comment.type === 'Constructor') {
        doc.functions = doc.functions || {};
        doc.functions[comment.name] = comment;
      }
    }
  });

  var keys = Object.keys(namespaces);

  if (keys.length !== 0) {
    keys.forEach(function (key) {
      var ns = namespaces[key];

      // It's possible a namespace doesn't return documentation
      if (!ns) return;

      doc.namespaces = doc.namespaces || {};
      doc.namespaces[key] = ns;

      // If something gets exported add it to the documentation ojbect
      if (ns.exports) {
        var exports = ns.exports;

        // In case of no name default to the namespace name
        if (!exports.name) exports.name = ns.name;

        // Add the exported values to the main documentation object
        /** @todo DRY this with adding comments to doc obj above */
        if (exports.constant && exports.constant === true) {
          doc.constants = doc.constants || {};
          doc.constants[exports.name] = exports;
        } else if (exports.type === 'Callback') {
          doc.callbacks = doc.callbacks || {};
          doc.callbacks[exports.name] = exports;
        } else if (exports.type === 'Function' ||  exports.type === 'Constructor') {
          doc.functions = doc.functions || {};
          doc.functions[exports.name] = exports;
        }
      }

      // If it has todos add it the doc object aswell
      if (ns.todos) {
        doc.todos = doc.todos || {};
        doc.todos = merge(doc.todos, ns.todos);
      }
    });
  }

  return doc;
}

module.exports = constructor;
