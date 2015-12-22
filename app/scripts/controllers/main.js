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
App.controller('MainCtrl', function ($scope, $http, $rootScope, $log, sharedLogin) {
	$(".nav a").on("click", function () {
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});
	
	// Der ausgewählte (angeklickte) Datensatz
	$scope.chosenCollection = null;

    /**
     * Auswählen eines neuen Datensatzes
     * Wenn der Datensatz bereits ausgewählt ist, wird er nicht mehr ausgewählt (deselected...)
     * 
     * @param id ID eines Datensatzes, der ausgewählt werden soll
     */
	$scope.setChosenCollection = function (id) {
		getCollection(database, id, username, password, $http, function (response) {
			if ($scope.chosenCollection === response) {
				$scope.chosenCollection = null;
			} else {
				$scope.chosenCollection = response;
			}
			$log.info($scope.chosenCollection.data._id);
			
			//Direkte Weiterlung zum Datensatz
			window.location="#/views/" + $scope.chosenCollection.data._id;
		});
	};

	$scope.getIdOfCollection = function (collection) {
		return collection ? collection.data._id : null;
	};

    /**
     * Einen Datensatz löschen
     * 
     * @param id ID des Datensatzes, der gelöscht werden soll
     */

	//Die zugehörigen Ansichten sollten auch gelöscht werden!! ------> funktioniert noch nicht
	$scope.deleteDataset = function (id) {
		delete $scope.data[id];
		if ($rootScope.chosenDataset === id) {
			$rootScope.chosenDataset = null;
		}
	};

	var database = "prelife";
	var username = sharedLogin.getUsername();
	var password = sharedLogin.getPassword();

    /**
     * Verbindung zur Datenbank, der die Datensätze abfragt
     */
	getCollections(database, username, password, $http, function (response) {
		$scope.collections = response;
		$scope.numberOfCollections = Object.keys(response).length;
	});

    /**
     * @return Eine schönere Anzeige des Datums
     */
	$scope.formatTimeString = function (timeString) {
		var d = new Date(timeString);
		return d.toLocaleDateString() + " " + d.toLocaleTimeString();
	};
});