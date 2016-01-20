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
      
    var database = "prelife";
    
    
    $scope.test = function() {
        console.log("window.location: ");
        console.log(window.location);
    }
    
     var storedJSON = JSON.parse(window.locations.href.split("?webGLSettings=")[1]);

    // DIE COLLECTION WIRD GEHOLT (DU MUSST DIE COLLID SETZEN)
    REST.getDocuments(database, storedJSON.collID, function (collection) { //Hier musst du die CollectionID richtig setzen
        $scope.chosenCollection = collection;
        $scope.collections = null;
        
        //DIE ANSICHT WIRD GEHOLT
        REST.getData(function (response) {
            if (response.data) {
                $scope.chosenView = response.data;
            }
            
            // CODE HIER DRIN 
            
        }, database, collection, storedJSON._id); //HIER musst du die view richtig setzen
        
    });
    
    
  });
