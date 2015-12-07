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

//Die richtige Seite in der Navbar wird angezeigt
App.controller('MainCtrl', function ($scope, $http, $rootScope, $log) {
	$(".nav a").on("click", function () {
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});

	$scope.login = function (usernameInput, passwordInput) {
		$rootScope.username = usernameInput;
		$rootScope.password = passwordInput;
	};

	$scope.logout = function () {
		$rootScope.username = null;
	};

	// Dataset Vars
	$scope.chosenCollection = null;

	$scope.setChosenCollection = function (id) {
		// jshint: getcollection is not defined
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

	$scope.deleteDataset = function (id) {
		delete $scope.data[id];
		if ($rootScope.chosenDataset === id) {
			$rootScope.chosenDataset = null;
		}
	};

	var database = "prelife";
	var username = $rootScope.username;
	var password = $rootScope.password;

	// jshint: getcollections is not defined
	getCollections(database, username, password, $http, function (response) {
		$scope.collections = response;
		$scope.numberOfCollections = Object.keys(response).length;
	});


	$scope.formatTimeString = function (timeString) {
		var d = new Date(timeString);
		return d.toLocaleDateString() + " " + d.toLocaleTimeString();
	};
});