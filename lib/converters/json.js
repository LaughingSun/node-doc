'use strict';

var clone = require('../util/clone');

/**
 * Prepare the documentation object to be saved as json.
 */
function prepareJson (doc) {
  var ns = clone(doc.ns);

  delete doc.ns;

  var result = {
    'main.json': doc
  };

  for (var file in ns) {
    result[file + '.json'] = ns[file];
  }

  return result;
}

module.exports = prepareJson;
