var should = require('should');

/**
 * @todo Should be documentated per function object...
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

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('String');
      info.name.should.equal('myVariable');
    });

    it('should detect a number assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = 0;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Number');
      info.name.should.equal('myVariable');
    });

    it('should detect a float assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = 0.0;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Float');
      info.name.should.equal('myVariable');
    });

    it('should detect a boolean assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = false;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Boolean');
      info.name.should.equal('myVariable');
    });

    it('should detect undefined assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = undefined;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Undefined');
      info.name.should.equal('myVariable');
    });

    it('should detect null assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = null;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Null');
      info.name.should.equal('myVariable');
    });

    it('should detect an object assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Object');
      info.name.should.equal('myVariable');
    });

    it('should detect an array assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = [];');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Array');
      info.name.should.equal('myVariable');
    });

    it('should detect a function assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = function () {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Function');
      info.name.should.equal('myVariable');
    });

    it('should default to undefined', function () {
      var info = detectCodeInfo('var myVariable;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Undefined');
      info.name.should.equal('myVariable');
    });

    it('should detect another variable assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = anotherVariable');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      should.equal(info.type, undefined);
      info.name.should.equal('myVariable');
    });

    it('should detect an executed function assigned to a variable', function () {
      var info = detectCodeInfo('var myVariable = require("./lib");');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      should.equal(info.type, undefined);
      info.name.should.equal('myVariable');
    });
  });

  describe('Prototype assignment', function () {
    it('should detect a string assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = "string";');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('String');
      info.name.should.equal('otherVariable');
    });

    it('should detect a number assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = 0;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Number');
      info.name.should.equal('otherVariable');
    });

    it('should detect a float assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = 0.0;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Float');
      info.name.should.equal('otherVariable');
    });

    it('should detect a boolean assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = false;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Boolean');
      info.name.should.equal('otherVariable');
    });

    it('should detect undefined assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = undefined;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Undefined');
      info.name.should.equal('otherVariable');
    });

    it('should detect null assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = null;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Null');
      info.name.should.equal('otherVariable');
    });

    it('should detect an object assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Object');
      info.name.should.equal('otherVariable');
    });

    it('should detect an array assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = [];');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Array');
      info.name.should.equal('otherVariable');
    });

    it('should detect a function assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = function () {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Function');
      info.name.should.equal('otherVariable');
    });

    it('should detect an executed function assigned to prototype property', function () {
      var info = detectCodeInfo('myVariable.prototype.otherVariable = require("./lib");');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      should.equal(info.type, undefined);
      info.name.should.equal('otherVariable');
    });

    it('should detect an object assigned to prototype object', function () {
      var info = detectCodeInfo('myVariable.prototype = {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Object');
      should.equal(info.name, undefined);
    });
  });

  describe('Function assignment', function () {
    it('should detect function assignment', function () {
      var info = detectCodeInfo('function myFunction () {}');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(false);
      info.type.should.equal('Function');
      info.name.should.equal('myFunction');
    });
  });

  describe('module.exports assignment', function () {
    it('should detect a string assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = "string";');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('String');
      should.equal(info.name, undefined);
    });

    it('should detect a number assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = 0;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Number');
      should.equal(info.name, undefined);
    });

    it('should detect a float assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = 0.0;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Float');
      should.equal(info.name, undefined);
    });

    it('should detect a boolean assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = false;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Boolean');
      should.equal(info.name, undefined);
    });

    it('should detect undefined assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = undefined;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Undefined');
      should.equal(info.name, undefined);
    });

    it('should detect null assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = null;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Null');
      should.equal(info.name, undefined);
    });

    it('should detect an object assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Object');
      should.equal(info.name, undefined);
    });

    it('should detect an array assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = [];');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Array');
      should.equal(info.name, undefined);
    });

    it('should detect a function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = function () {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Function');
      should.equal(info.name, undefined);
    });

    it('should detect a named function assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = function myFunction () {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Function');
      info.name.should.equal('myFunction');
    });

    it('should detect a variable assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = myVariable;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      should.equal(info.type, undefined);
      info.name.should.equal('myVariable');
    });

    it('should detect an executed assigned to module.exports', function () {
      var info = detectCodeInfo('module.exports = require("./lib");');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      should.equal(info.type, undefined);
      should.equal(info.name, undefined);
    });
  });

  describe('exports assignment', function () {
    it('should detect a string assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = "string";');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('String');
      info.name.should.equal('myVariable');
    });

    it('should detect a number assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = 0;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Number');
      info.name.should.equal('myVariable');
    });

    it('should detect a float assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = 0.0;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Float');
      info.name.should.equal('myVariable');
    });

    it('should detect a boolean assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = true;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Boolean');
      info.name.should.equal('myVariable');
    });

    it('should detect undefined assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = undefined;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Undefined');
      info.name.should.equal('myVariable');
    });

    it('should detect null assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = null;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Null');
      info.name.should.equal('myVariable');
    });

    it('should detect an object assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Object');
      info.name.should.equal('myVariable');
    });

    it('should detect an array assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = [];');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Array');
      info.name.should.equal('myVariable');
    });

    it('should detect a function assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = function () {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Function');
      info.name.should.equal('myVariable');
    });

    it('should detect a named function assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = function myFunction () {};');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      info.type.should.equal('Function');
      info.name.should.equal('myVariable');
    });

    it('should detect a variable assigned to exports', function () {
      var info = detectCodeInfo('exports.myVariable = myOtherVariable;');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      should.equal(info.type, undefined);
      info.name.should.equal('myVariable');
    });

    it('should detect an executed assigned to module.exports', function () {
      var info = detectCodeInfo('exports.myVariable = require("./lib");');

      info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
      info.exports.should.equal(true);
      should.equal(info.type, undefined);
      info.name.should.equal('myVariable');
    });
  });

  it('should set access to private with a name starting with _', function () {
    var info = detectCodeInfo('myVariable.prototype._privateVariable = "string";');

    info.should.be.an.Object.and.have.properties('access', 'exports', 'type', 'name');
    info.exports.should.equal(false);
    info.access.should.equal('private');
    info.type.should.equal('String');
    info.name.should.equal('_privateVariable');
  });

  it('should return undefined for name and type if it can\'t find it', function () {
    var info = detectCodeInfo('');

    info.should.be.an.Object.and.have.properties('exports', 'type', 'name');
    info.exports.should.equal(false);
    should.equal(info.type, undefined);
    should.equal(info.name, undefined);
  });
});
