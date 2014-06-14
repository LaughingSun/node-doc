describe('Clone util', function () {
  var clone = require('../../lib/util/clone');

  it('should return the a cloned object', function () {
    var obj = {a: 'a', b: 'b'}
      , copy = clone(obj);

    obj.should.not.equal(copy);

    copy.should.be.an.Object.and.have.properties('a', 'b');
    copy.a.should.equal('a');
    copy.b.should.equal('b');
  });

  it('should clone objects in the object', function () {
    var obj = {a: {b: 'b'}, c: {d: {f: 'f'}}}
      , copy = clone(obj);

    obj.should.not.equal(copy);

    copy.should.be.an.Object.and.have.properties('a', 'c');
    copy.a.should.be.an.Object.and.have.property('b', 'b');
    copy.c.should.be.an.Object.and.have.property('d');
    copy.c.d.should.be.an.Object.and.have.property('f', 'f');
  });
});
