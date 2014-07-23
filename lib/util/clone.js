'use strict';

/**
 * Clone an object.
 *
 * @param obj {Object} An object or any variable that needs to be cloned.
 * @return    {Object} A clone of the original object.
 */
function clone (obj) {
  if (Array.isArray(obj) || obj !== Object(obj)) return obj;

  var copy = {};

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) copy[key] = clone(obj[key]);
  }

  return copy;
}

module.exports = clone;
