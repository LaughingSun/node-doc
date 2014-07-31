'use strict';

var clone = require('sak-clone');

/**
 * Prepare the documentation object to be saved as json.
 *
 * @param  d         {Object} The documentation object.
 * @return           {Object} An object with filenames as keys and the value
 *                            is the documentation object in string. Main.json
 *                            is the default and one file for each namespace.
 * @return main.json {String} The main documentation object.
 * @return [.todo.json] {String} All todos from the project.
 */
function prepareJson (d) {
  var doc = clone(d)
    , ns = clone(doc.ns);

  // Namespaces get their own file
  delete doc.ns;

  var result = {
    'main.json': JSON.stringify(doc, null, 2)
  };

  // Create a global todo file, with all todos in it
  if (doc.todos) result['todo.json'] = JSON.stringify(doc.todos, null, 2);

  // Give the namespaces their own file
  for (var file in ns) {
    if (ns.hasOwnProperty(file)) result[file + '.json'] = JSON.stringify(ns[file], null, 2);
  }

  return result;
}

module.exports = prepareJson;
