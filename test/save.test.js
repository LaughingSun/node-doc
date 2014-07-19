var fs = require('fs')
  , path = require('path');

describe('Save', function () {
  var save = require('../lib/save')
    , dir = path.resolve(__dirname, 'files');

  it('should save the documentation object', function (cb) {
    var file = path.resolve(dir, 'main.json')
      , doc = JSON.stringify({
          name: 'my-app'
        });

    save(dir, {
      'main.json': doc
    }, function () {
      fs.readFileSync(file, 'utf8').should.equal(doc);
      fs.unlinkSync(file)
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
      fs.unlinkSync(file)

      fs.readFileSync(file2, 'utf8').should.equal(doc2);
      fs.unlinkSync(file2)
      cb();
    });
  });
});
