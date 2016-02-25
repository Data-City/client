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


App.controller('MainCtrl', function($scope, $http, $rootScope, $log, $filter, sharedLogin, REST, SETTINGS) {

    /**
     * Die richtige Seite wird in der Navbar hervorgehoben
     */
    $(".nav a").on("click", function() {
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });


    // Verbindungsdaten
    var database = SETTINGS.databaseForCollections;
    REST.setUsername(sharedLogin.getUsername());
    REST.setPassword(sharedLogin.getPassword());

    $scope.collections = null;
    $scope.numberOfCollections = 0;
    // Der ausgewählte (angeklickte) Datensatz
    $scope.chosenCollection = null;
    $scope.loader = true;

    /**
     * Auswählen eines Datensatzes und Weiterlung im Browser zu der Seite
     * 
     * @param colid ID der gewählten Collection
     */
    $scope.setChosenCollectionAndRedirect = function(collId) {
        REST.getDocuments(database, collId, function(collection) {
            $scope.chosenCollection = collection;
            $scope.collections = null;
            REST.ensureCollectionsMetaData(database, collId, function(metaData) {
                //Weiterleiten
                window.location = "#/views/" + $scope.chosenCollection.data._id;
            });
        });
    };

    /**
     * Auswählen eines Datensatzes 
     * 
     * @param colid ID der gewählten Collection
     */
    $scope.setChosenCollectionOnly = function(collId) {
        REST.getDocuments(database, collId, function(collection) {
            $log.info(collection);
            $scope.chosenCollection = collection;
        });
    };

    /**
     * bekommt eine Collection ID und linkt zu der entsprechenden "preview"-Seite 
     * 
     * @param: collID: ID der Collection, zu der weiter geleitet werden soll
     * 
     * @return: Gibt den Link zurück
     */
    $scope.getPreviewLink = function(collId) {
        var link = "#/data/preview/" + collId;
        location.href = link;
        return link;
    };

    /**
     * Linkt zur Import-Seite 
     * 
     * 
     * 
     * @return: Gibt den Import Link zurück
     */
    $scope.getImportLink = function() {
        var link = "#/import";
        location.href = link;
        return link;
    };

    /**
     * Gibt entweder Datensatz oder Datensätze an
     * 
     * @param: Anzahl der vorliegenden Datensätze
     * 
     * @return: einen String
     */
    $scope.getDatasOrData = function(numberOfCollections) {
        var string = "";
        if (numberOfCollections === 1) {
            string = numberOfCollections + " Datensatz";
        } else if (numberOfCollections === 0) {
            string = "Es liegen keine Datensätze vor.";
        } else {
            string = numberOfCollections + " Datensätze";
        }
        return string;
    };

    /**
     * Gibt die id der Collection zurück
     * 
     * @param: Ein Objekt "Collection"
     * 
     * @return: die ID des übergebenen Objektes
     */
    $scope.getIdOfCollection = function(collection) {
        return collection ? collection.data._id : null;
    };

    /**
     * Löscht die ausgewählte Collection samt ihren Ansichten und der Collections, die im Hintergrund benötigt werden
     */
    $scope.deleteCollection = function() {

        // Die eigentliche Collection löschen
        REST.deleteCollection(database, $scope.chosenCollection.data._id, function(response) {
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
     * Holt alle Collections und speichert sie in "$scope.Collections"
     */
    $scope.getCollections = function() {
        $scope.loader = true;
        REST.getCollections(database, function(resp) {
            if (resp.data && resp.data._embedded) {
                $scope.allCollections = resp.data._embedded['rh:coll'];
                $scope.collections = $filter('colsbydisplayability')($scope.allCollections);
                $scope.numberOfCollections = count($scope.collections);
            } else {
                $scope.numberOfCollections = 0;
            }
            $scope.loader = false;
        });
    };

    /**
     * @return Eine schönere Anzeige des Datums
     */
    $scope.formatTimeString = function(timeString) {
        if (timeString) {
            var d = new Date(timeString);
            return d.toLocaleDateString() + " " + d.toLocaleTimeString();
        } else {
            return "";
        }
    };


    // Init
    $scope.getCollections();
});
