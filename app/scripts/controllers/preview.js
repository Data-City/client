'use strict';
/*jshint -W117 */
/**
 * @ngdoc function
 * @name datacityApp.controller:PreviewCtrl
 * @description
 * # PreviewCtrl
 * Controller of the datacityApp
 */
angular.module('datacityApp')
    .controller('PreviewCtrl', function($scope, $routeParams, sharedLogin, $log, REST, SETTINGS) {

        // Verbindungsdaten
        var db = SETTINGS.databaseForCollections;
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());


        $scope.collID = null;
        $scope.results = null;
        $scope.attributes = null;


        /**
         * Initialisierung
         */
        if ($routeParams.collID) {
            $scope.collID = $routeParams.collID;
        }

        /**
         * Holt die Collection und die Attribute
         */
        REST.getDocuments(db, $scope.collID, function(collection) {
            $scope.results = collection.data._embedded['rh:doc'];
            $scope.attributes = getProperties($scope.results[0]);
            $scope.numberOfEntries = collection.data._returned;
        });


    });
