'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:chooseexistingmongodbcollection
 * @description
 * # chooseexistingmongodbcollection
 */
angular.module('datacityApp')
  .directive('chooseexistingmongodbcollection', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the chooseexistingmongodbcollection directive');
      }
    };
  });
