#!/usr/bin/env node

var cli = require('commander')
  , pkg = require('../package.json')
  , parser = require('../lib/api')
  , path = require('path');

cli
  .version(pkg.version)
  .usage('[options]')
  .option('-o, --output <dir>', 'Directory to save the results to.')
  .option('-r, --result <value>', 'Result type, available are Markdown, HTML or json (default).')
  .option('-p, --private', 'Show private functions and comments.')
  .parse(process.argv);

var options = {
  output: path.resolve(process.cwd(), cli.output || 'doc'),
  result: cli.result || 'markdown',
  private: cli.private || false
};

parser(options, function (err, doc) {
  if (err) return console.error(err.message);

  console.log('See ' + options.output + ' for the documentation.');
});