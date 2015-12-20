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
  .controller('PlaygroundCtrl', function ($http, $log, $scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var username = 'a';
    var password = 'a';

    var url = '/prelife/beispiel';

    $scope.results = null;
    $scope.attributes = null;

    var func = function (response) {
      $scope.results = response.data._embedded['rh:doc'];
      $scope.attributes = getProperties($scope.results[0]);
      $log.info(response.data._embedded);
    };

    var config = {
      /*
      filter: {
        'Package': {
          '$regex': '(?i)^de.ruv.baustein*'
        }
      }*/
    };
    
    getURL(url, config, username, password, $http, func);
  });
