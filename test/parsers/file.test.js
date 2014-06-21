var path = require('path')
  , should = require('should')
  , mock = require('mock-fs');

// TEMP, Mock-fs bug: https://github.com/tschaub/mock-fs/issues/12
var fs = require('fs');

describe('File parser', function () {
  var fileParser = require('../../lib/parsers/file')
    , oldWorkingDir = process.cwd()
    , dir = process.cwd() + '/test/files/';

  // Self asserting files
  var assert1 = require(dir + 'assert1')
    , assert1File = fs.readFileSync(dir + 'assert1.js')
    , assert2 = require(dir + 'assert2')
    , assert2File = fs.readFileSync(dir + 'assert2.js');

  before(function () {
    process.chdir(dir);
  });

  after(function () {
    process.chdir(oldWorkingDir);
  });

  afterEach(function () {
    mock.restore();
  });

  describe('Options', function () {
    var file = dir + 'assert.js'
      , assert = assert1;

    // TEMP, Mock-fs bug: https://github.com/tschaub/mock-fs/issues/12
    // When fixed, just do it 1 time in describe file parser, and drop afterEach restore
    beforeEach(function () {
      mock({
        'assert.js': assert1File
      });
    });

    it('should default to hiding private comments', function (cb) {
      fileParser(file, function (err, doc) {
        assert(err, doc, false, cb);
      });
    });

    it('should accept only a boolean as options', function (cb) {
      fileParser(file, true, function (err, doc) {
        assert(err, doc, true, cb);
      });
    });

    it('should accept an object as options', function (cb) {
      fileParser(file, {private: true}, function (err, doc) {
        assert(err, doc, true, cb);
      });
    });
  });

  describe('parseRequires', function () {
    /** @todo parseRequires tests! */
  });

  describe('Namespaces', function () {
    var file = dir + 'index.js';

    it('should accept multiple namespaces', function (cb) {
      mock({
        'index.js': [
          'var getPath = require("./lib/getPath")',
          '  , reversePath = require("./lib/reversePath");',
          '',
          'var myPath = getPath();',
          'var reversedPath = reversedPath(myPath);',
          '',
          'module.exports = reversedPath;'
        ].join('\n'),
        'lib/getPath.js': [
          '/** @return {String}  */',
          'module.exports = function getPath () {',
          ' return "Some path";',
          '}'
        ].join('\n'),
        'lib/reversePath.js': [
          // Aw, bad maintainer, no documentation!
          'module.exports = function reversePath (path) {',
          ' return return path.split("").reverse().join("");',
          '}'
        ].join('\n')
      });

      fileParser(file, function (err, doc) {
        doc.name.should.equal('files');
        doc.exports.should.equal('reversedPath');
        doc.ns.should.be.an.Object.and.have.properties('getPath', 'reversePath');

        var getPath = doc.ns.getPath;
        getPath.name.should.equal('getPath');
        getPath.exports.should.equal('getPath');

        [doc.functions.getPath, getPath.functions.getPath].forEach(function (getPath, i) {
          getPath.should.be.an.Object.and.have.properties('access', 'exports', 'type', 'name');
          getPath.access.should.equal('public');
          getPath.exports.should.equal(true);
          getPath.type.should.equal('Function');
          getPath.name.should.equal('getPath');
          getPath.return.should.be.an.Object.and.have.property('type', 'String');

          // First time it's required and it should say so
          if (i === 0) getPath.required.should.equal(true);
        });

        var reversePath = doc.ns.reversePath;
        reversePath.name.should.equal('reversePath');
        reversePath.exports.should.equal('reversePath');

        cb();
      });
    });

    it.skip('should handle todo tags in an empty doc', function (cb) {
      mock({
        'index.js': [
          '/** @todo Something */',
          'module.exports = require("./lib/nothing");'
        ].join('\n'),
        'lib/nothing.js': ''
      });

      fileParser(file, function (err, doc) {
        cb(new Error('Not working yet!'));
      });
    });

    it('should not add empty document object to the namespaces object', function (cb) {
      mock({
        'index.js': [
          'var nothing = require("./lib/nothing");'
        ].join('\n'),
        'lib/nothing.js': ''
      });

      fileParser(file, function (err, doc) {
        doc.should.be.an.Object.and.have.properties('name');
        doc.name.should.equal('files');

        cb();
      });
    });
  });

  it.skip('should not add an global todo to a variable', function (cb) {
    mock({
      'index.js': [
        '/** @todo Something we still haven\'t done yet. */',
        '',
        'var nothing = require("./lib/nothing");'
      ].join('\n'),
      'lib/nothing.js': ''
    });

    fileParser(file, function (err, doc) {
      console.log();
      console.log('result doc', doc);

      doc.should.be.an.Object.and.have.properties('name', 'todos');
      doc.name.should.equal('files');
      doc.todos.should.be.an.Object.and.have.properties('global');
      doc.todos.global.should.be.an.Array.and.have.lengthOf(1);
      doc.todos.global[0].should.equal('Something we still haven\'t done yet.');

      cb();
    });
  });

  it('should accept a file without exports', function (cb) {
    mock({
      'index.js': [
        '/** @constructor */',
        'function MyConstructor () {',
        ' return this;',
        '}'
      ].join('\n')
    });

    fileParser(dir + 'index.js', function (err, doc) {
      doc.name.should.equal(path.basename(dir));
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

  it('should not doc Node/NPM modules even in case of holder file', function (cb) {
    mock({
      'index.js': [
        'module.exports = require("fs");', // Should not doc this require
      ].join('\n')
    });

    fileParser(dir + 'index.js', function (err, doc) {
      should.equal(err, undefined);
      should.equal(doc, undefined);
      cb();
    });
  });

  it('should throw if require file is not found', function (cb) {
    mock({
      'index.js': 'module.exports = require("./notFound.js");'
    });

    fileParser(dir + 'index.js', function (err, doc) {
      err.should.be.an.Error;
      err.message.should.equal('File "' + dir + 'notFound.js" not found');
      cb();
    });
  });

  describe('Errors', function () {
    var file = dir + 'index.js';

    it('should return undefined if the file is empty', function (cb) {
      mock({
        'index.js': ''
      });

      fileParser(file, function (err, doc) {
        should.equal(doc, undefined);
        cb();
      });
    });

    it('should return undefined if the file is empty with holder file', function (cb) {
      mock({
        'index.js': [
          'module.exports = require("./index2");'
        ].join('\n'),
        'index2.js': ''
      });

      fileParser(file, function (err, doc) {
        should.equal(doc, undefined);
        cb();
      });
    });

    it('should return an error if it has a wrong tag', function (cb) {
      mock({
        'index.js': [
          '/** ',
          ' * @wrongTag',
          ' */'
        ].join('\n')
      });

      fileParser(file, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('Unknown tag: wrongTag. On line 2 of the file');
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

    it('should return an error if the doesn\'t exists', function (cb) {
      var file = dir + 'notFound.js';

      fileParser(file, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('File "' + file + '" not found');
        cb();
      });
    });
  });
});
