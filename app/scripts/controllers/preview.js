'use strict';
/*jshint -W117 */
/**
 * @ngdoc function
 * @name datacityApp.controller:PlaygroundCtrl
 * @description
 * # PlaygroundCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('PreviewCtrl', function ($scope, $routeParams, $log, REST) {
    $log.info($routeParams);
    $scope.collId = $routeParams.collID;
   
     var database = "prelife";
    REST.getDocuments(database, $scope.collId, function (response) {
      $log.info(response);
  });


  });
