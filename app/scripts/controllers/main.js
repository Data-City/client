'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the datacityApp
 */
 
var App = angular.module('datacityApp');

/*
App.controller('MainCtrl', ['$scope', '$rootScope',function ($scope, $rootScope) {
	        console.log($rootScope.mySetting);
	    }
	]);
*/

//Die richtige Seite in der Navbar wird angezeigt
App.controller('MainCtrl', function($scope, $http, $rootScope) {
	$(".nav a").on("click", function()	{
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});

	// Zeilen auswählen Tabelle
	$scope.selectRow = function(id){
		if (id == $rootScope.dataset) {
			return success;
		} else {
			return success;
		}
	}

	//Initialisierung
	if ($rootScope.username == null){
		$rootScope.username = "Kalle Ölsand";
	} 

	if ($rootScope.chosenDataset == null){
		$rootScope.chosenDataset = 1;
	} 

	// Login
	$scope.login = function(usernameInput){
		$rootScope.username = usernameInput;
	}

	// Dataset Vars
	$rootScope.dataset = {
		setChosenDataset : function(id) {
			$rootScope.chosenDataset = id;
		}
	}



	$scope.deleteDataset = function(id) {
		delete $scope.data[id];
		if($rootScope.chosenDataset == id) {
			$rootScope.chosenDataset = null;
		}
	}
	


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
	
	$scope.createNewView = function(chooseViewAfter) {
		var nextID = $scope.numberOfViews() + 1;
		var d = new Date();
		$scope.views[nextID] = {
			id: nextID,
			name: 'Neue Ansicht',
			collectionID: $rootScope.chosenDataset,
			creator: $rootScope.username,
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
			collectionID: 1, //Geburtenrate in Hessen
			creator: "Steffen Statistiker",
			createdAt: "26.11.2015 17:25 Uhr",
			dimensions: {
				name: "",
				area: "",
				height: "",
				color: ""
			}
		},
		2: {
			id: 2,
			name: "Logfile vom 24.12.2015",
			collectionID: 2, //Apache Log Files
			creator: "Benedikt Rumtreiber",
			createdAt: "30.11.2015 16:40 Uhr",
			dimensions: {
				name: {
					attr: null	
				},
				area: {
					attr: null
				},
				height: {
					attr: null
				}
			}
		},
		3: {
			id: 3,
			name: "Export vom 1.1.1994",
			collectionID: 3, //User SQL Export
			creator: "Benedikt Rumtreiber",
			createdAt: "30.11.2015 16:41 Uhr",
			dimensions: {
				name: {
					attr: null	
				},
				area: {
					attr: null
				},
				height: {
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
				}
			}
		},
		2 : {
			id: 2,
			name: "Apache Log Files",
			creator: "Viktor Verwalter",
			createdAt: "16.03.2013 15:48 Uhr",
			attributes: {
				1: {
					name: "Name",
					type: "String"
				},
				2: {
					name: "Datum",
					type: "int"
				},
				3: {
					name: "Anzahl Zeilen",
					type: "int"
				},
				4: {
					name: "Fehler?",
					type: "boolean"
				}
			}
		},
		3 : {
			id: 3,
			name: "User SQL Export",
			creator: "Renate Ritter",
			createdAt: "28.04.2014 19:57 Uhr",
			attributes: {
				1: {
					name: "Benutzer",
					type: "String"
				},
				2: {
					name: "Anzahl Datensätze",
					type: "int"
				},
				3: {
					name: "Datum",
					type: "String"
				},
			}
		},
	};
	$scope.data = exampleData;
});