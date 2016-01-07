'use strict';
/*jshint -W117 */
/**
 * @ngdoc function
 * @name datacityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the datacityApp
 */

var App = angular.module('datacityApp');

/**
 * Die richtige Seite wird in der Navbar hervorgehoben
 */
App.controller('MainCtrl', function ($scope, $http, $rootScope, $log, $filter, sharedLogin, REST) {
    
    /**
     * aktiviert die Navigationsleiste
     */
    $(".nav a").on("click", function () {
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });
	
    // Verbindungsdaten
    var database = "prelife";
    REST.setUsername(sharedLogin.getUsername());
    REST.setPassword(sharedLogin.getPassword());
	
    // Der ausgewählte (angeklickte) Datensatz
    $scope.allCollections = null;
    $scope.displayableCollections = null;
    $scope.numberOfDisplayableCollections = 0;
    $scope.chosenCollection = null;


    /**
     * Auswählen eines Datensatzes
     * Wenn der Datensatz bereits ausgewählt ist, wird er nicht mehr ausgewählt (deselected...)
     * 
     * @param colid ID der gewählten Collection
     */
    $scope.setChosenCollectionAndRedirect = function (collId) {
        REST.getDocuments(database, collId, function (collection) {
            // Toggle: Select<->Deselect
            $log.info(collection);
            $scope.chosenCollection = ($scope.chosenCollection === collection) ? null : collection;
            if ($scope.chosenCollection) {
                window.location = "#/views/" + $scope.chosenCollection.data._id;
            }
        });
    };
    
    $scope.setChosenCollectionOnly = function (collId) {
       REST.getDocuments(database, collId, function (collection) {
            $log.info(collection);
            $scope.chosenCollection = collection;
        });
    };


    $scope.getIdOfCollection = function (collection) {
        return collection ? collection.data._id : null;
    };

    /**
     * Löscht die ausgewählte Collection
     */
    $scope.deleteCollection = function () {
        
        //Die Collection selbst löschen
        REST.deleteCollection(database, $scope.chosenCollection.data._id, function (response) {});
        
        // Alle Collections löschen, die mit collectionId_dc_ beginnen
        for (var iterate in $scope.allCollections) {
            var myRegExp = new RegExp($scope.chosenCollection.data._id + "_dc_", 'i');
            var match = $scope.allCollections[iterate]._id.match(myRegExp);
            
            if (match) {
                REST.deleteCollection(database, $scope.allCollections[iterate]._id, function (response) {});
            }
        } 
        
         //Hier sollte noch etwas hin, das die Tabelle refresht
    };
    
    /**
     * Holt alle Collections
     */
    REST.getCollections(database, function (response) {
        var allCollections = response.data._embedded['rh:coll'];
        $scope.allCollections = allCollections;
        $scope.displayableCollections = $filter('colsbydisplayability')(allCollections);
        $scope.numberOfDisplayableCollections = count($scope.displayableCollections);   
    });

    /**
     * @return Eine schönere Anzeige des Datums
     */
    $scope.formatTimeString = function (timeString) {
        var d = new Date(timeString);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    };
});