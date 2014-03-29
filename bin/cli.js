#!/usr/bin/env node

var cli = require('commander')
  , pkg = require('../package.json')
  , parser = require('../lib/api')
  , path = require('path');

cli
  .version(pkg.version)
  .usage('<dir> [options]')
  .option('-o, --output <dir>', 'Location to output the results.')
  .option('-r, --result <value>', 'Wether to output in Markdown or object.')
  .option('-p, --private', 'Wether or not to show private comments.')
  .parse(process.argv);

if (cli.args.length === 0) {
  cli.help();
}

var input = cli.args[0]
  , output = cli.output || 'doc'
  , options = {
    result: cli.result || 'markdown',
    private: cli.private || false
  };

input = path.resolve(process.cwd(), input);
output = path.resolve(process.cwd(), output);

var posCwd = process.cwd().length + 1
  , convert = options.result.charAt(0).toUpperCase() + options.result.slice(1);

console.log('Converting comments to ' + convert + '.');
console.log('Input:  ' + input.slice(posCwd));
console.log('Output: ' + output.slice(posCwd));

try {
  parser(input, output, options);
} catch (err) {
  console.error('\x1B[31m' + err.message + '\x1B[39m');
  process.exit(1);
}

console.log('Done. See output dir for the results.');
