var fs = require('fs')
  , path = require('path')
  , rimraf = require('rimraf');

describe('Save', function () {
  var save = require('../lib/save')
    , dir = path.resolve(__dirname, 'files/save')
    , tmpPath = path.resolve(dir, 'tmp.json')
    , tmpFile;


  before(function () {
    tmpFile = fs.readFileSync(tmpPath, 'utf8');
  });

  after(function () {
    fs.writeFileSync(tmpPath, tmpFile, 'utf8');
  });

  it('should save the documentation object', function (cb) {
    var file = path.resolve(dir, 'main.json')
      , doc = JSON.stringify({
          name: 'my-app'
        });

    save(dir, {
      'main.json': doc
    }, function () {
      fs.readFileSync(file, 'utf8').should.equal(doc);
      fs.unlinkSync(file);
      cb();
    });
  });

  it('should save the namespace files', function (cb) {
    var file = path.resolve(dir, 'main.json')
      , file2 = path.resolve(dir, 'ns1.json')
      , doc = JSON.stringify({
          name: 'my-app'
        })
      , doc2 = JSON.stringify({
          name: 'Namespace 1'
        });

    save(dir, {
      'main.json': doc,
      'ns1.json': doc2
    }, function () {
      fs.readFileSync(file, 'utf8').should.equal(doc);
      fs.readFileSync(file2, 'utf8').should.equal(doc2);
      fs.unlinkSync(file);
      fs.unlinkSync(file2);
      cb();
    });
  });

  it('should clean the output dir', function (cb) {
    var file = path.resolve(dir, 'main.json')
      , doc = JSON.stringify({
          name: 'my-app'
        });

    save(dir, {
      'main.json': doc
    }, function () {
      fs.readFileSync(file, 'utf8').should.equal(doc);

      (function () {
        var stat = fs.statSync(tmpPath);
      }).should.throw('ENOENT, no such file or directory \'' + tmpPath + '\'');

      fs.unlinkSync(file);
      cb();
    });
  });

  it('should create the output dir if non existing', function (cb) {
    var dir2 = path.resolve(dir, 'not-here')
      , file = path.resolve(dir2, 'main.json')
      , doc = JSON.stringify({
          name: 'my-app'
        });

    save(dir2, {
      'main.json': doc
    }, function () {
      fs.readFileSync(file, 'utf8').should.equal(doc);
      rimraf.sync(dir2);
      cb();
    });
  });
});
