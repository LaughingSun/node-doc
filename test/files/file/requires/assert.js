var should = require('should');

/**
 * Assert this file.
 *
 * @param err  {Error}    A possible error.
 * @param doc  {Object}   The documentation object.
 * @param name {String}   Name of the documenation object.
 * @param cb   {Function} The callback from Mocha.
 */
module.exports = function (err, doc, name, cb) {
  should.equal(err, undefined);
  doc.should.be.an.Object;
  doc.name.should.equal(name);

  var exports = doc.exports;
  exports.should.be.an.Object;
  exports.desc.should.equal('Assert this file.');
  exports.access.should.equal('public');
  exports.constant.should.equal(false);
  exports.exports.should.equal(true);

  var params = exports.params;
  params.should.be.an.Array.and.have.lengthOf(4);
  params[0].should.be.an.Object;
  params[0].name.should.equal('err');
  params[0].type.should.equal('Error');
  params[0].desc.should.equal('A possible error.');
  params[1].name.should.equal('doc');
  params[1].type.should.equal('Object');
  params[1].desc.should.equal('The documentation object.');
  params[2].name.should.equal('name');
  params[2].type.should.equal('String');
  params[2].desc.should.equal('Name of the documenation object.');
  params[3].name.should.equal('cb');
  params[3].type.should.equal('Function');
  params[3].desc.should.equal('The callback from Mocha.');

  cb();
}
