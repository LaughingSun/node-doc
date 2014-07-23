var should = require('should');

describe('Tag parser', function () {
  var parseTag = require('../../lib/parsers/tag');

  describe.skip('access', function () {
    it('should accept access with public tag', function () {
      parseTag('@access public', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('access');
        tag.value.should.equal('public');
      });
    });

    it('should accept access with private tag', function () {
      parseTag('@access private', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('access');
        tag.value.should.equal('private');
      });
    });

    it('should accept public tag', function () {
      parseTag('@public', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('access');
        tag.value.should.equal('public');
      });
    });

    it('should accept private tag', function () {
      parseTag('@private', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('access');
        tag.value.should.equal('private');
      });
    });

    it('should return an error on wrong access input', function () {
      parseTag('@access wrong', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@access only supports public, private');
      });
    });
  });

  describe('callback', function () {
    it('should accept callback tag', function () {
      parseTag('@callback myCallback', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('callback');
        tag.value.should.be.an.Object.and.have.properties('name');
        tag.value.name.should.equal('myCallback');
      });
    });

    it('should ignore everything but the name', function () {
      parseTag('@callback myCallback My description of the callback.', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('callback');
        tag.value.should.be.an.Object.and.have.properties('name', 'desc');
        tag.value.name.should.equal('myCallback');
        tag.value.desc.should.equal('My description of the callback.');
      });
    });

    it('should return an error if callback doesn\'t have a name', function () {
      parseTag('@callback', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@callback requires a name');
      });
    });
  });

  describe.skip('constant', function () {
    it('should accept constant tag', function () {
      parseTag('@constant MY_CONSTANT', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('constant');
        tag.value.should.be.an.Object.and.have.property('name', 'MY_CONSTANT');
      });
    });

    it('should accept constant tag with type', function () {
      parseTag('@constant MY_CONSTANT {Number}', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('constant');
        tag.value.should.be.an.Object.and.have.properties('name', 'type');
        tag.value.name.should.equal('MY_CONSTANT');
        tag.value.type.should.equal('Number');
      });
    });

    it('should accept constant tag with description', function () {
      parseTag('@constant MY_CONSTANT It\'s mine!', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('constant');
        tag.value.should.be.an.Object.and.have.properties('name', 'desc');
        tag.value.name.should.equal('MY_CONSTANT');
        tag.value.desc.should.equal('It\'s mine!');
      });
    });

    it('should accept constant tag with type and description', function () {
      parseTag('@constant MY_CONSTANT {Number} It\'s mine!', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('constant');
        tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc');
        tag.value.name.should.equal('MY_CONSTANT');
        tag.value.type.should.equal('Number');
        tag.value.desc.should.equal('It\'s mine!');
      });
    });
  });

  describe('constructor', function () {
    it('should accept constructor tag', function () {
      parseTag('@constructor', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('constructor');
        tag.value.should.equal(true);
      });
    });

    it('should ignore anything after the constructor tag', function () {
      parseTag('@constructor this gets ignored', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('constructor');
        tag.value.should.equal(true);
      });
    });
  });

  describe('deprecated', function () {
    it('should accept deprecated tag', function () {
      parseTag('@deprecated', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('deprecated');
        tag.value.should.equal(true);
      });
    });

    it('should accept an optional message', function () {
      parseTag('@deprecated An message to display.', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('deprecated');
        tag.value.should.equal('An message to display.');
      });
    });
  });

  describe('example', function () {
    it('should accept example tag', function () {
      parseTag('@example var doc = parse(file);', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('example');
        tag.value.should.equal('var doc = parse(file);');
      });
    });
  });

  describe('param, subparam', function () {
    it('should accept param tag', function () {
      parseTag('@param myParam', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('param');
        tag.value.should.be.an.Object.and.have.property('name', 'myParam');
      });
    });

    it('should accept param tag with type', function () {
      parseTag('@param myParam {Number}', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('param');
        tag.value.should.be.an.Object.and.have.properties('name', 'type');
        tag.value.name.should.equal('myParam');
        tag.value.type.should.equal('Number');
      });
    });

    it('should accept param tag with description', function () {
      parseTag('@param myParam The param to do stuff', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('param');
        tag.value.should.be.an.Object.and.have.properties('name', 'desc');
        tag.value.name.should.equal('myParam');
        tag.value.desc.should.equal('The param to do stuff');
      });
    });

    it('should accept param tag with type and description', function () {
      parseTag('@param myParam {Number} The param to do stuff', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('param');
        tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc');
        tag.value.name.should.equal('myParam');
        tag.value.type.should.equal('Number');
        tag.value.desc.should.equal('The param to do stuff');
      });
    });

    it('should accept an optional param tag', function () {
      parseTag('@param [myParam]', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('param');
        tag.value.should.be.an.Object.and.have.properties('name', 'optional');
        tag.value.name.should.equal('myParam');
        tag.value.optional.should.be.true;
      });
    });

    it('should accept an optional param tag with type', function () {
      parseTag('@param [myParam] {Number}', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('param');
        tag.value.should.be.an.Object.and.have.properties('name', 'type', 'optional');
        tag.value.name.should.equal('myParam');
        tag.value.type.should.equal('Number');
      });
    });

    it('should accept an optional param tag with description', function () {
      parseTag('@param [myParam] The param to do stuff', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('param');
        tag.value.should.be.an.Object.and.have.properties('name', 'desc', 'optional');
        tag.value.name.should.equal('myParam');
        tag.value.desc.should.equal('The param to do stuff');
        tag.value.optional.should.be.true;
      });
    });

    it('should accept an optional param tag with type and description', function () {
      parseTag('@param [myParam] {Number} The param to do stuff', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('param');
        tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc', 'optional');
        tag.value.name.should.equal('myParam');
        tag.value.type.should.equal('Number');
        tag.value.desc.should.equal('The param to do stuff');
        tag.value.optional.should.be.true;
      });
    });

    it('should accept subparam tag that is a part of the another param', function () {
      parseTag('@param object.sub The param to do stuff', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('subparam');
        tag.value.should.be.an.Object.and.have.properties('name', 'desc', 'master');
        tag.value.master.should.equal('object');
        tag.value.name.should.equal('sub');
        tag.value.desc.should.equal('The param to do stuff');
      });
    });

    it('should accept an optional subparam tag that is a part of the another param', function () {
      parseTag('@param [object.sub] {Number}', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('subparam');
        tag.value.should.be.an.Object.and.have.properties('name', 'type', 'optional', 'master');
        tag.value.master.should.equal('object');
        tag.value.name.should.equal('sub');
        tag.value.type.should.equal('Number');
        tag.value.optional.should.be.true;
      });
    });

    it('should return an error if a param doesn\'t have a name', function () {
      parseTag('@param', function (err) {
      err.should.be.an.Error;
      err.message.should.equal('@param requires a name');
      });
    });

    it('should return an error if a param doesn\'t have a name, but does have a type', function () {
      parseTag('@param {Number}', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@param requires a name');
      });
    });

    it('should return an error if the param name is only the optional brackets', function () {
      parseTag('@param []', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@param requires a name');
      });
    });
  });

  describe('return, subreturn', function () {
    it('should accept return tag with description', function () {
      parseTag('@return Something I returned', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('return');
        tag.value.should.be.an.Object.and.have.property('desc', 'Something I returned');
      });
    });

    it('should accept return tag with a single word description', function () {
      parseTag('@return Description', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('return');
        tag.value.should.be.an.Object.and.have.property('desc', 'Description');
      });
    });

    it('should accept return tag with type', function () {
      parseTag('@return {Number}', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('return');
        tag.value.should.be.an.Object.and.have.property('type', 'Number');
      });
    });

    it('should accept return tag with type and description', function () {
      parseTag('@return {Number} The return to do stuff', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('return');
        tag.value.should.be.an.Object.and.have.properties('type', 'desc');
        tag.value.type.should.equal('Number');
        tag.value.desc.should.equal('The return to do stuff');
      });
    });

    it('should accept return tag with name, type and description', function () {
      parseTag('@return returnName {Number} The return to do stuff', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('return');
        tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc');
        tag.value.name.should.equal('returnName');
        tag.value.type.should.equal('Number');
        tag.value.desc.should.equal('The return to do stuff');
      });
    });

    it('should accept subreturn tag with description', function () {
      parseTag('@return .name Something I returned.', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('subreturn');
        tag.value.should.be.an.Object.and.have.properties('desc', 'name');
        tag.value.desc.should.equal('Something I returned.');
        tag.value.name.should.equal('name');
      });
    });

    it('should accept subreturn tag with type', function () {
      parseTag('@return .name {Number}', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('subreturn');
        tag.value.should.be.an.Object.and.have.properties('name', 'type');
        tag.value.name.should.equal('name');
        tag.value.type.should.equal('Number');
      });
    });

    it('should accept subreturn tag with type and description', function () {
      parseTag('@return .name {Number} The return to do stuff.', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('subreturn');
        tag.value.should.be.an.Object.and.have.properties('type', 'name', 'type', 'desc');
        tag.value.name.should.equal('name');
        tag.value.type.should.equal('Number');
        tag.value.desc.should.equal('The return to do stuff.');
      });
    });

    it('should return an error if a return doesn\'t have a description or type', function () {
      parseTag('@return', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@return requires an description or a type');
      });
    });
  });

  describe('this, subthis', function () {
    it('should accept this tag with description', function () {
      parseTag('@this The this object.', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('this');
        tag.value.should.be.an.Object.and.have.property('desc', 'The this object.');
      });
    });

    it('should accept this tag with a single word description', function () {
      parseTag('@this Description', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('this');
        tag.value.should.be.an.Object.and.have.property('desc', 'Description');
      });
    });

    it('should accept subthis tag with description', function () {
      parseTag('@this .name Something I returned.', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('subthis');
        tag.value.should.be.an.Object.and.have.properties('desc', 'name');
        tag.value.desc.should.equal('Something I returned.');
        tag.value.name.should.equal('name');
      });
    });

    it('should accept subthis tag with type', function () {
      parseTag('@this .name {Number}', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('subthis');
        tag.value.should.be.an.Object.and.have.properties('name', 'type');
        tag.value.name.should.equal('name');
        tag.value.type.should.equal('Number');
      });
    });

    it('should accept subthis tag with name, type and description', function () {
      parseTag('@this .name {Number} A property.', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('subthis');
        tag.value.should.be.an.Object.and.have.properties('name', 'type', 'desc');
        tag.value.name.should.equal('name');
        tag.value.type.should.equal('Number');
        tag.value.desc.should.equal('A property.');
      });
    });

    it('should return an error if a this tag doesn\'t have a name', function () {
      parseTag('@this', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@this requires a name');
      });
    });

    it('should return an error if a this tag doesn\'t have a name but does have a type', function () {
      parseTag('@this {Number}', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@this requires a name');
      });
    });

    it('should return an error if a this tag doesn\'t have a name but does have a type and description', function () {
      parseTag('@this {Number} The this object.', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@this requires a name');
      });
    });
  });

  describe('throws', function () {
    it('should accept throws tag', function () {
      parseTag('@throws "error message" This happend when...', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('throws');
        tag.value.should.be.an.Object.and.have.properties('msg', 'cause');
        tag.value.msg.should.equal('error message');
        tag.value.cause.should.equal('This happend when...');
      });
    });

    it('should accept throw tag', function () {
      parseTag('@throw "error message" This happend when...', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('throws');
        tag.value.should.be.an.Object.and.have.properties('msg', 'cause');
        tag.value.msg.should.equal('error message');
        tag.value.cause.should.equal('This happend when...');
      });
    });

    it('should accept a causeless throws tag', function () {
      parseTag('@throws error message', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('throws');
        tag.value.should.be.an.Object.and.have.property('msg', 'error message');
      });
    });

    it('should accept a causeless throws tag with quatation marks', function () {
      parseTag('@throws "error message"', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('throws');
        tag.value.should.be.an.Object.and.have.properties('msg', 'cause');
        tag.value.msg.should.equal('error message');
        tag.value.cause.should.equal('');
      });
    });

    it('should return an error if the throws tag doesn\'t have a message', function () {
      parseTag('@throws', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@throws requires an error message');
      });
    });
  });

  describe('todo', function () {
    it('should accept todo tag', function () {
      parseTag('@todo Item', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('todo');
        tag.value.should.be.an.Array.and.have.lengthOf(1);
        tag.value[0].should.equal('Item');
      });
    });

    it('should accept todo tag with multiple items', function () {
      parseTag('@todo - Item 1 - Item 2 - Item 3', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('todo');
        tag.value.should.be.an.Array.and.have.lengthOf(3);
        tag.value[0].should.equal('Item 1');
        tag.value[1].should.equal('Item 2');
        tag.value[2].should.equal('Item 3');
      });
    });

    it('should skip empty list items', function () {
      parseTag('@todo - Item 1 - - Item 2 - Item 3', function (err, tag) {
        tag.should.be.an.Object.and.have.properties('type', 'value');
        tag.type.should.equal('todo');
        tag.value.should.be.an.Array.and.have.lengthOf(3);
        tag.value[0].should.equal('Item 1');
        tag.value[1].should.equal('Item 2');
        tag.value[2].should.equal('Item 3');
      });
    });

    it('should return an error if no items are given', function () {
      parseTag('@todo', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@todo requires items you need to do');
      });
    });

    it('should return an error if no items are given with item point', function () {
      parseTag('@todo - ', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@todo requires items you need to do');
      });
    });

    it('should return an error if no items are given with two item points', function () {
      parseTag('@todo -  -', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('@todo requires items you need to do');
      });
    });
  });

  it('should return an error if a tag is not supported', function () {
    parseTag('@wrongTag', function (err) {
      err.should.be.an.Error;
      err.message.should.equal('Unknown tag: wrongTag');
    });
  });
});
