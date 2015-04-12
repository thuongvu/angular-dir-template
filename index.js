#!/usr/bin/env node

var fs = require('fs');
var ASQ = require('asynquence');
require('asynquence-contrib');
var _ = require('underscore');
var program = require("commander");
var config;

function list(val) {
  return val.split(',');
}

program
  .option('--scopeProps <items>', 'A list', list)
  .option('--name [name]', 'Specify the name of the directive')
  .option('--restrict [restrictions]', 'Restrict to element, attribute, class')
  .parse(process.argv);

if (program.scopeProps) console.log(' scopeProps: %j', program.scopeProps);
if (program.name) console.log('name: ', program.name);
if (program.restrict) console.log('restrict to: ', program.restrict);

var readConfig = function() {
  var sq = ASQ();
  fs.readFile('./config/angular-dir-template-config.json', sq.errfcb());
  return sq;
};

readConfig().then(function(a, b) {
  config = JSON.parse(b.toString());
  console.log("config", config);
});


// 1. take input
// 2. read json
// 3. fill templates
// 4. put in respective parts in filesystem


   // read json
   // json will have config
     // app name
     // base directory for templateUrl
    
  // options
    // scope
      // default true, if flag is passed, false

// node index.js --scopeProps=hello,world --restrict=ea --name=dirname