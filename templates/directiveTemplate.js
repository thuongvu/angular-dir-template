'use strict';

angular.module("<%= moduleName %>")
  .directive("<%= directiveName %>", function() {
    return {
      templateUrl: "<%= templateUrl %>",
      controller: function($scope) {},
      scope: <%= scopeProps %>,
      restrict: "<%= restrict %>",
      link: function postLink(scope, element, attrs) {

      } // link
    }; // return
  }); // directive
