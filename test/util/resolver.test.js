var path = require('path')
  , should = require('should')
  , mock = require('mock-fs');

describe('resolveRequireFile', function () {
  var resolveRequireFile = require('../../lib/util/resolver')
    , dir = process.cwd() + '/';

  /**
   * Return require around a path
   *
   * @param requirePath {String} The path to put in the require statement.
   */
  function r (requirePath) {
    return 'require(\'' + requirePath + '\');';
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
    var file = dir + 'lib';
    var requirePath = resolveRequireFile(r(file), dir);
    should.equal(requirePath, undefined);
  });

  // With file!
  it('should add index.js if the path is an directory', function () {
    mock({
      'lib/index.js': 'modules.exports = "Smile, :)"'
    });

    var file = dir + 'lib';
    var requirePath = resolveRequireFile(r(file), dir);
    requirePath.should.equal(file + '/index.js');

    mock.restore();
  });
});
