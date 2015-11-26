'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:hbar
 * @description
 * # hbar
 */
angular.module('datacityApp')
  .directive('hbar', function () {
    return {
      template: '<hr style="width: 100%; color: black; height: 1px; background-color:black;" />',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the hbar directive');
      }
    };
  });
