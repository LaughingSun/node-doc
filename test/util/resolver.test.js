var path = require('path')
  , should = require('should');

describe('resolveRequireFile', function () {
  var resolveRequireFile = require('../../lib/util/resolver')
    , dir = process.cwd() + '/test/files/resolver/';

  /**
   * Put a require call around a path
   *
   * @param  path {String} The path to put in the require call.
   * @return      {String} A require call around the path.
   */
  function r (path) {
    return 'require(\'' + path + '\');';
  }

  it('should accept an absolute path', function () {
    var file = dir + 'index.js';
    var requirePath = resolveRequireFile(r(file), dir);
    requirePath.should.equal(file);
  });

  it('should accept a relative path', function () {
    var requirePath = resolveRequireFile(r('./index.js'), dir);
    requirePath.should.equal(dir + 'index.js');
  });

  it('should accept a parent directory path', function () {
    var file = '../index.js'
    var requirePath = resolveRequireFile(r(file), dir);
    requirePath.should.equal(path.resolve(dir, file));
  });

  it('should return undefined for Node/NPM modules', function () {
    var file = 'fs.js'
    var requirePath = resolveRequireFile(r(file), dir);
    should.equal(requirePath, undefined);
  });

  it('should add .js if the file isn\'t found', function () {
    var file = dir + 'index';
    var requirePath = resolveRequireFile(r(file), dir);
    requirePath.should.equal(file + '.js');
  });

  it('should add index.js if the path is an directory and check if it exists', function () {
    var file = dir + 'notFound';
    var requirePath = resolveRequireFile(r(file), dir);
    should.equal(requirePath, undefined);
  });

  it('should add index.js if the path is an directory', function () {
    var file = dir + 'lib';
    var requirePath = resolveRequireFile(r(file), dir);
    requirePath.should.equal(file + '/index.js');
  });
});
