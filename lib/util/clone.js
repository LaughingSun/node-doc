'use strict';

/**
 * Clone an object.
 * @private
 *
 * @param obj An object or any variable that needs to be cloned.
 * @return    A clone of the original ojbect or variable.
 */
function clone (obj) {
  if (Array.isArray(obj) || obj !== Object(obj)) return obj;

  var copy = {};

  for (var key in obj) {
    copy[key] = clone(obj[key]);
  }

  return copy;
}

module.exports = clone;
