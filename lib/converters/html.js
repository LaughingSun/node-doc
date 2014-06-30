'use strict';

/**
 * Parses a documentation object into HTML.
 */
function toHTML (doc) {
  var ns = clone(doc.ns);

  delete doc.ns;

  var result = {
    'index.html': doc
  };

  for (var file in ns) {
    result[file + '.html'] = ns[file];
  }

  return result;

  throw new Error('NOT DONE YET');
  return doc;
}

module.exports = toHTML;
