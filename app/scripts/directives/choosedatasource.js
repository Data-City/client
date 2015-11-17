'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:choosedatasource
 * @description
 * # choosedatasource
 */
angular.module('datacityApp')
  .directive('choosedatasource', function () {
    return {
      template: '<div>Hier wird die Datenquelle (CSV-Datei oder etwas bereits importiertes gewählt)</div>',
      restrict: 'E',
      /*
      link: function postLink(scope, element, attrs) {
        element.text('this is the choosedatasource directive');
      }*/
    };
  });
