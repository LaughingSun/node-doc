var should = require('should');

describe('Constructor', function () {
  var constructDoc = require('../lib/constructor');

  it('should construct a documentation object', function () {
    var doc = constructDoc({name: 'My app'}, [], {});
    doc.should.be.an.Object.and.have.property('name', 'My app');
  });

  describe('Extra information', function () {
    it('should add extra information to the documentation object', function () {
      var doc = constructDoc({
        name: 'My app',
        author: {name: 'Thomas de Zeeuw'},
        description: 'My awesome application',
        license: 'MIT',
        version: '0.0.0'
      }, [], {});

      doc.should.be.an.Object;
      doc.name.should.equal('My app');
      doc.author.should.be.an.Object.and.have.property('name', 'Thomas de Zeeuw');
      doc.desc.should.equal('My awesome application');
      doc.license.should.equal('MIT');
      doc.version.should.equal('0.0.0');
    });

    it('should not add extra information to the documentation object if it\'s an namespace object', function () {
      var doc = constructDoc({
        name: 'My app',
        author: {name: 'Thomas de Zeeuw'},
        description: 'My awesome application',
        license: 'MIT',
        version: '0.0.0',
        ns: true
      }, [], {});

      doc.should.be.an.Object;
      doc.name.should.equal('My app');
      should.equal(doc.author, undefined);
      should.equal(doc.desc, undefined);
      should.equal(doc.license, undefined);
      should.equal(doc.version, undefined);
    });
  });
});
