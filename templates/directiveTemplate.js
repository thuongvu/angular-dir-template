'use strict';

angular.module('<%= moduleName %>')
  .directive('<%= directiveName %>', function() {
    return {
      templateUrl: '<%= templateUrl %>',
      controller: function($scope) {},
      scope: <%= directiveIsoScope %>,
      restrict: '<%= restrict %>',
      link: function postLink(scope, element, attrs) {

      } // link
    }; // return
  }); // directive
