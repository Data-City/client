'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:ViewsCtrl
 * @description
 * # ViewsCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('ViewsCtrl', function ($scope, $route, $routeParams, $log, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.collID = null;
    $scope.views = null;
    $scope.numberOfViews = null;
    
    var username = "a";
    var password = "a";
    var database = "einstellungen";
    var collection = "ansichten"
    
    if($routeParams.collID) {
      $scope.collID = $routeParams.collID;
      getViews(database, collection, username, password, $http, function(response) {
        $scope.views = response;
        $log.info(response);
      });
    }
  });
