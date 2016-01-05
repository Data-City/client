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
  .controller('PreviewCtrl', function ($scope, $http, $rootScope, $log, $filter, sharedLogin, REST) {
  /**  REST.setUsername(sharedLogin.getUsername());
    REST.setPassword(sharedLogin.getPassword());

    var db = "prelife";
    var collection = "beispiel";

    REST.getDocuments(db, collection, function(result) {
      $log.info(result);
    });

    var url = '/prelife/'+getCollection+'';

   /** $scope.results = null;
    $scope.attributes = null;

    var func = function (response) {
      $scope.results = response.data._embedded['rh:doc'];
      $scope.attributes = getProperties($scope.results[0]);
      $log.info(response.data._embedded);
    };
    var config = {
      keys: {
        'Zeilen': 1,
      },
    };
    
    getURL(url, config, username, password, $http, func);*/
  });
