#!/usr/bin/env node

// node index.js --scopeProps=foo,bar --restrict=ea --name=myAwesomeDirective

var fs = require('fs');
var mkdirp = require('mkdirp');
var q = require('q');
var _ = require('underscore');
var program = require("commander");
var path = require('path');

function list(val) {
  return val.split(',');
}

program
  .option('--scopeProps <items>', 'A list', list)
  .option('--name [name]', 'Specify the name of the directive')
  .option('--restrict [restrictions]', 'Restrict to element, attribute, class')
  .option('--skipTest', 'Skip tests')
  .option('--dir [dir]', 'Directory specified to create html, css, js directive files')
  .option('--testDir [testDir]', 'Directory specified to create test spec file')
  .parse(process.argv);

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

var makeDirectory = function(dir) {
  var defer = q.defer();
  fs.mkdir(dir, function(err, dir) {
    if (err) {
      defer.reject();
    } else {
      defer.resolve(dir)
    }
  });
  return defer.promise;
}

var main = function() {
  var renderedDirectiveTemplate, renderedTestSpecTemplate;

  var both = q.all([config(), template('./templates/directiveTemplate.js'), template('./templates/testSpecTemplate.js')])
    .then(function(configAndTemplate) {
      var jsonConfig = configAndTemplate[0];
      var directiveTemplate = configAndTemplate[1].toString();
      var testSpecTemplate = configAndTemplate[2].toString();

      var directiveIsoScope = JSON.stringify(_.reduce(program.scopeProps, function(memo, prop) {
        memo[prop] = '=';
        return memo;
      }, {}));

      var specScopeProps = _.map(program.scopeProps, function(scopeProp) {
        return 'scope.' + scopeProp + ';'
      });

      var directory = function(optionsDir, defaultDir) {
        if (optionsDir) {
          return optionsDir + '/' + program.name;
        } else {
          return defaultDir;
        }
      }

      var options = {
        moduleName: jsonConfig.module,
        nameSpace: jsonConfig.nameSpace,
        templateUrl: jsonConfig.baseTemplateUrl + program.name + '/' + program.name + '.html',
        scopeProps: directiveIsoScope,
        directiveIsoScope: directiveIsoScope,
        specScopeProps: specScopeProps,
        scopePropsKeys: _.keys(JSON.parse(directiveIsoScope)),
        directiveName: program.name,
        restrict: program.restrict.toUpperCase(),
        directory: directory(program.dir, jsonConfig.baseTemplateUrl + program.name),
        testSpecDirectory: directory(program.testDir, jsonConfig.baseTestDirectory + program.name)
      }
      renderedDirectiveTemplate = hydrateTemplate(directiveTemplate, options);
      renderedTestSpecTemplate = hydrateTemplate(testSpecTemplate, options);
      return options;
    }).then(function(options) {
      makeDirectoryThenWrite(options.directory, options.directiveName, '.js', renderedDirectiveTemplate);
      makeDirectoryThenWrite(options.directory, options.directiveName, '.html', '<div></div>');
      makeDirectoryThenWrite(options.directory, options.directiveName, '.css', '');
      if (!program.skipTest) {
        makeDirectoryThenWrite(options.testSpecDirectory, options.directiveName, '.js', renderedTestSpecTemplate);
      }
    });
};


var makeDirectoryThenWrite = function(directory, directiveName, ext, renderedTemplate) {
  mkdirp(directory, function(err) {
    if (err) {
      return err;
    } else {
      var filePath = directory + '/' + directiveName + ext;
      fs.writeFile(filePath, renderedTemplate);
    }
  });
};

var hydrateTemplate = function(templateString, options) {
  var compiled = _.template(templateString);
  return compiled(options);
};

var readTemplate = function(pathFile) {
  var defer = q.defer();
  fs.readFile(pathFile, function(err, template) {
    if (err) {
      defer.reject();
    } else {
      defer.resolve(template);
    }
  });
  return defer.promise;
}
var template = function(pathFile) {
  return readTemplate(pathFile).then(function(templ, err) {
    return templ.toString();
  });
};

module.exports = main();
