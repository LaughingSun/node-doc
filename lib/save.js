'use strict';

function save (doc, cb) {
  console.log('saving!');
  console.log('doc', doc);


  cb(null, doc);
}

module.exports = save;
