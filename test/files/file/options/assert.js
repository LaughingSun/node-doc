/**
 * Assert this file's document object.
 * @public
 *
 * @param doc         {Object}  Document object.
 * @param showPrivate {Boolean} Wether or not to test private properties.
 */
function assert (err, doc, showPrivate, cb) {
  if (err) return cb(err);

  doc.name.should.equal('assert');

  var assert = doc.exports;
  assert.should.be.an.Object;
  assert.name.should.equal('assert');
  assert.type.should.equal('Function');
  assert.desc.should.equal('Assert this file\'s document object.');
  assert.access.should.equal('public');

  _assertParams(assert.params);

  // Also the private internal function
  if (showPrivate) {
    doc.functions.should.be.an.Object.and.have.property('_assertParams');
    var assertParams = doc.functions._assertParams;
    assertParams.should.be.an.Object;
    assertParams.name.should.equal('_assertParams');
    assertParams.type.should.equal('Function');
    assertParams.desc.should.equal('Check params');
    assertParams.exports.should.equal(false);
    assertParams.access.should.equal('private');
    assertParams.params.should.be.an.Array.and.have.lengthOf(1);
    assertParams.params[0].should.be.an.Object;
    assertParams.params[0].name.should.equal('params');
    assertParams.params[0].type.should.equal('Array');
    assertParams.params[0].desc.should.equal('The array of params.');
  }

  cb();
}

module.exports = assert;

/**
 * Check params
 *
 * @param params {Array} The array of params.
 */
function _assertParams (params) {
  params[0].should.be.an.Object;
  params[0].name.should.equal('doc');
  params[0].type.should.equal('Object');
  params[0].desc.should.equal('Document object.');

  params[1].should.be.an.Object;
  params[1].name.should.equal('showPrivate');
  params[1].type.should.equal('Boolean');
  params[1].desc.should.equal('Wether or not to test private properties.');
}
