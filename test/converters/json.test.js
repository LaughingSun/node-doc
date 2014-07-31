require('should');

describe('JSON converter', function () {
  var prepareJson = require('../../lib/converters/json');

  it('should add the main doc to main.json on the returning object', function () {
    var doc = {
          name: 'my-app'
        }
      , files = prepareJson(doc);

    files.should.be.an.Object.and.have.property('main.json');
    files['main.json'].should.equal(JSON.stringify(doc, null, 2));
  });

  it('should add namespaces in it\'s own files', function () {
    var doc = {
          name: 'my-app',
          ns: {
            ns1: {
              name: 'Namespace 1'
            },
            ns2: {
              name: 'Namespace 2'
            }
          }
        }
      , files = prepareJson(doc);

    files.should.be.an.Object.and.have.properties('main.json', 'ns1.json', 'ns2.json');
    files['ns1.json'].should.equal(JSON.stringify(doc.ns.ns1, null, 2));
    files['ns2.json'].should.equal(JSON.stringify(doc.ns.ns2, null, 2));
    delete doc.ns;
    files['main.json'].should.equal(JSON.stringify(doc, null, 2));
  });

  it('should add todos in it\'s own file', function () {
    var doc = {
          name: 'my-app',
          todos: {
            global: ['Stuff', 'I', 'Need', 'To', 'Do']
          }
        }
      , files = prepareJson(doc);

    files.should.be.an.Object.and.have.property('main.json');
    files['main.json'].should.equal(JSON.stringify(doc, null, 2));
    files['todo.json'].should.equal(JSON.stringify(doc.todos, null, 2));
  });
});
