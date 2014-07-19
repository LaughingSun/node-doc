'use strict';

var clone = require('../util/clone');

/**
 * Prepare the documentation object to be saved as json.
 *
 * @param  d         {Object} The documentation object.
 * @return           {Object} An object with filenames as keys and the value
 *                            is the documentation object. Main.json is the
 *                            default and on for each namespace.
 * @return main.json {Object} The main documentation object.
 */
function prepareJson (d) {
  var doc = clone(d)
    , ns = clone(doc.ns);

  // Namespaces get their own file
  delete doc.ns;

  var result = {
    'main.json': JSON.stringify(doc)
  };

  // Give the namespaces their own file
  for (var file in ns) {
    if (ns.hasOwnProperty(file)) result[file + '.json'] = JSON.stringify(ns[file]);
  }

  return result;
}

module.exports = prepareJson;
