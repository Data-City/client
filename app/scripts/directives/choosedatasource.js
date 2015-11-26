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
      /*
      template: '<div><form name="dataSourceForm"><label><input type="radio" ng-model="dataSource" value="existingCollection">
                      Bestehenden Datensatz verwenden</label><br/>
                    <label>
                      <input type="radio" ng-model="dataSource" ng-value="newCSVFile">
                      CSV-Datei hochladen
                    </label><br/>
                 </div><h3>{{dataSource}}</h3>',
      */
      template: `
        <div>
          <form name="dataSourceForm">
            <label><input type="radio" ng-model="dataSource" value="existingCollection">
                      Bestehenden Datensatz verwenden</label><br/>
                    <label>
                      <input type="radio" ng-model="dataSource" value="newCSVFile">
                      CSV-Datei hochladen
                    </label><br/>
      `,
      restrict: 'E',
      
      link: function postLink(scope, element, attrs) {
        //element.html(scope.form);
        //element.text(scope.form);
      }
    };
  });
