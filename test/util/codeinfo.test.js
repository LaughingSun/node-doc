var should = require('should');

/**
 * @todo Document each item on an object
 *
 * @example
 * exports = {
 *   function: function () {},
 *   variable: 'string'
 * };
 */

describe('Code info util', function () {
  var detectCodeInfo = require('../../lib/util/codeinfo');

  describe('Var assignment', function () {
    it('should detect a string assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = "string";');
      check(info, 'public', false, 'String', 'myVariable');
    });

    it('should detect a string assigned to a variable', function () {
      var info = detectCodeInfo('var _privateVariable = "string";');
      check(info, 'private', false, 'String', '_privateVariable');
    });

    it('should detect a number assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = 0;');
      check(info, 'public', false, 'Number', 'myVariable');
    });

    it('should detect a float assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = 0.0;');
      check(info, 'public', false, 'Float', 'myVariable');
    });

    it('should detect a boolean assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = false;');
      check(info, 'public', false, 'Boolean', 'myVariable');
    });

    it('should detect undefined assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = undefined;');
      check(info, 'public', false, 'Undefined', 'myVariable');
    });

    it('should detect null assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = null;');
      check(info, 'public', false, 'Null', 'myVariable');
    });

    it('should detect an object assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = {};');
      check(info, 'public', false, 'Object', 'myVariable');
    });

    it('should detect an array assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = [];');
      check(info, 'public', false, 'Array', 'myVariable');
    });

    it('should detect a function assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = function () {};');
      check(info, 'public', false, 'Function', 'myVariable');
    });

    it('should default to undefined', function () {
      var info = detectCodeInfo('var myVariable;');
      check(info, 'public', false, 'Undefined', 'myVariable');
    });

    it('should detect another variable assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = anotherVariable');
      check(info, 'public', false, undefined, 'myVariable');
    });

    it('should detect an executed function assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = require("./lib");');
      check(info, 'public', false, undefined, 'myVariable');
    });

    it('should detect an executed private function assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = _require("./lib");');
      check(info, 'public', false, undefined, 'myVariable');
    });
  });

  describe('Prototype assignment', function () {
    it('should detect a string assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = "string";');
      check(info, 'public', false, 'String', 'otherVariable');
    });

    it('should detect a string assigned to private prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype._privateVariable = "string";');
      check(info, 'private', false, 'String', '_privateVariable');
    });

    it('should detect a number assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = 0;');
      check(info, 'public', false, 'Number', 'otherVariable');
    });

    it('should detect a float assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = 0.0;');
      check(info, 'public', false, 'Float', 'otherVariable');
    });

    it('should detect a boolean assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = false;');
      check(info, 'public', false, 'Boolean', 'otherVariable');
    });

    it('should detect undefined assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = undefined;');
      check(info, 'public', false, 'Undefined', 'otherVariable');
    });

    it('should detect null assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = null;');
      check(info, 'public', false, 'Null', 'otherVariable');
    });

    it('should detect an object assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = {};');
      check(info, 'public', false, 'Object', 'otherVariable');
    });

    it('should detect an array assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = [];');
      check(info, 'public', false, 'Array', 'otherVariable');
    });

    it('should detect a function assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = function () {};');
      check(info, 'public', false, 'Function', 'otherVariable');
    });

    it('should detect a variable assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = anotherVariable;');
      check(info, 'public', false, undefined, 'otherVariable');
    });

    it('should detect a private variable assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = anotherVariable;');
      check(info, 'public', false, undefined, 'otherVariable');
    });

    it('should detect an executed function assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = require("./lib");');
      check(info, 'public', false, undefined, 'otherVariable');
    });

    it('should detect an executed private function assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = _require("./lib");');
      check(info, 'public', false, undefined, 'otherVariable');
    });

    it('should detect an object assigned to prototype object', function () {
      var info = detectCodeInfo('myVariable.prototype = {};');
      check(info, 'public', false, 'Object', undefined);
    });
  });

  describe('Function assignment', function () {
    it('should detect function assignment', function () {
      var info = detectCodeInfo('function myFunction () {}');
      check(info, 'public', false, 'Function', 'myFunction');
    });

    it('should detect private function assignment', function () {
      var info = detectCodeInfo('function _myFunction () {}');
      check(info, 'private', false, 'Function', '_myFunction');
    });
  });

  describe('module.exports assignment', function () {
    it('should detect a string assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = "string";');
      check(info, 'public', true, 'String', undefined);
    });

    it('should detect a number assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = 0;');
      check(info, 'public', true, 'Number', undefined);
    });

    it('should detect a float assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = 0.0;');
      check(info, 'public', true, 'Float', undefined);
    });

    it('should detect a boolean assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = false;');
      check(info, 'public', true, 'Boolean', undefined);
    });

    it('should detect undefined assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = undefined;');
      check(info, 'public', true, 'Undefined', undefined);
    });

    it('should detect null assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = null;');
      check(info, 'public', true, 'Null', undefined);
    });

    it('should detect an object assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = {};');
      check(info, 'public', true, 'Object', undefined);
    });

    it('should detect an array assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = [];');
      check(info, 'public', true, 'Array', undefined);
    });

    it('should detect a function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = function () {};');
      check(info, 'public', true, 'Function', undefined);
    });

    it('should detect a named function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = function myFunction () {};');
      check(info, 'public', true, 'Function', 'myFunction');
    });

    it('should detect a private named function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = function _myFunction () {};');
      check(info, 'private', true, 'Function', '_myFunction');
    });

    it('should detect a variable assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = myVariable;');
      check(info, 'public', true, undefined, 'myVariable');
    });

    it('should detect a private variable assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = _privateVariable;');
      check(info, 'private', true, undefined, '_privateVariable');
    });

    it('should detect an executed function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = require("./lib");');
      check(info, 'public', true, undefined, undefined);
    });

    it('should detect an executed private function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = _require("./lib");');
      check(info, 'public', true, undefined, undefined);
    });
  });

  describe('exports assignment', function () {
    it('should detect a string assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = "string";');
      check(info, 'public', true, 'String', 'myVariable');
    });

    it('should detect a string assigned to exports private variable', function () {
      var info = detectCodeInfo('exports._privateVariable = "string";');
      check(info, 'private', true, 'String', '_privateVariable');
    });

    it('should detect a number assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = 0;');
      check(info, 'public', true, 'Number', 'myVariable');
    });

    it('should detect a float assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = 0.0;');
      check(info, 'public', true, 'Float', 'myVariable');
    });

    it('should detect a boolean assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = true;');
      check(info, 'public', true, 'Boolean', 'myVariable');
    });

    it('should detect undefined assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = undefined;');
      check(info, 'public', true, 'Undefined', 'myVariable');
    });

    it('should detect null assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = null;');
      check(info, 'public', true, 'Null', 'myVariable');
    });

    it('should detect an object assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = {};');
      check(info, 'public', true, 'Object', 'myVariable');
    });

    it('should detect an array assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = [];');
      check(info, 'public', true, 'Array', 'myVariable');
    });

    it('should detect a function assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = function () {};');
      check(info, 'public', true, 'Function', 'myVariable');
    });

    it('should detect a named function assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = function myFunction () {};');
      check(info, 'public', true, 'Function', 'myVariable');
    });

    it('should detect a variable assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = myOtherVariable;');
      check(info, 'public', true, undefined, 'myVariable');
    });

    it('should detect a private variable assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = _privateVariable;');
      check(info, 'public', true, undefined, 'myVariable');
    });

    it('should detect an executed assigned to module.exports', function () {
      var info = detectCodeInfo('exports.myVariable = require("./lib");');
      check(info, 'public', true, undefined, 'myVariable');
    });

    it('should detect an executed assigned to module.exports', function () {
      var info = detectCodeInfo('exports.myVariable = _require("./lib");');
      check(info, 'public', true, undefined, 'myVariable');
    });
  });

  it('should set access to private with a name starting with _', function () {
    var info = detectCodeInfo('myVariable.prototype._privateVariable = "string";');
    check(info, 'private', false, 'String', '_privateVariable');
  });

  it('should return undefined for name and type if it can\'t find it', function () {
    var info = detectCodeInfo('');
    check(info, 'public', false, undefined, undefined);
  });
});

/**
 * Check an info object.
 *
 * @param info    {Object}           The object with information about the code.
 * @param access  {String}           What the access should be.
 * @param exports {Boolean}          Whether or not expors should be true.
 * @param type    {String|Undefined} What the type should be.
 * @param name    {String|Undefined} What the name should be.
 */
function check (info, access, exports, type, name) {
  info.should.be.an.Object.and.have.properties('access', 'exports', 'type', 'name');
  should.equal(info.access, access);
  should.equal(info.exports, exports);
  should.equal(info.type, type);
  should.equal(info.name, name);
}
