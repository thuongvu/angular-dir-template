'use strict';

angular.module('module')
  .directive('name', function() {
    return {
      templateUrl: '',
      controller: function($scope) {},
      scope: {},
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {

      } // link
    }; // return
  }); // directive


// values, using <%= … %>
// JavaScript code, with <% … %>
// interpolate a value, and have it be HTML-escaped, use <%- … %>