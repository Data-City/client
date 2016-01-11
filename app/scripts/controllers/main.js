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


App.controller('MainCtrl', function ($scope, $http, $rootScope, $log, $filter, sharedLogin, REST) {
    
    /**
     * Die richtige Seite wird in der Navbar hervorgehoben
     */
    $(".nav a").on("click", function () {
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });
	
    
    // Verbindungsdaten
    var database = "prelife";
    $log.info('Username: ' + sharedLogin.getUsername() + '\tPassword: ' + sharedLogin.getPassword());
    REST.setUsername(sharedLogin.getUsername());
    REST.setPassword(sharedLogin.getPassword());
	
    $scope.collections = null;
    $scope.numberOfCollections = 0;
    // Der ausgewählte (angeklickte) Datensatz
    $scope.chosenCollection = null;
    
    /**
     * Auswählen eines Datensatzes und Weiterlung im Browser zu der Seite
     * 
     * @param colid ID der gewählten Collection
     */
    $scope.setChosenCollectionAndRedirect = function (collId) {
        REST.getDocuments(database, collId, function (collection) {
            $scope.chosenCollection = collection;
            $scope.collections = null;           
            window.location = "#/views/" + $scope.chosenCollection.data._id;
        });
    };
    
    /**
     * Auswählen eines Datensatzes 
     * 
     * @param colid ID der gewählten Collection
     */
    $scope.setChosenCollectionOnly = function (collId) {
       REST.getDocuments(database, collId, function (collection) {
            $log.info(collection);
            $scope.chosenCollection = collection;
        });
    };
    
     $scope.getMyLink = function(collId){
        var link = "#/data/preview/" + collId;
        location.href = link;
        return link;
    };
    
    $scope.getIdOfCollection = function (collection) {
        return collection ? collection.data._id : null;
    };

    /**
     * Löscht die ausgewählte Collection
     */
    $scope.deleteCollection = function () {
        
        // Die eigentliche Collection löschen
        REST.deleteCollection(database, $scope.chosenCollection.data._id, function (response) {
            $scope.getCollections();
        });
        
        // Alle Collections löschen, die mit "collectionId_dc_"" beginnen
        for (var iterate in $scope.allCollections) {
            var myRegExp = new RegExp($scope.chosenCollection.data._id + "_dc_", 'i');
            var match = $scope.allCollections[iterate]._id.match(myRegExp);
            
            if (match) {
                REST.deleteCollection(database, $scope.allCollections[iterate]._id, null);
           }
        } 
    };
    
    /**
     * Holt alle Collections
     */
    $scope.getCollections = function () {
        REST.getCollections(database, function (response) {
            var allCollections = response.data._embedded['rh:coll'];
            $scope.allCollections = allCollections;
            $scope.collections = $filter('colsbydisplayability')(allCollections);
            $scope.numberOfCollections = count($scope.collections);
            
            //Garantieren, dass die Metadaten für alle Collections zur Verfügung stehen
            for (var coll in $scope.collections) {
                REST.ensureCollectionsMetaData(database, $scope.collections[coll]._id, null);
            }
            
        });
    };

    /**
     * @return Eine schönere Anzeige des Datums
     */
    $scope.formatTimeString = function (timeString) {
        var d = new Date(timeString);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    };
    
    
    // Init
    $scope.getCollections();
});