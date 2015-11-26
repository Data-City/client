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
	
	
	var exampleData = {
		1 : {
			id: 1,
			name: "Geburtenrate in Hessen",
			creator: "Max Mustermann",
			createdAt: "25.11.2015 11:25 Uhr"
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
