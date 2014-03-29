require('should');

describe('File parser', function () {
  var fileParser = require('../lib/parsers/file');

  it('should detect function correctly', function () {
    var doc = fileParser([
      ' /**',
      ' * @constructor',
      '*/',
      'function MyFunction () {',
      ' return this;',
      '}'
    ]);

    doc.should.be.an.Array.and.have.lengthOf(1);
    var comment = doc[0];
    comment.should.be.an.Object.and.have.properties('type', 'name', 'constructor');
    comment.type.should.equal('Function');
    comment.name.should.equal('MyFunction');
    comment.constructor.should.be.true;
  });

  it('should detect function correctly', function () {
    var doc = fileParser([
      ' /**',
      ' * @constructor',
      '*/',
      'var MyFunction = function () {',
      ' return this;',
      '};'
    ]);

    doc.should.be.an.Array.and.have.lengthOf(1);
    var comment = doc[0];
    comment.should.be.an.Object.and.have.properties('type', 'name', 'constructor');
    comment.type.should.equal('Function');
    comment.name.should.equal('MyFunction');
    comment.constructor.should.be.true;
  });

  it('should default to Undefined if variable doesn\'t get assigned anything', function () {
    var doc = fileParser([
      ' /**',
      ' * @public',
      '*/',
      'var MyFunction;'
    ]);

    doc.should.be.an.Array.and.have.lengthOf(1);
    var comment = doc[0];
    comment.should.be.an.Object.and.have.properties('type', 'name', 'access');
    comment.type.should.equal('Undefined');
    comment.name.should.equal('MyFunction');
    comment.access.should.equal('public');
  });

  it('should detect prototype correctly', function () {
    var doc = fileParser([
      ' /**',
      ' * @return {String} Hi.',
      '*/',
      'MyFunction.prototype.sayHi = function (param1) {',
      '  return \'Hi\'',
      '};'
    ]);

    doc.should.be.an.Array.and.have.lengthOf(1);
    var comment = doc[0];
    comment.should.be.an.Object.and.have.properties('type', 'name');
    comment.type.should.equal('Function');
    comment.name.should.equal('sayHi');
    comment.return.should.be.an.Object.and.have.properties('type', 'desc');
    comment.return.type.should.equal('String');
    comment.return.desc.should.equal('Hi.');
  });

  it('should accept an global todo (no code information)', function () {
    var doc = fileParser([
      ' /**',
      ' * @todo Something I still need to do.',
      '*/'
    ]);

    doc.should.be.an.Array.and.have.lengthOf(1);
    var comment = doc[0];
    comment.should.be.an.Object.and.have.properties('todos');
    comment.todos.should.be.an.Array.and.have.lengthOf(1);
    comment.todos[0].should.equal('Something I still need to do.');
  });

  it('should accept detect multiline code correctly', function () {
    var doc = fileParser([
      ' /**',
      ' * @constant',
      '*/',
      'var',
      ' ',
      'MY_CONSTANT',
      ' ',
      '=',
      ' ',
      '\'Some string\'',
      ';'
    ]);

    doc.should.be.an.Array.and.have.lengthOf(1);
    var comment = doc[0];
    comment.should.be.an.Object.and.have.properties('type', 'name', 'constant');
    comment.type.should.equal('String');
    comment.name.should.equal('MY_CONSTANT');
    comment.constant.should.be.true;
  });

  it('should throw if the given input is not an array', function () {
    (function () {
      var comment = fileParser('', {});
    }).should.throw('Not an array');
  });
});
