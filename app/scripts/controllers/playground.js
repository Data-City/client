'use strict';

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
    $scope.attributes = [];
    
    var func = function(response) {
      $log.info(response);
      //$log.info(response.data._embedded['rh:doc']);
      $scope.results = response.data._embedded['rh:doc'];
      
      var allAttributes = Object.keys($scope.results[0]);
      
      for(var attr of allAttributes) {
        if(attr.charAt(0) !== '_') {
          $scope.attributes.push(attr);
        }
      }
      
    };
    
    var config = {
      filter : {
        'Package': {
          '$regex':'(?i)^de.ruv.baustein*'
          }
      }
    };
    
    getURL(url, config, username, password, $http, func);
  });
