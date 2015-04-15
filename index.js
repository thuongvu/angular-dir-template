#!/usr/bin/env node

var fs = require('fs');
var q = require('q');
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
    .done(function(configAndTemplate) {
      var jsonConfig = configAndTemplate[0];
      var template = configAndTemplate[1].toString();

      var directiveIsoScope = JSON.stringify(_.reduce(program.scopeProps, function(memo, prop) {
        memo[prop] = '=';
        return memo;
      }, {}));

      var options = {
        moduleName: jsonConfig.module,
        nameSpace: jsonConfig.nameSpace,
        templateUrl: jsonConfig.baseTemplateUrl + program.name + '/' + program.name + '.html',
        scopeProps: directiveIsoScope,
        directiveName: program.name,
        restrict: program.restrict.toUpperCase()
      }
      hydrateTemplate(template, options);
    });
};



// values, using <%= … %>
// JavaScript code, with <% … %>
// interpolate a value, and have it be HTML-escaped, use <%- … %>

var hydrateTemplate = function(templateString, options) {
  var compiled = _.template(templateString);
  console.log("compiled(options)", compiled(options));
  return compiled(options);
};

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