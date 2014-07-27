var fs = require('fs');

fs.readFile('./nothing.js', 'utf8', function (err, file) {
  if (err) throw err;

  // Check for comments
  if (file.indexOf('/**') !== -1) {
    console.log('There is a comment somewhere!');
  }
});
