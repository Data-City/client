'use strict';
/*jshint -W117 */
/**
 * @ngdoc function
 * @name datacityApp.controller:CityCtrl
 * @description
 * # CityCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
//http, scope and log are never used
  .controller('CityCtrl', function ($http, $scope, $log, $rootScope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
        
    //$rootScope.collection = null;
    //$rootScope.view = null;
    //$rootScope.divID = null;
    
    $scope.callDrawCity = function() {
      $log.info("Called!");
      $log.info($rootScope.collection);
      $log.info($rootScope.view);
      $log.info($rootScope.divID);
      drawCity($rootScope.collection, $rootScope.view, $rootScope.divID);
    };
    
  });
