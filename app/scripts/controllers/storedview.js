/* global drawCity */
'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:StoredviewCtrl
 * @description
 * # StoredviewCtrl
 * Controller of the datacityApp
 */

angular.module('datacityApp')
    .controller('StoredviewCtrl', function($scope, $route, $routeParams, $log, $http, $rootScope, sharedLogin, AGGR, REST, SETTINGS) {

        REST.setUsername(sharedLogin.getUsername());
        REST.setPassword(sharedLogin.getPassword());

        var databaseForCollections = SETTINGS.databaseForCollections;
        var databaseForViews = SETTINGS.databaseForViews;
        var ansichten = SETTINGS.collection;

        var WEBGL_DIV = SETTINGS.WEBGL_DIV;

        var url = window.location.href;

        url = url.replace(/%7B/g, '{');
        url = url.replace(/%7D/g, '}');
        url = url.replace(/%22/g, '"');
        url = url.replace(/%5B/g, '[');
        url = url.replace(/%5D/g, ']');
        url = url.replace(/%C3%B6/g, 'ö');

        var storedJSON = JSON.parse(url.split("?webGLSettings=")[1]);

        $scope.setLoaderSettings = function(msg, percentage) {
            $scope.$evalAsync(function() {
                //$log.info(msg + percentage);
                $scope.percentage = percentage;
                $scope.msg = msg;
                /*
                setTimeout(function() {
                    resolve();
                }, 150);
                */
            });
        };

        $scope.collID = storedJSON.collID;
        /**
         * Liest die Parameter aus dem JSON aus (Winkel der Kamera etc), holt alle benötigten Datenbanken (Collection, Verbindungen, die Ansicht)
         * und übergibt sie an das WebGL, damit die Stadt gezeichnet werden kann
         */
        REST.getDocuments(databaseForCollections, storedJSON.collID + "_dc_data_" + storedJSON._id, function(collection) {
            REST.getDocuments(databaseForCollections, storedJSON.collID + "_dc_connections_incoming", function(incoming) {
                REST.getDocuments(databaseForCollections, storedJSON.collID + "_dc_connections_outgoing", function(outgoing) {
                    var incomingConnections = incoming.data._embedded['rh:doc'][0];
                    var outgoingConnections = outgoing.data._embedded['rh:doc'][0];

                    $scope.chosenCollection = collection;

                    REST.getData(function(viewResponse) {
                        if (viewResponse.data) {
                            $scope.chosenView = viewResponse.data;
                            
                            var settings = storedJSON;
                            $scope.setLoaderSettings("Beginne Aufbau der Stadt...", 65);
                            drawCity(collection.data._embedded['rh:doc'], $scope.chosenView, WEBGL_DIV, settings, incomingConnections, outgoingConnections, $scope.setLoaderSettings);
                        }
                    }, databaseForViews, ansichten, storedJSON._id);
                });
            });
        });


    });
