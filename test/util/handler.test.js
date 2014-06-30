describe('Handler util', function () {
  var handleFileError = require('../../lib/util/handler');

  it('should return a merged object', function () {
    var err = handleFileError({
      code: 'ENOENT'
    }, '/notFound.js');

    err.should.be.an.Object;
    err.code.should.equal('ENOENT');
    err.message.should.equal('File "/notFound.js" not found');
  });
});
