var should = require('should')
  , resolve = require('path').resolve;

describe('Api', function () {
  var parser = require('../lib/api')
    , root = process.cwd() + '/test/files/api/'
    , oldWorkingDir = process.cwd();

  after(function () {
    process.chdir(oldWorkingDir);
  });

  it('should allow options to be skipped', function (cb) {
    var dir = root + 'no-options/'
      , assert = require(dir + 'assert');
    process.chdir(dir);

    parser(function (err, doc) {
      assert(err, doc, cb);
    });
  });

  it('should default index.js if package.json file doesn\'t specify a main', function (cb) {
    var dir = root + 'no-package/'
      , assert = require(dir + 'index');
    process.chdir(dir);

    parser(function (err, doc) {
      assert(err, doc, cb);
    });
  });

  it('should show private comments with private true', function (cb) {
    var dir = root + 'private/'
      , assert = require(dir + 'assert');
    process.chdir(dir);

    parser({
      private: true
    }, function (err, doc) {
      assert(err, doc, true, cb);
    });
  });

  it('should hide private comments with private false', function (cb) {
    var dir = root + 'private/'
      , assert = require(dir + 'assert');
    process.chdir(dir);

    parser({
      private: false
    }, function (err, doc) {
      assert(err, doc, false, cb);
    });
  });

  it('should convert the documentation object to Markdown');

  it('should convert the documentation object to HTML');

  it('should save the files if output is specified');

  describe('Errors', function () {
    it('should throw if the file can\'t be found', function (cb) {
      process.chdir(root + 'not-found/');

      parser(function (err, doc) {
        err.should.be.an.Error;
        err.message.should.equal('File "' + resolve(root, 'not-found/not-found.js') + '" not found');
        cb();
      });
    });

    it('should only accept Markdown and HTML as result', function (cb) {
      parser({result: 'MyOwnResult'}, function (err) {
        err.should.be.an.Error;
        err.message.should.equal('Result can only be Markdown or HTML');

        cb();
      });
    });

    it('should throw if the output directory can\'t be made or saved to');
  });
});
