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
    .controller('PreviewCtrl', function($scope, $routeParams, sharedLogin, $log, REST) {

        // Verbindungsdaten
        var db = "prelife";
        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());

        $log.info($routeParams.collID);
        $scope.collID = null;
        $scope.results = null;
        $scope.attributes = null;


        /**
         * Initialisierung
         */
        if ($routeParams.collID) {
            $scope.collID = $routeParams.collID;
        }
        REST.getDocuments(db, $scope.collID, function(collection) {
            //          $log.info(collection);
            $scope.results = collection.data._embedded['rh:doc'];
            $scope.attributes = getProperties($scope.results[0]);
            //        $log.info($scope.attributes);
        });


    });
