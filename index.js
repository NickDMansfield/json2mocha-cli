#! /usr/bin/env node

const j2m = require("json2mocha");
const program = require("commander");



program
  .version('0.0.1')
  .option('-j, --jsonfile <jsonfile>', 'Define the location of the source JSON')
  .option('-n, --newfile <newfile>', 'Define the target location')
  .parse(process.argv);

if (!program.target) {
  showErr('No salvo file specified.  Please provide a relative file path with the -t parameter');
  process.exit();
}
