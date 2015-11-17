'use strict';

/**
 * @ngdoc function
 * @name datacityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the datacityApp
 */
 
 //Angular Test; Yeoman Tutorial
angular.module('datacityApp')
  .controller('MainCtrl', function ($scope) {
    $scope.todos = ['Item 1', 'Item 2', 'Item 3'];
    $scope.addTodo = function () {
      $scope.todos.push($scope.todo);
      $scope.todo = '';
    };
    $scope.removeTodo = function (index) {
      $scope.todos.splice(index, 1);
    };
  });
  
  //metadaten repeaten
	var App = angular.module('App', []);

	App.controller('TodoCtrl', function($scope, $http) {
	  $http.get('dataCity.json')
		   .then(function(res){
			  $scope.todos = res.data;                
			});
	});
  
function uploadWechseln(){
	var uploadAusgewaehlt;
	var ausgabe = "";
	var upload = document.getElementById("uploadAusgabe");
	
	if (document.getElementById("uploadRadio").checked === true) {
		ausgabe = document.getElementById("upload").innerHTML;
	} else {
		ausgabe = document.getElementById("datensatzAnzeigen").innerHTML;
	}
	
	upload.innerHTML = "<div class='container'>" + ausgabe + "</div>";
}

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
