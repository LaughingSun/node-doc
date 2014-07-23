'use strict';

var clone = require('./clone');

/**
 * Merge an object with another object.
 *
 * @param obj1  {Object} An object that needs to be merged.
 * @param obj2 {Object} An object that overwrites the first object.
 * @return     {Object} A single merged object.
 */
function merge (obj1, obj2) {
  var obj = clone(obj1);

  for (var key in obj2) {
    if (obj2[key]) obj[key] = obj2[key];
  }

  return obj;
}

module.exports = merge;
