'use strict';

/**
 * @ngdoc directive
 * @name datacityApp.directive:chooseexistingview
 * @description
 * # chooseexistingview
 */
angular.module('datacityApp')
  .directive('chooseexistingview', function () {
    return {
      template: `
        <div class ="container">
          <h3>Eine Ansicht auswählen:</h3>
          <div class="btn-group"> <!--  ng-repeat="view in views" -->
              <button type="button" class="btn btn-default btn-sm">Ansicht 1</button>
              <button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>
          </div>
          <div class="btn-group">
              <button type="button" class="btn btn-default btn-sm">Ansicht 2</button>
              <button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>
          </div>
            <div class="btn-group">
              <button type="button" class="btn btn-default btn-sm">...</button>
              <button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>
          </div>
            <!--
            [Nach Auswahl eines Datensatzes werden die Parameter aktualisiert; Sicherheitsabfrage beim Löschen]
            -->
        </div>
      `,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the chooseexistingview directive');
      }
    };
  });
