#! /usr/bin/env node
const args = process.argv.slice(2);
const runner = require('./runner');

const printError = () => {
  console.log('invalid arguments, please use the below format');
  console.log('express-api-generator features meta_file.json');
};

if (args.length === 2) {
  if (args[0] === 'features') {
    runner.runFromFile(args[1]);
  } else {
    console.log(`unrecognized argument: ${args[0]}`);
    printError();
  }
} else {
  printError();
}
