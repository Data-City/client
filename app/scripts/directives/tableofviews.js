'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:tableofviews
 * @description
 * # tableofviews
 */
angular.module('datacityApp')
  .directive('tableofviews', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the tableofviews directive');
      }
    };
  });
