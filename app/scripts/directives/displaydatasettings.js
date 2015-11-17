'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:displaydatasettings
 * @description
 * # displaydatasettings
 */
angular.module('datacityApp')
  .directive('displaydatasettings', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the displaydatasettings directive');
      }
    };
  });
