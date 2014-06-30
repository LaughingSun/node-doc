var path = require('path')
  , should = require('should');

describe('resolveFile', function () {
  var resolveFile = require('../../lib/util/resolver')
    , dir = process.cwd() + '/test/files/resolver/';

  it('should accept an absolute path', function () {
    var file = path.normalize(dir + 'index.js');
    var requirePath = resolveFile(file, dir);
    requirePath.should.equal(file);
  });

  it('should accept a relative path', function () {
    var requirePath = resolveFile('./index.js', dir);
    requirePath.should.equal(path.normalize(dir + 'index.js'));
  });

  it('should accept a parent directory path', function () {
    var file = '../index.js'
    var requirePath = resolveFile(file, dir);
    requirePath.should.equal(path.resolve(dir, file));
  });

  it.skip('should return undefined for Node/NPM modules', function () {
    var file = 'fs.js'
    var requirePath = resolveFile(file, dir);
    should.equal(requirePath, undefined);
  });

  it('should add .js if the file isn\'t found', function () {
    var file = path.normalize(dir + 'index');
    var requirePath = resolveFile(file, dir);
    requirePath.should.equal(file + '.js');
  });

  it('should add index.js if the path is an directory and check if it exists', function () {
    var file = path.normalize(dir + 'notFound');
    var requirePath = resolveFile(file, dir);
    should.equal(requirePath, undefined);
  });

  it('should add index.js if the path is an directory', function () {
    var file = path.normalize(dir + 'lib');
    var requirePath = resolveFile(file, dir);
    requirePath.should.equal(file + '/index.js');
  });
});
