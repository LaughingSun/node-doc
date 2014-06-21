/**
 * Assert this file's document object.
 * @public
 *
 * @param doc         {Object}  Document object.
 * @param showPrivate {Boolean} Wether or not to test private properties.
 */
function _assert (err, doc, showPrivate, cb) {
  if (err) return cb(err);

  doc.name.should.equal('assert');
  doc.exports.should.equal('_assert');

  if (showPrivate) {
    doc.functions.should.be.an.Object.and.have.property('_assert');

    var assert = doc.functions._assert;
    assert.should.be.an.Object;
    assert.access.should.equal('public');
    assert.desc.should.equal('Assert this file\'s document object.');
    assert.exports.should.equal(true);
    assert.type.should.equal('Function');
    assert.name.should.equal('_assert');

    var params = assert.params;
    params[0].should.be.an.Object;
    params[0].name.should.equal('doc');
    params[0].type.should.equal('Object');
    params[0].desc.should.equal('Document object.');

    params[1].should.be.an.Object;
    params[1].name.should.equal('showPrivate');
    params[1].type.should.equal('Boolean');
    params[1].desc.should.equal('Wether or not to test private properties.');
  }

  cb();
}

module.exports = _assert;
