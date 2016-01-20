'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:StoredviewCtrl
 * @description
 * # StoredviewCtrl
 * Controller of the datacityApp
 */

angular.module('datacityApp')
  .controller('StoredviewCtrl', function ($scope, $route, $routeParams, $log, $http, $rootScope, sharedLogin, AGGR, REST) {
    
    REST.setUsername(sharedLogin.getUsername());
    REST.setPassword(sharedLogin.getPassword());

    var databaseForCollections = "prelife";
    var databaseForViews = "einstellungen";
    var ansichten = "ansichten";
    var baseurl = "https://pegenau.com:16392";

    var WEBGL_DIV = 'Stadt';
    
    $scope.test = function() {
        console.log("window.location: ");
        console.log(window.location);
    };
    
     var url = window.location.href;
     
     url = url.replace(/%7B/g, '{');
     url = url.replace(/%7D/g, '}');
     url = url.replace(/%22/g, '"');
     url = url.replace(/%5B/g, '[');
     url = url.replace(/%5D/g, ']');
     
     var storedJSON = JSON.parse(url.split("?webGLSettings=")[1]);
     
     console.log(storedJSON);

    // DIE COLLECTION WIRD GEHOLT (DU MUSST DIE COLLID SETZEN)
    REST.getDocuments(databaseForCollections, storedJSON.collID, function (collection) {
        $scope.chosenCollection = collection;
        $scope.collections = null;
        
        //DIE ANSICHT WIRD GEHOLT
        REST.getData(function (response) {
            if (response.data) {
                $scope.chosenView = response.data;
            }
            
            // CODE HIER DRIN 
            
            console.log("Ausgewählte Collection: ");
            console.log($scope.chosenCollection);
            
            console.log("Ausgewählte Ansicht:");
            console.log($scope.chosenView);
            
            var settings = storedJSON;
            
           // drawCity(collection.data._embedded['rh:doc'], $scope.chosenView, WEBGL_DIV, settings);
           drawCity(collection.data._embedded['rh:doc'], $scope.chosenView, WEBGL_DIV, settings);
            
        }, databaseForViews, ansichten, storedJSON._id);
        
    });
    
    
  });
