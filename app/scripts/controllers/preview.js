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
        /**
         * Initialisierung
         */
        if ($routeParams.collID) {
            $scope.collID = $routeParams.collID;
            //   $scope.getViews();
            /**  REST.getDocuments(dbWithCollections, $scope.collID, function(resp) {
                $scope.collection = resp;
                $scope.metaData = resp.data.metaData;
                $scope.attributes = getAttributesWithType($scope.collection.data._embedded['rh:doc']);
            });
         */
        }
        var database = "prelife";
        REST.getDocuments(database, $scope.collId, function(response) {
            $log.info(response);
        });


    });
