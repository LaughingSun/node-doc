var should = require('should');

/**
 * Assert this file.
 *
 * @param err {Error}    A possible error.
 * @param doc {Object}   The documentation object.
 * @param cb  {Function} The callback function.
 */
module.exports = function (err, doc, cb) {
  should.equal(err, undefined);

  doc.should.be.an.Object.have.have.property('main.json');
  doc = doc['main.json'];

  doc.should.be.an.Object;
  doc.name.should.equal('no-package');

  var exports = doc.exports;
  exports.should.be.an.Object;
  should.equal(exports.name, undefined);
  exports.desc.should.equal('Assert this file.');
  exports.type.should.equal('Function');
  exports.access.should.equal('public');
  exports.exports.should.equal(true);

  var params = exports.params;
  params[0].name.should.equal('err');
  params[0].desc.should.equal('A possible error.');
  params[0].type.should.equal('Error');
  params[1].name.should.equal('doc');
  params[1].desc.should.equal('The documentation object.');
  params[1].type.should.equal('Object');
  params[2].name.should.equal('cb');
  params[2].desc.should.equal('The callback function.');
  params[2].type.should.equal('Function');

  cb();
};
