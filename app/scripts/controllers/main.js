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

//Der Service hilft, um die Logindaten über alle Controller hinweg zu realisieren
App.service('sharedLogin', function() {
    var username = "a";
    var password = "a";
    
    return {
        getUsername: function() {
            return username;
        },
        getPassword: function() {
            return password;
        },
		login: function(usernameInput, passwordInput) {
            username = usernameInput;
			password = passwordInput;
        }
    };
});

//Die richtige Seite in der Navbar wird angezeigt
App.controller('MainCtrl', function ($scope, $http, $rootScope, $log, sharedLogin) {
	$(".nav a").on("click", function () {
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});

	$scope.login = function (usernameInput, passwordInput) {
		sharedLogin.login(usernameInput, passwordInput);
		$rootScope.loggedIn = true;
		console.log("asbhdbasbh");
		console.log(usernameInput);
		console.log(sharedLogin.getUsername());
	};

	$scope.logout = function () {
		$rootScope.username = null;
		$rootScope.loggedIn = false;
		$scope.$apply();
	};

	// Der ausgewählte (angeklickte) Datensatz
	$scope.chosenCollection = null;

	//Auswählen eines neuen Datensatzes
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

	//Einen Datensatz löschen
	$scope.deleteDataset = function (id) {
		delete $scope.data[id];
		if ($rootScope.chosenDataset === id) {
			$rootScope.chosenDataset = null;
		}
	};

	var database = "prelife";
	var username = sharedLogin.getUsername();
	var password = sharedLogin.getPassword();

	// jshint: getcollections is not defined
	getCollections(database, username, password, $http, function (response) {
		$scope.collections = response;
		$scope.numberOfCollections = Object.keys(response).length;
	});

	//Eine schönere Anzeige des Datums
	$scope.formatTimeString = function (timeString) {
		var d = new Date(timeString);
		return d.toLocaleDateString() + " " + d.toLocaleTimeString();
	};

	//Ab hier: Noch nicht funktionierender JSON-Download. Nötig?
	
	/*
	$scope.download = function () {
		var data = {a:1, b:2, c:3};
		var json = JSON.stringify(data);
		var blob = new Blob([json], {type: "application/json"});
		var url  = URL.createObjectURL(blob);

		var a = document.createElement('a');
		a.download    = "backup.json";	//Dateiname
		a.href        = url;
		a.textContent = "Download backup.json";	//Anzeigetext

		document.getElementById('test').appendChild(a);
	};

	$scope.downloadJSON = function () {

	};
	
	*/

	/*
	var data = {a:1, b:2, c:3};
	var json = JSON.stringify(data);
	var blob = new Blob([json], {type: "application/json"});
	var url  = URL.createObjectURL(blob);

	var a = document.createElement('a');
	a.download    = "backup.json";
	a.href        = url;
	a.textContent = "Download backup.json";
	
	document.getElementById('content').appendChild(a);
	*/

/*
	$scope.someFunction = function() {
		document.getElementById('content').innerHTML("test");
	});
*/

});

/*
var obj = {a: 123, b: "4 5 6"};
var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

$('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#content');
*/