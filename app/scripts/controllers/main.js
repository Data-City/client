'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the datacityApp
 */
 
var App = angular.module('datacityApp');

App.controller('MainCtrl', function($scope, $http) {
	$(".nav a").on("click", function()	{
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});

	// DataView Vars
	$scope.dataView = {
		showUploadForm : false
	};
	
	$scope.viewView = {
		setChosenView : function(id) {
			if($scope.chosenView == id) {
				$scope.chosenView = null;
			} else {
				$scope.chosenView = id;
			}
		}
	}
	
	$scope.numberOfViews = function() {
			var count = Object.keys($scope.views).length;
			return count;
	};
	
	$scope.username = "Kalle Ölsand";
	
	$scope.createNewView = function(chooseViewAfter) {
		var nextID = $scope.numberOfViews() + 1;
		var d = new Date();
		$scope.views[nextID] = {
			id: nextID,
			name: 'Neue Ansicht',
			collectionID: null,
			creator: $scope.username,
			createdAt: d.toLocaleDateString() 
		}
		if(typeof chooseViewAfter !== 'undefined') {
			$scope.viewView.setChosenView(nextID);
		}
	};
	
	$scope.deleteView = function(id) {
		delete $scope.views[id];
		if($scope.chosenView == id) {
			$scope.chosenView = null;
		}
	}
	
	$scope.chosenCollection = null;
	$scope.chosenView = null;
	
	var exampleViews = {
		1: {
			id: 1,
			name: "GebRate1",
			collectionID: 1,
			creator: "Steffen Statistiker",
			createdAt: "26.11.2015 17:25 Uhr",
			dimensions: {
				name: {
					attr: null	
				},
				area: {
					attr: null
				},
				height: {
					attr: null
				},
				color: {
					attr: null
				}
			}
		}
	};
	
	$scope.views = exampleViews;
		
	var exampleData = {
		1 : {
			id: 1,
			name: "Geburtenrate in Hessen",
			creator: "Max Mustermann",
			createdAt: "25.11.2015 11:25 Uhr",
			attributes: {
				1: {
					name: "Stadt",
					type: "String"
				},
				2: {
					name: "Jahr",
					type: "int"
				},
				3: {
					name: "Geburten (absolut)",
					type: "int"
				},
				4: {
					name: "Veränderung zum Vorjahr in Prozent",
					type: "double"
				}
			},
			values: {
				1: {
					Stadt: "Wiesbaden",
					Jahr: 1990,
					Absolut: 345,
					Diff: 1.08
				},
			}
		},
		2 : {
			id: 2,
			name: "Apache Log Files",
			creator: "Viktor Verwalter",
			createdAt: "16.03.2013 15:48 Uhr"
		},
		3 : {
			id: 3,
			name: "User SQL Export",
			creator: "Renate Ritter",
			createdAt: "28.04.2014 19:57 Uhr"
		},
	};
	$scope.data = exampleData;
	
});

function ausgabe(){	
	var ausgabe = document.getElementById("ausgabe");
	ausgabe.innerHTML = 
	"Fläche: " + document.getElementById("flaecheselektieren").value +
	"<br>Höhe: " + document.getElementById("hoeheselektieren").value +
	"<br>Farbe: " + document.getElementById("farbeselektieren").value;
	
	if (document.getElementById("farbenRadio1").checked === true){
		ausgabe.innerHTML += "<br>Aufsteigend wurde selektiert";
	} else {
		ausgabe.innerHTML += "<br>Absteigend wurde selektiert";
	}
	
	ausgabe.innerHTML +=
	"<br>Grupperigung nach: " + document.getElementById("gruppierung").value +
	"<br>Verbindungen bilden mit: " + document.getElementById("verbindung").value + 
	"<br>Der Winkel: " + document.getElementById("winkelInput").value + "°" + 
	"<br>Die Granularität: " + document.getElementById("granularInput").value + "%";
}
