describe('Merge util', function () {
  var merge = require('../../lib/util/merge');

  it('should return a merged object', function () {
    var obj = {a: 'a', b: 'b'}
      , obj2 = {c: 'c', d: 'd'}
      , merged = merge(obj, obj2);

    merged.should.be.an.Object.and.have.properties('a', 'b', 'c', 'd');
    merged.a.should.equal('a');
    merged.b.should.equal('b');
    merged.c.should.equal('c');
    merged.d.should.equal('d');
  });

  it('second parameter should overwrite the first', function () {
    var obj = {a: 'a', b: 'b'}
      , obj2 = {c: 'c', b: 'not b'}
      , merged = merge(obj, obj2);

    merged.should.be.an.Object.and.have.properties('a', 'b', 'c');
    merged.a.should.equal('a');
    merged.b.should.equal('not b');
    merged.c.should.equal('c');
  });

  it('should not overwrite undefined', function () {
    var obj = {a: 'a', b: 'b'}
      , obj2 = {c: 'c', b: undefined}
      , merged = merge(obj, obj2);

    merged.should.be.an.Object.and.have.properties('a', 'b', 'c');
    merged.a.should.equal('a');
    merged.b.should.equal('b');
    merged.c.should.equal('c');
  });
});
