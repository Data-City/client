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
      template: `
      <div class ="container">
        <h3>Einen Datensatz auswählen:</h3>
          <div class="btn-group"> <!--  ng-repeat="sets in datasets" -->
            <button type="button" class="btn btn-default btn-sm">Datensatz 1</button>
            <button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>
          </div>
          <div class="btn-group">
              <button type="button" class="btn btn-default btn-sm">Datensatz 2</button>
              <button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-default btn-sm">...</button>
            <button class="btn btn-danger btn-sm" ng-click="removeTodo($index)" aria-label="Remove">X</button>
          </div>
    [Nach Auswahl eines Datensatzes werden die Parameter und Ansichten aktualisiert; Sicherheitsabfrage beim Löschen]
    </div>
      `,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.text('this is the chooseexistingmongodbcollection directive');
      }
    };
  });
