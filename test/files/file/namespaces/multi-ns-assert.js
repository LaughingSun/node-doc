var should = require('should');

/**
 * Assert the multi-ns file
 *
 * @param err      {Undefined} Possible error.
 * @param doc      {Object}    The documentation object.
 * @param exported {Boolean}   Whether or not the extra namespaces gets exported.
 * @param cb       {Function}  The callback function from Mocha.
 */
module.exports = function (err, doc, exported, cb) {
  should.equal(err, undefined);

  doc.should.be.an.Object;

  if (exported) {
    doc.name.should.equal('multi-ns-export');
    doc.exports.should.equal('exportFunction');

    // no functions?!


  } else {
    doc.name.should.equal('multi-ns-no-export');
  }

  doc.ns.should.be.an.Object;
  var ns1 = doc.ns['ns-1'];
  ns1.should.be.an.Object;
  ns1.name.should.equal('ns-1');

  console.log(ns1.functions);

  var ns2 = doc.ns['ns-2'];
  ns2.should.be.an.Object;
  ns2.name.should.equal('ns-2');

  console.log(ns2.functions);

  return cb(new Error('Function names not correct'));


  console.log();
  console.log(doc);

  //console.log('functions', doc.functions);
  //console.log('ns', doc.ns);


/*
  doc.name.should.equal('files');
  doc.exports.should.equal('reversedPath');
  doc.ns.should.be.an.Object.and.have.properties('getPath', 'reversePath');

  var getPath = doc.ns.getPath;
  getPath.name.should.equal('getPath');
  getPath.exports.should.equal('getPath');

  [doc.functions.getPath, getPath.functions.getPath].forEach(function (getPath, i) {
    getPath.should.be.an.Object.and.have.properties('access', 'exports', 'type', 'name');
    getPath.access.should.equal('public');
    getPath.exports.should.equal(true);
    getPath.type.should.equal('Function');
    getPath.name.should.equal('getPath');
    getPath.return.should.be.an.Object.and.have.property('type', 'String');

    // First time it's required and it should say so
    if (i === 0) getPath.required.should.equal(true);
  });

  var reversePath = doc.ns.reversePath;
  reversePath.name.should.equal('reversePath');
  reversePath.exports.should.equal('reversePath');
*/
  cb();
};
