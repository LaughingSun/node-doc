var ns1 = require("./ns-1")
  , ns2 = require("./ns-2");

/**
 * exports function
 */
function exportFunction () {
  return 'Mutliple namespaces!'
};

module.exports = exportFunction;

exportFunction.prototype.ns1 = ns1;
exportFunction.prototype.ns2 = ns2;
