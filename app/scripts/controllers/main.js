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
App.controller('MainCtrl', function ($scope, $http, $rootScope, $log, $filter, sharedLogin) {
	$(".nav a").on("click", function () {
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});
	
	// Verbindungsdaten
	var database = "prelife";
	var username = sharedLogin.getUsername();
	var password = sharedLogin.getPassword();
	
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
	$scope.setChosenCollectionAndRedirect = function (colid) {
		getCollection(database, colid, username, password, $http, function (response) {
			// Toggle: Select<->Deselect
			$scope.chosenCollection = ($scope.chosenCollection === response) ? null : response;
			
			// TODO
			// Fehlen statistische Meta-Daten? (colid + "_dc_stats")
			// Ja: 
			//	Fehlt Aggregations-URL: /db/colid/_aggrs/statistics, die zum aktuellen ETag passt?
			//	Ja: Spinner einblenden, Aggregation(s-URL) anlegen und abrufen
			//		(Das kann dauern: 8.000.000 => ~43 Sekunden, deshalb Spinner)
			
			//Direkte Weiterlung zum Datensatz
			window.location="#/views/" + $scope.chosenCollection.data._id;
		});
	};
    
    $scope.setChosenCollectionOnly = function (id) {
		getCollection(database, id, username, password, $http, function (response) {
			if ($scope.chosenCollection === response) {
				$scope.chosenCollection = null;
			} else {
				$scope.chosenCollection = response;
			}
			$log.info($scope.chosenCollection.data._id);
		});
	};
   
	$scope.getIdOfCollection = function (collection) {
		return collection ? collection.data._id : null;
	};

	// TODO Funktion umbenennen in deleteCollection
	// TODO Funktion erhält collection id als Parameter
    /**
     * @param id ID der Collection, die gelöscht werden soll
     */
	$scope.deleteDataset = function () {
        // TODO Alle Collections löschen, die mit collectionId_dc_ beginnen
		
        //Erst den Datensatz löschen
        //Dann
        //Alle dazugehörigen Ansichten auch
        console.log("chosenDataset: ");
        console.log($scope.chosenCollection);
	};
    
	// TODO Funktion umbennenen in getAllCollections
	// TODO Ergebnis in $scope.allCollections speichern
    /**
     * Holt alle Collections
     */
	getCollections(database, username, password, $http, function (response) {
		$scope.allCollections = response;
		$scope.displayableCollections = $filter('colsbydisplayability')(response);
		$scope.numberOfDisplayableCollections = Object.keys($scope.displayableCollections).length;
	});

    /**
     * @return Eine schönere Anzeige des Datums
     */
	$scope.formatTimeString = function (timeString) {
		var d = new Date(timeString);
		return d.toLocaleDateString() + " " + d.toLocaleTimeString();
	};
});