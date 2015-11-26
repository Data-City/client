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
      template: `
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">Datenquelle wählen</h3>
          </div>
          <div class="panel-body">
            <form name="dataSourceForm">
            <label>
              <input type="radio" ng-model="dataSource" value="existingCollection">
                Bestehenden Datensatz verwenden
            </label><br/>
            <label>
                <input type="radio" ng-model="dataSource" value="uploadCSVFile">
                CSV-Datei hochladen
            </label><br/>
          <chooseexistingmongodbcollection ng-show="dataSource == 'existingCollection'"></chooseexistingmongodbcollection>
	        <uploadformdatasourcefile ng-show="dataSource == 'uploadCSVFile'"></uploadformdatasourcefile>
          </div>
         </div>
          
      `,
      restrict: 'E',
      
      link: function postLink(scope, element, attrs) {
        //element.html(scope.form);
        //element.text(scope.form);
      }
    };
  });
