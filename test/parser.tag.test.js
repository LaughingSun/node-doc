
var should = require('should');

describe('Tag parser', function () {
  var parseTag = require('../lib/parsers/tag');

  describe('access', function () {
    it('should accept access with public tag', function () {
      var tag = parseTag('@access public');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('access');
      tag.value.should.equal('public');
    });

    it('should accept public tag', function () {
      var tag = parseTag('@public');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('access');
      tag.value.should.equal('public');
    });

    it('should accept access with private tag', function () {
      var tag = parseTag('@access private');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('access');
      tag.value.should.equal('private');
    });

    it('should accept private tag', function () {
      var tag = parseTag('@private');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('access');
      tag.value.should.equal('private');
    });

    it('should throw on wrong access input', function () {
      (function () {
        var tag = parseTag('@access wrong');
      }).should.throw('@access only supports public, private');
    });
  });

  describe('callback', function () {
    it('should accept callback tag', function () {
      var tag = parseTag('@callback myCallback');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('callback');
      tag.value.should.be.an.Object.and.have.properties('name');
      tag.value.name.should.equal('myCallback');
    });

    it('should ignore everything but the name', function () {
      var tag = parseTag('@callback myCallback My description of the callback.');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('callback');
      tag.value.should.be.an.Object.and.have.properties('name', 'desc');
      tag.value.name.should.equal('myCallback');
      tag.value.desc.should.equal('My description of the callback.');
    });
  });

  describe('constant', function () {
    it('should accept constant tag', function () {
      var tag = parseTag('@constant MY_CONSTANT');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('constant');
      tag.value.should.be.an.Object.and.have.property('name', 'MY_CONSTANT');
    });

    it('should accept constant tag with type', function () {
      var tag = parseTag('@constant MY_CONSTANT {Number}');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('constant');
      tag.value.should.be.an.Object.and.have.properties('name', 'type');
      tag.value.name.should.equal('MY_CONSTANT');
      tag.value.type.should.equal('Number');
    });

    it('should accept constant tag with desc', function () {
      var tag = parseTag("@constant MY_CONSTANT It's mine!");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('constant');
      tag.value.should.be.an.Object.and.have.properties('name', 'desc');
      tag.value.name.should.equal('MY_CONSTANT');
      tag.value.desc.should.equal("It's mine!");
    });

    it('should accept constant tag with type and desc', function () {
      var tag = parseTag("@constant MY_CONSTANT {Number} It's mine!");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('constant');
      tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc');
      tag.value.name.should.equal('MY_CONSTANT');
      tag.value.type.should.equal('Number');
      tag.value.desc.should.equal("It's mine!");
    });
  });

  describe('constructor', function () {
    it('should accept constructor tag', function () {
      var tag = parseTag('@constructor');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('constructor');
      tag.value.should.equal(true);
    });

    it('should ignore anything behind the constructor tag', function () {
      var tag = parseTag('@constructor this gets ignored');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('constructor');
      tag.value.should.equal(true);
    });
  });

  describe('deprecated', function () {
    it('should accept deprecated tag', function () {
      var tag = parseTag('@deprecated');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('deprecated');
      tag.value.should.equal(true);
    });

    it('should accept an optional deprecation message', function () {
      var tag = parseTag('@deprecated An message to display.');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('deprecated');
      tag.value.should.equal('An message to display.');
    });
  });

  describe('example', function () {
    it('should accept example tag', function () {
      var tag = parseTag('@example var doc = parse(file);');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('example');
      tag.value.should.equal('var doc = parse(file);');
    });
  });

  describe('param, subparam', function () {
    it('should accept param tag', function () {
      var tag = parseTag('@param myParam');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('param');
      tag.value.should.be.an.Object.and.have.property('name', 'myParam');
    });

    it('should accept an optional param tag', function () {
      var tag = parseTag('@param [myParam]');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('param');
      tag.value.should.be.an.Object.and.have.properties('name', 'optional');
      tag.value.name.should.equal('myParam');
      tag.value.optional.should.be.true;
    });

    it('should accept param tag with type', function () {
      var tag = parseTag('@param myParam {Number}');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('param');
      tag.value.should.be.an.Object.and.have.properties('name', 'type');
      tag.value.name.should.equal('myParam');
      tag.value.type.should.equal('Number');
    });

    it('should accept an optional param tag with type', function () {
      var tag = parseTag('@param [myParam] {Number}');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('param');
      tag.value.should.be.an.Object.and.have.properties('name', 'type', 'optional');
      tag.value.name.should.equal('myParam');
      tag.value.type.should.equal('Number');
    });

    it('should accept param tag with desc', function () {
      var tag = parseTag("@param myParam The param to do stuff");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('param');
      tag.value.should.be.an.Object.and.have.properties('name', 'desc');
      tag.value.name.should.equal('myParam');
      tag.value.desc.should.equal("The param to do stuff");
    });

    it('should accept an optional param tag with desc', function () {
      var tag = parseTag("@param [myParam] The param to do stuff");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('param');
      tag.value.should.be.an.Object.and.have.properties('name', 'desc', 'optional');
      tag.value.name.should.equal('myParam');
      tag.value.desc.should.equal("The param to do stuff");
      tag.value.optional.should.be.true;
    });

    it('should accept param tag with type and desc', function () {
      var tag = parseTag("@param myParam {Number} The param to do stuff");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('param');
      tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc');
      tag.value.name.should.equal('myParam');
      tag.value.type.should.equal('Number');
      tag.value.desc.should.equal("The param to do stuff");
    });

    it('should accept an optional param tag with type and desc', function () {
      var tag = parseTag("@param [myParam] {Number} The param to do stuff");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('param');
      tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc', 'optional');
      tag.value.name.should.equal('myParam');
      tag.value.type.should.equal('Number');
      tag.value.desc.should.equal("The param to do stuff");
      tag.value.optional.should.be.true;
    });

    it('should accept param tag that is a part of the another param', function () {
      var tag = parseTag("@param object.sub {Number} The param to do stuff");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('subparam');
      tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc', 'master');
      tag.value.master.should.equal('object');
      tag.value.name.should.equal('sub');
      tag.value.type.should.equal('Number');
      tag.value.desc.should.equal("The param to do stuff");
    });

    it('should accept an optional param tag that is a part of the another param', function () {
      var tag = parseTag("@param [object.sub] {Number} The param to do stuff");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('subparam');
      tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc', 'optional', 'master');
      tag.value.master.should.equal('object');
      tag.value.name.should.equal('sub');
      tag.value.type.should.equal('Number');
      tag.value.desc.should.equal("The param to do stuff");
      tag.value.optional.should.be.true;
    });

    it('should throw if an param doesn\'t have a name', function () {
      (function () {
        var tag = parseTag('@param');
      }).should.throw('Doesn\'t have a name');
    });

    it('should throw if an param doesn\'t have a name, but does have a type', function () {
      (function () {
        var tag = parseTag('@param {Number}');
      }).should.throw('Doesn\'t have a name');
    });

    it('should throw if the param name is the optional brackets', function () {
      (function () {
        var tag = parseTag('@param []');
      }).should.throw('Doesn\'t have a name');
    });
  });

  describe('return, subreturn', function () {
    it('should accept return tag with description', function () {
      var tag = parseTag('@return Something I returned');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('return');
      tag.value.should.be.an.Object.and.have.property('desc', 'Something I returned');
    });

    it('should accept return tag with a single word description', function () {
      var tag = parseTag('@return description');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('return');
      tag.value.should.be.an.Object.and.have.property('desc', 'description');
    });

    it('should accept return tag with type', function () {
      var tag = parseTag('@return {Number}');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('return');
      tag.value.should.be.an.Object.and.have.property('type', 'Number');
    });

    it('should accept return tag with type and desc', function () {
      var tag = parseTag("@return {Number} The return to do stuff");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('return');
      tag.value.should.be.an.Object.and.have.properties('type', 'desc');
      tag.value.type.should.equal('Number');
      tag.value.desc.should.equal("The return to do stuff");
    });

    it('should accept subreturn tag with description', function () {
      var tag = parseTag('@return .name Something I returned.');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('subreturn');
      tag.value.should.be.an.Object.and.have.properties('desc', 'name');
      tag.value.desc.should.equal('Something I returned.');
      tag.value.name.should.equal('name');
    });

    it('should accept subreturn tag with type', function () {
      var tag = parseTag('@return .name {Number}');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('subreturn');
      tag.value.should.be.an.Object.and.have.properties('name', 'type');
      tag.value.name.should.equal('name');
      tag.value.type.should.equal('Number');
    });

    it('should accept subreturn tag with type and desc', function () {
      var tag = parseTag("@return .name {Number} The return to do stuff.");

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('subreturn');
      tag.value.should.be.an.Object.and.have.properties('type', 'name', 'type', 'desc');
      tag.value.name.should.equal('name');
      tag.value.type.should.equal('Number');
      tag.value.desc.should.equal('The return to do stuff.');
    });

    it('should throw if an return doesn\'t have a name', function () {
      (function () {
        var tag = parseTag('@return');
      }).should.throw('Requires an description or a type');
    });
  });

  describe('throws', function () {
    it('should accept throws tag', function () {
      var tag = parseTag('@throws error message');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('throws');
      tag.value.should.equal('error message');
    });

    it('should accept throw tag', function () {
      var tag = parseTag('@throw error message');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('throws');
      tag.value.should.equal('error message');
    });

    it('should throw if the throws tag doesn\'t have a message', function () {
      (function () {
        var tag = parseTag('@throws');
      }).should.throw('No error message');
    });
  });

  describe('todo', function () {
    it('should accept todo tag', function () {
      var tag = parseTag('@todo Item');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('todo');
      tag.value.should.be.an.Array.and.have.lengthOf(1);
      tag.value[0].should.equal('Item');
    });

    it('should accept todo tag with multiple items', function () {
      var tag = parseTag('@todo - Item 1 - Item 2 - Item 3');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('todo');
      tag.value.should.be.an.Array.and.have.lengthOf(3);
      tag.value[0].should.equal('Item 1');
      tag.value[1].should.equal('Item 2');
      tag.value[2].should.equal('Item 3');
    });

    it('should skip empty list items', function () {
      var tag = parseTag('@todo - Item 1 - - Item 2 - Item 3');

      tag.should.be.an.Object.and.have.properties('type', 'value');
      tag.type.should.equal('todo');
      tag.value.should.be.an.Array.and.have.lengthOf(3);
      tag.value[0].should.equal('Item 1');
      tag.value[1].should.equal('Item 2');
      tag.value[2].should.equal('Item 3');
    });

    it('should throw if no items are given', function () {
      (function () {
        var tag = parseTag('@todo');
      }).should.throw('@todo requires items you need to do');
    });

    it('should throw if no items are given with item point', function () {
      (function () {
        var tag = parseTag('@todo - ');
      }).should.throw('@todo requires items you need to do');
    });

    it('should throw if no items are given with two item points', function () {
      (function () {
        var tag = parseTag('@todo -  -');
      }).should.throw('@todo requires items you need to do');
    });
  });

  it('should throw if a tag is not supported', function () {
    (function () {
      var err = parseTag('@wrongTag');
    }).should.throw('Unknown tag: wrongTag');
  });
});
