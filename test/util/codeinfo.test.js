var should = require('should');

describe('Code info util', function () {
  var detectCodeInfo = require('../../lib/util/codeinfo');

  describe('Var assignment', function () {
    it('should detect a string assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = "string";');
      check(info, 'public', false, 'String', 'myVariable', false);
    });

    it('should detect a string assigned to a constant', function () {
      var info = detectCodeInfo('var MY_CONSTANT = "string";');
      check(info, 'public', false, 'String', 'MY_CONSTANT', true);
    });

    it('should detect a string assigned to a private constant', function () {
      var info = detectCodeInfo('var _MY_CONSTANT = "string";');
      check(info, 'private', false, 'String', '_MY_CONSTANT', true);
    });

    it('should detect a string assigned to a private variable', function () {
      var info = detectCodeInfo('var _privateVariable = "string";');
      check(info, 'private', false, 'String', '_privateVariable', false);
    });

    it('should detect a number assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = 0;');
      check(info, 'public', false, 'Number', 'myVariable', false);
    });

    it('should detect a float assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = 0.0;');
      check(info, 'public', false, 'Float', 'myVariable', false);
    });

    it('should detect a boolean assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = false;');
      check(info, 'public', false, 'Boolean', 'myVariable', false);
    });

    it('should detect undefined assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = undefined;');
      check(info, 'public', false, 'Undefined', 'myVariable', false);
    });

    it('should detect null assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = null;');
      check(info, 'public', false, 'Null', 'myVariable', false);
    });

    it('should detect an object assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = {};');
      check(info, 'public', false, 'Object', 'myVariable', false);
    });

    it('should detect an array assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = [];');
      check(info, 'public', false, 'Array', 'myVariable', false);
    });

    it('should detect a function assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = function () {};');
      check(info, 'public', false, 'Function', 'myVariable', false);
    });

    it('should default to undefined', function () {
      var info = detectCodeInfo('var myVariable;');
      check(info, 'public', false, 'Undefined', 'myVariable', false);
    });

    it('should detect another variable assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = anotherVariable');
      check(info, 'public', false, undefined, 'myVariable', false);
    });

    it('should detect an executed function assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = require("./lib");');
      check(info, 'public', false, undefined, 'myVariable', false);
    });

    it('should detect an executed private function assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = _require("./lib");');
      check(info, 'public', false, undefined, 'myVariable', false);
    });
  });

  describe('Prototype assignment', function () {
    it('should detect a string assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = "string";');
      check(info, 'public', false, 'String', 'otherVariable', false);
    });

    it('should detect a string assigned to prototype constant', function () {
      var info = detectCodeInfo('myVariable.prototype.MY_CONSTANT = "string";');
      check(info, 'public', false, 'String', 'MY_CONSTANT', true);
    });

    it('should detect a string assigned to private prototype constant', function () {
      var info = detectCodeInfo('myVariable.prototype._MY_CONSTANT = "string";');
      check(info, 'private', false, 'String', '_MY_CONSTANT', true);
    });

    it('should detect a string assigned to private prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype._privateVariable = "string";');
      check(info, 'private', false, 'String', '_privateVariable', false);
    });

    it('should detect a number assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = 0;');
      check(info, 'public', false, 'Number', 'otherVariable', false);
    });

    it('should detect a float assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = 0.0;');
      check(info, 'public', false, 'Float', 'otherVariable', false);
    });

    it('should detect a boolean assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = false;');
      check(info, 'public', false, 'Boolean', 'otherVariable', false);
    });

    it('should detect undefined assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = undefined;');
      check(info, 'public', false, 'Undefined', 'otherVariable', false);
    });

    it('should detect null assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = null;');
      check(info, 'public', false, 'Null', 'otherVariable', false);
    });

    it('should detect an object assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = {};');
      check(info, 'public', false, 'Object', 'otherVariable', false);
    });

    it('should detect an array assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = [];');
      check(info, 'public', false, 'Array', 'otherVariable', false);
    });

    it('should detect a function assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = function () {};');
      check(info, 'public', false, 'Function', 'otherVariable', false);
    });

    it('should detect a variable assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = anotherVariable;');
      check(info, 'public', false, undefined, 'otherVariable', false);
    });

    it('should detect a private variable assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = anotherVariable;');
      check(info, 'public', false, undefined, 'otherVariable', false);
    });

    it('should detect an executed function assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = require("./lib");');
      check(info, 'public', false, undefined, 'otherVariable', false);
    });

    it('should detect an executed private function assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = _require("./lib");');
      check(info, 'public', false, undefined, 'otherVariable', false);
    });

    it('should detect an object assigned to prototype object', function () {
      var info = detectCodeInfo('myVariable.prototype = {};');
      check(info, 'public', false, 'Object', undefined, false);
    });
  });

  describe('Function assignment', function () {
    it('should detect function assignment', function () {
      var info = detectCodeInfo('function myFunction () {}');
      check(info, 'public', false, 'Function', 'myFunction', false);
    });

    it('should detect private function assignment', function () {
      var info = detectCodeInfo('function _myFunction () {}');
      check(info, 'private', false, 'Function', '_myFunction', false);
    });

    it('should detect an constructor', function () {
      var info = detectCodeInfo('function MyFunction () {}');
      check(info, 'public', false, 'Constructor', 'MyFunction', false);
    });
  });

  describe('module.exports assignment', function () {
    it('should detect a string assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = "string";');
      check(info, 'public', true, 'String', undefined, false);
    });

    it('should detect a number assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = 0;');
      check(info, 'public', true, 'Number', undefined, false);
    });

    it('should detect a float assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = 0.0;');
      check(info, 'public', true, 'Float', undefined, false);
    });

    it('should detect a boolean assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = false;');
      check(info, 'public', true, 'Boolean', undefined, false);
    });

    it('should detect undefined assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = undefined;');
      check(info, 'public', true, 'Undefined', undefined, false);
    });

    it('should detect null assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = null;');
      check(info, 'public', true, 'Null', undefined, false);
    });

    it('should detect an object assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = {};');
      check(info, 'public', true, 'Object', undefined, false);
    });

    it('should detect an array assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = [];');
      check(info, 'public', true, 'Array', undefined, false);
    });

    it('should detect a function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = function () {};');
      check(info, 'public', true, 'Function', undefined, false);
    });

    it('should detect a function assigned to module.exports with param', function () {
      var info = detectCodeInfo('module.exports = function (param) {};');
      check(info, 'public', true, 'Function', undefined, false);
    });

    it('should detect a function assigned to module.exports with multiple params', function () {
      var info = detectCodeInfo('module.exports = function (param1, param2) {};');
      check(info, 'public', true, 'Function', undefined, false);
    });

    it('should detect a named function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = function myFunction () {};');
      check(info, 'public', true, 'Function', 'myFunction', false);
    });

    it('should detect a private named function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = function _myFunction () {};');
      check(info, 'private', true, 'Function', '_myFunction', false);
    });

    it('should detect a variable assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = myVariable;');
      check(info, 'public', true, undefined, 'myVariable', false);
    });

    it('should detect a private variable assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = _privateVariable;');
      check(info, 'private', true, undefined, '_privateVariable', false);
    });

    it('should detect an executed function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = require("./lib");');
      check(info, 'public', true, undefined, undefined, false);
    });

    it('should detect an executed private function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = _require("./lib");');
      check(info, 'public', true, undefined, undefined, false);
    });
  });

  describe('exports assignment', function () {
    it('should detect a string assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = "string";');
      check(info, 'public', true, 'String', 'myVariable', false);
    });

    it('should detect a string assigned to exports', function () {
      var info = detectCodeInfo('exports.MY_CONSTANT = "string";');
      check(info, 'public', true, 'String', 'MY_CONSTANT', true);
    });

    it('should detect a string assigned to exports private variable', function () {
      var info = detectCodeInfo('exports._MY_CONSTANT = "string";');
      check(info, 'private', true, 'String', '_MY_CONSTANT', true);
    });

    it('should detect a string assigned to exports private variable', function () {
      var info = detectCodeInfo('exports._privateVariable = "string";');
      check(info, 'private', true, 'String', '_privateVariable', false);
    });

    it('should detect a number assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = 0;');
      check(info, 'public', true, 'Number', 'myVariable', false);
    });

    it('should detect a float assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = 0.0;');
      check(info, 'public', true, 'Float', 'myVariable', false);
    });

    it('should detect a boolean assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = true;');
      check(info, 'public', true, 'Boolean', 'myVariable', false);
    });

    it('should detect undefined assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = undefined;');
      check(info, 'public', true, 'Undefined', 'myVariable', false);
    });

    it('should detect null assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = null;');
      check(info, 'public', true, 'Null', 'myVariable', false);
    });

    it('should detect an object assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = {};');
      check(info, 'public', true, 'Object', 'myVariable', false);
    });

    it('should detect an array assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = [];');
      check(info, 'public', true, 'Array', 'myVariable', false);
    });

    it('should detect a function assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = function () {};');
      check(info, 'public', true, 'Function', 'myVariable', false);
    });

    it('should detect a named function assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = function myFunction () {};');
      check(info, 'public', true, 'Function', 'myVariable', false);
    });

    it('should detect a variable assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = myOtherVariable;');
      check(info, 'public', true, undefined, 'myVariable', false);
    });

    it('should detect a private variable assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = _privateVariable;');
      check(info, 'public', true, undefined, 'myVariable', false);
    });

    it('should detect an executed assigned to module.exports', function () {
      var info = detectCodeInfo('exports.myVariable = require("./lib");');
      check(info, 'public', true, undefined, 'myVariable', false);
    });

    it('should detect an executed assigned to module.exports', function () {
      var info = detectCodeInfo('exports.myVariable = _require("./lib");');
      check(info, 'public', true, undefined, 'myVariable', false);
    });
  });

  it('should detect callback function', function () {
    var info = detectCodeInfo('fs.readFile(\'./nothing.js\', function (err, file) {');
    check(info, 'private', false, 'Callback', undefined, false);
  });

  it('should set access to private with a name starting with _', function () {
    var info = detectCodeInfo('myVariable.prototype._privateVariable = "string";');
    check(info, 'private', false, 'String', '_privateVariable', false);
  });

  it('should return undefined for name and type if it can\'t find it', function () {
    var info = detectCodeInfo('');
    check(info, 'public', false, undefined, undefined, false);
  });
});

/**
 * Check an info object.
 *
 * @param info     {Object}           The object with information about the code.
 * @param access   {String}           What the access should be.
 * @param exports  {Boolean}          Whether or not expors should be true.
 * @param type     {String|Undefined} What the type should be.
 * @param name     {String|Undefined} What the name should be.
 * @param constant {Boolean}          What the constant should be.
 */
function check (info, access, exports, type, name, constant) {
  info.should.be.an.Object.and.have.properties('access', 'exports', 'type', 'name');
  should.equal(info.access, access);
  should.equal(info.exports, exports);
  should.equal(info.type, type);
  should.equal(info.name, name);
  should.equal(info.constant, constant);
}
