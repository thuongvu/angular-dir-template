#!/usr/bin/env node

var fs = require('fs');
// var ASQ = require('asynquence');
var q = require('q');
require('asynquence-contrib');
var _ = require('underscore');
var program = require("commander");

function list(val) {
  return val.split(',');
}

program
  .option('--scopeProps <items>', 'A list', list)
  .option('--name [name]', 'Specify the name of the directive')
  .option('--restrict [restrictions]', 'Restrict to element, attribute, class')
  .parse(process.argv);

// if (program.scopeProps) console.log(' scopeProps: %j', program.scopeProps);
// if (program.name) console.log('name: ', program.name);
// if (program.restrict) console.log('restrict to: ', program.restrict);

var readConfig = function() {
  var defer = q.defer();
  fs.readFile('./config/angular-dir-template-config.json', function(err, config) {
    if (err) {
      defer.reject();
    } else {
      defer.resolve(config);
    }
  });
  return defer.promise;
};


var config = function() {
  return readConfig().then(function(a, b) {
    var config = JSON.parse(a.toString());
    return config;
  });
};

var configAndOptions = function() {
  var both = q.all([config(), template()])
    .done(function(a) {
      console.log("a", a);
    });
    console.log("both", both);
};

// _.extend({name: 'moe'}, {age: 50});
// => {name: 'moe', age: 50}

var readTemplate = function() {
  var defer = q.defer();
  fs.readFile('./templates/directiveTemplate.js', function(err, template) {
    if (err) {
      defer.reject();
    } else {
      defer.resolve(template);
    }
  });
  return defer.promise;
}
var template = function() {
  return readTemplate().then(function(templ, err) {
    return templ.toString();
  });
};

console.log("configAndOptions()", configAndOptions());





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