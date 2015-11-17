'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:uploadformdatasourcefile
 * @description
 * # uploadformdatasourcefile
 */
angular.module('datacityApp')
  .directive('uploadformdatasourcefile', function () {
    return {
      template: '<div><p>Mit diesem Element wird das Upload-Formular gezeichnet. Es soll mit ng-show (oder ng-hide) nur angezeigt werden, wenn der entsprechende Punkt bei der Auswahl gewählt wurde.</P></div>',
      restrict: 'E',
      /*
      link: function postLink(scope, element, attrs) {
        element.text('');
      }*/
    };
  });
