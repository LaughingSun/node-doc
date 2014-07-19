var should = require('should');

describe('File parser', function () {
  var fileParser = require('../../lib/parsers/file')
    , root = process.cwd() + '/test/files/file/';

  describe('Options', function () {
    var file = root + 'options/assert.js'
      , assert = require(file);

    it.skip('should allow options to be skipped', function (cb) {
      fileParser(file, function (err, doc) {
        assert(err, doc, false, cb);
      });
    });

    it('should accept an object as options', function (cb) {
      fileParser(file, {private: false}, function (err, doc) {
        assert(err, doc, false, cb);
      });
    });

    it('should accept an object as options with private true', function (cb) {
      fileParser(file, {private: true}, function (err, doc) {
        assert(err, doc, true, cb);
      });
    });
  });

  describe('Requires', function () {
    var dir = root + 'requires/'
      , assert = require(dir + 'assert');

    it('should doc and require file starting with ./', function (cb) {
      fileParser(dir + 'same-dir-module.js', function (err, doc) {
        assert(err, doc, 'same-dir-module', cb);
      });
    });

    it('should doc and require file starting with ../', function (cb) {
      fileParser(dir + 'lower/upper-dir-module.js', function (err, doc) {
        assert(err, doc, 'upper-dir-module', cb);
      });
    });

    it.skip('should doc and require file starting with /', function (cb) {
      // Can't use variables in require call yet

      fileParser(dir + 'absolute-dir-module.js', function (err, doc) {
        assert(err, doc, 'absolute-dir-module', cb);
      });
    });

    it('should not doc Node/NPM modules even in case of holder file', function (cb) {
      fileParser(dir + 'npm-module.js', function (err, doc) {
        should.equal(err, undefined);
        doc.should.be.an.Object.and.have.property('name', 'npm-module');
        cb();
      });
    });
  });

  describe('Namespaces', function () {
    var dir = root + 'namespaces/';

    it.skip('should accept multiple namespaces', function (cb) {
      var file = dir + 'multi-ns-export.js'
        , assert = require(dir + '/multi-ns-assert.js');

      fileParser(file, function (err, doc) {
        assert(err, doc, true, cb);
      });
    });

    it.skip('should accept multiple namespaces with them being exported', function (cb) {
      var file = dir + 'multi-ns-no-export.js'
        , assert = require(dir + '/multi-ns-assert.js');

      fileParser(file, function (err, doc) {
        assert(err, doc, false, cb);
      });
    });

    it('should not add empty document object to the namespaces object', function (cb) {
      fileParser(dir + 'empty-require.js', function (err, doc) {
        doc.should.be.an.Object.and.have.properties('name');
        doc.name.should.equal('empty-require');
        should.equal(doc.namespaces, undefined);

        cb();
      });
    });
  });

  it.skip('should not add an global todo to a variable', function (cb) {
    fileParser(root + 'global-todo.js', function (err, doc) {
      doc.should.be.an.Object.and.have.properties('name', 'todos');
      doc.name.should.equal('global-todo');
      doc.todos.should.be.an.Object.and.have.properties('global');
      doc.todos.global.should.be.an.Array.and.have.lengthOf(1);
      doc.todos.global[0].should.equal('Something we still haven\'t done yet.');

      cb();
    });
  });

  it('should accept a file without exports', function (cb) {
    fileParser(root + 'no-exports.js', function (err, doc) {
      doc.name.should.equal('no-exports');
      doc.functions.should.be.an.Object.and.have.property('MyConstructor');

      should.equal(doc.ns, undefined);

      var MyConstructor = doc.functions.MyConstructor;
      MyConstructor.should.be.an.Object.and.have.properties('type', 'name');
      MyConstructor.type.should.equal('Constructor');
      MyConstructor.name.should.equal('MyConstructor');
      MyConstructor.access.should.equal('public');

      cb();
    });
  });

  describe('Errors', function () {
    var dir = root + 'errors/';

    it('should return undefined if the file is empty', function (cb) {
      fileParser(dir + 'empty.js', function (err, doc) {
        should.equal(doc, undefined);
        cb();
      });
    });

    it('should return undefined if the file is empty with holder file', function (cb) {
      fileParser(dir + 'index.js', function (err, doc) {
        should.equal(doc, undefined);
        cb();
      });
    });

    it.skip('should return an error if an required file is not found', function (cb) {
      var file = dir + 'not-found-module.js';

      console.log(file)

      fileParser(file, function (err, doc) {
        err.should.be.an.Error;
        err.message.should.equal('File "' + file + '" not found');
        cb();
      });
    });

    it.skip('should return an error if an undocumented variable gets exported', function (cb) {
      fileParser(dir + 'export-variable-no-doc.js', function (err) {
        // Currently not throwing an error but returning doc with only a name
        err.should.be.an.Error;
        err.message.should.equal('Variable assigned to exports that is not documented');
        cb();
      });
    });

    it('should return an error if it has a wrong tag', function (cb) {
      fileParser(dir + 'wrong-tag.js', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('Unknown tag: wrongTag. On line 2 of the file');
        cb();
      });
    });

    it('should return an error if the doesn\'t exists', function (cb) {
      fileParser(dir + 'notFound.js', function (err) {
        err.should.be.an.Error;
        err.message.should.equal('File "' + dir + 'notFound.js" not found');
        cb();
      });
    });

    it.skip('should throw if require file is not found with holder file', function (cb) {
      fileParser(dir + 'index2.js', function (err, doc) {
        err.should.be.an.Error;
        err.message.should.equal('File "' + dir + 'notFound.js" not found');
        cb();
      });
    });

    it('should return an error if the given input is not a string', function (cb) {
      fileParser([], function (err) {
        err.should.be.an.Error;
        err.message.should.equal('Input file location not a string');
        cb();
      });
    });
  });
});
