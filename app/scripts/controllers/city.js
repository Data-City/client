'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:CityCtrl
 * @description
 * # CityCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
  .controller('CityCtrl', function ($http, $scope, $log) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.json = null;

    $scope.loadCollections = function () {
      getCollections("prelife", "a", "a", $http, function (response) {
        $scope.json = response;
        $log.info(response);
      });
    };


  });
